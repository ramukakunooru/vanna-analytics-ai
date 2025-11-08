import { db } from "./db";
import { vendors, customers, invoices, lineItems, payments } from "@shared/schema";
import type { Vendor, InsertVendor, Customer, InsertCustomer, Invoice, InsertInvoice, LineItem, InsertLineItem, Payment, InsertPayment } from "@shared/schema";
import { eq, like, sql, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async getVendor(id: string): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor;
  }

  async getAllVendors(): Promise<Vendor[]> {
    return db.select().from(vendors);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(insertVendor).returning();
    return vendor;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return db.select().from(customers);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(customers).values(insertCustomer).returning();
    return customer;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async getAllInvoices(filters?: { search?: string; status?: string }): Promise<Invoice[]> {
    let query = db.select().from(invoices);
    
    if (filters?.search) {
      query = query.where(like(invoices.invoiceNumber, `%${filters.search}%`)) as any;
    }
    
    if (filters?.status) {
      query = query.where(eq(invoices.status, filters.status)) as any;
    }
    
    return query.orderBy(desc(invoices.dateIssued));
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const [invoice] = await db.insert(invoices).values(insertInvoice).returning();
    return invoice;
  }

  async getLineItemsByInvoice(invoiceId: string): Promise<LineItem[]> {
    return db.select().from(lineItems).where(eq(lineItems.invoiceId, invoiceId));
  }

  async createLineItem(insertLineItem: InsertLineItem): Promise<LineItem> {
    const [lineItem] = await db.insert(lineItems).values(insertLineItem).returning();
    return lineItem;
  }

  async getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.invoiceId, invoiceId));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async getStats(): Promise<{
    totalSpendYTD: number;
    totalInvoices: number;
    documentsUploaded: number;
    averageInvoiceValue: number;
  }> {
    const result = await db.select({
      totalSpend: sql<string>`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`,
      count: sql<number>`COUNT(*)`,
    }).from(invoices);

    const totalSpendYTD = parseFloat(result[0]?.totalSpend || '0');
    const totalInvoices = result[0]?.count || 0;
    
    return {
      totalSpendYTD,
      totalInvoices,
      documentsUploaded: Math.floor(totalInvoices * 1.17), // Simulated: 17% more docs than invoices
      averageInvoiceValue: totalInvoices > 0 ? totalSpendYTD / totalInvoices : 0,
    };
  }

  async getInvoiceTrends(): Promise<Array<{
    month: string;
    volume: number;
    value: number;
  }>> {
    const result = await db.select({
      month: sql<string>`TO_CHAR(${invoices.dateIssued}, 'Mon')`,
      volume: sql<number>`COUNT(*)`,
      value: sql<string>`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`,
    })
    .from(invoices)
    .groupBy(sql`TO_CHAR(${invoices.dateIssued}, 'Mon')`, sql`EXTRACT(MONTH FROM ${invoices.dateIssued})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${invoices.dateIssued})`);

    return result.map(r => ({
      month: r.month,
      volume: r.volume,
      value: parseFloat(r.value),
    }));
  }

  async getTopVendors(limit: number): Promise<Array<{
    vendor: string;
    spend: number;
  }>> {
    const result = await db.select({
      vendor: vendors.name,
      spend: sql<string>`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`,
    })
    .from(invoices)
    .innerJoin(vendors, eq(invoices.vendorId, vendors.id))
    .groupBy(vendors.name)
    .orderBy(desc(sql`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`))
    .limit(limit);

    return result.map(r => ({
      vendor: r.vendor,
      spend: parseFloat(r.spend),
    }));
  }

  async getCategorySpend(): Promise<Array<{
    name: string;
    value: number;
  }>> {
    const result = await db.select({
      name: vendors.category,
      value: sql<string>`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`,
    })
    .from(invoices)
    .innerJoin(vendors, eq(invoices.vendorId, vendors.id))
    .groupBy(vendors.category);

    return result.map(r => ({
      name: r.name,
      value: parseFloat(r.value),
    }));
  }

  async getCashOutflow(): Promise<Array<{
    month: string;
    forecast: number;
    actual: number | null;
  }>> {
    // For forecast, we'll use a simple projection based on historical data
    // In a real app, this would be more sophisticated
    const historicalAvg = await db.select({
      avgSpend: sql<string>`COALESCE(AVG(CAST(${invoices.amount} AS DECIMAL)), 0)`,
    }).from(invoices);

    const avg = parseFloat(historicalAvg[0]?.avgSpend || '0');
    
    // Get actual data for past months
    const actualData = await db.select({
      month: sql<string>`TO_CHAR(${invoices.dueDate}, 'Mon')`,
      monthNum: sql<number>`EXTRACT(MONTH FROM ${invoices.dueDate})`,
      total: sql<string>`COALESCE(SUM(CAST(${invoices.amount} AS DECIMAL)), 0)`,
    })
    .from(invoices)
    .where(sql`${invoices.dueDate} >= CURRENT_DATE - INTERVAL '6 months'`)
    .groupBy(sql`TO_CHAR(${invoices.dueDate}, 'Mon')`, sql`EXTRACT(MONTH FROM ${invoices.dueDate})`)
    .orderBy(sql`EXTRACT(MONTH FROM ${invoices.dueDate})`);

    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result: Array<{ month: string; forecast: number; actual: number | null }> = [];

    for (const month of months) {
      const actual = actualData.find(d => d.month === month);
      result.push({
        month,
        forecast: Math.round(avg * 10 * (1 + Math.random() * 0.2)),
        actual: actual ? parseFloat(actual.total) : null,
      });
    }

    return result;
  }
}

export const dbStorage = new DbStorage();
