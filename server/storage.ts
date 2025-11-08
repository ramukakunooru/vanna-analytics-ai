import type { Vendor, InsertVendor, Customer, InsertCustomer, Invoice, InsertInvoice, LineItem, InsertLineItem, Payment, InsertPayment } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for analytics data operations
export interface IStorage {
  // Vendors
  getVendor(id: string): Promise<Vendor | undefined>;
  getAllVendors(): Promise<Vendor[]>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  
  // Customers
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  
  // Invoices
  getInvoice(id: string): Promise<Invoice | undefined>;
  getAllInvoices(filters?: { search?: string; status?: string }): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  
  // Line Items
  getLineItemsByInvoice(invoiceId: string): Promise<LineItem[]>;
  createLineItem(lineItem: InsertLineItem): Promise<LineItem>;
  
  // Payments
  getPaymentsByInvoice(invoiceId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  
  // Analytics queries
  getStats(): Promise<{
    totalSpendYTD: number;
    totalInvoices: number;
    documentsUploaded: number;
    averageInvoiceValue: number;
  }>;
  
  getInvoiceTrends(): Promise<Array<{
    month: string;
    volume: number;
    value: number;
  }>>;
  
  getTopVendors(limit: number): Promise<Array<{
    vendor: string;
    spend: number;
  }>>;
  
  getCategorySpend(): Promise<Array<{
    name: string;
    value: number;
  }>>;
  
  getCashOutflow(): Promise<Array<{
    month: string;
    forecast: number;
    actual: number | null;
  }>>;
}

export class MemStorage implements IStorage {
  private vendors: Map<string, Vendor>;
  private customers: Map<string, Customer>;
  private invoices: Map<string, Invoice>;
  private lineItems: Map<string, LineItem>;
  private payments: Map<string, Payment>;

  constructor() {
    this.vendors = new Map();
    this.customers = new Map();
    this.invoices = new Map();
    this.lineItems = new Map();
    this.payments = new Map();
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async getAllVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = {
      id,
      name: insertVendor.name,
      category: insertVendor.category,
      contactEmail: insertVendor.contactEmail ?? null
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = {
      id,
      name: insertCustomer.name,
      region: insertCustomer.region ?? null
    };
    this.customers.set(id, customer);
    return customer;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getAllInvoices(filters?: { search?: string; status?: string }): Promise<Invoice[]> {
    let invoices = Array.from(this.invoices.values());
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      invoices = invoices.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters?.status) {
      invoices = invoices.filter(inv => inv.status === filters.status);
    }
    
    return invoices;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = {
      id,
      vendorId: insertInvoice.vendorId,
      customerId: insertInvoice.customerId ?? null,
      invoiceNumber: insertInvoice.invoiceNumber,
      dateIssued: insertInvoice.dateIssued,
      dueDate: insertInvoice.dueDate,
      amount: insertInvoice.amount,
      status: insertInvoice.status
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async getLineItemsByInvoice(invoiceId: string): Promise<LineItem[]> {
    return Array.from(this.lineItems.values()).filter(item => item.invoiceId === invoiceId);
  }

  async createLineItem(insertLineItem: InsertLineItem): Promise<LineItem> {
    const id = randomUUID();
    const lineItem: LineItem = { ...insertLineItem, id };
    this.lineItems.set(id, lineItem);
    return lineItem;
  }

  async getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(payment => payment.invoiceId === invoiceId);
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { ...insertPayment, id };
    this.payments.set(id, payment);
    return payment;
  }

  async getStats(): Promise<{
    totalSpendYTD: number;
    totalInvoices: number;
    documentsUploaded: number;
    averageInvoiceValue: number;
  }> {
    const invoices = Array.from(this.invoices.values());
    const totalSpend = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalInvoices = invoices.length;
    
    return {
      totalSpendYTD: totalSpend,
      totalInvoices,
      documentsUploaded: totalInvoices + Math.floor(totalInvoices * 0.3),
      averageInvoiceValue: totalInvoices > 0 ? totalSpend / totalInvoices : 0,
    };
  }

  async getInvoiceTrends(): Promise<Array<{
    month: string;
    volume: number;
    value: number;
  }>> {
    // Simplified mock implementation
    return [
      { month: 'Jan', volume: 145, value: 185000 },
      { month: 'Feb', volume: 168, value: 215000 },
      { month: 'Mar', volume: 152, value: 198000 },
      { month: 'Apr', volume: 187, value: 245000 },
      { month: 'May', volume: 195, value: 268000 },
      { month: 'Jun', volume: 203, value: 285000 },
    ];
  }

  async getTopVendors(limit: number): Promise<Array<{
    vendor: string;
    spend: number;
  }>> {
    const vendorSpend = new Map<string, number>();
    const invoicesList = Array.from(this.invoices.values());
    
    for (const invoice of invoicesList) {
      const vendor = this.vendors.get(invoice.vendorId);
      if (vendor) {
        const current = vendorSpend.get(vendor.name) || 0;
        vendorSpend.set(vendor.name, current + parseFloat(invoice.amount));
      }
    }
    
    return Array.from(vendorSpend.entries())
      .map(([vendor, spend]) => ({ vendor, spend }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, limit);
  }

  async getCategorySpend(): Promise<Array<{
    name: string;
    value: number;
  }>> {
    const categorySpend = new Map<string, number>();
    const invoicesList = Array.from(this.invoices.values());
    
    for (const invoice of invoicesList) {
      const vendor = this.vendors.get(invoice.vendorId);
      if (vendor) {
        const current = categorySpend.get(vendor.category) || 0;
        categorySpend.set(vendor.category, current + parseFloat(invoice.amount));
      }
    }
    
    return Array.from(categorySpend.entries())
      .map(([name, value]) => ({ name, value }));
  }

  async getCashOutflow(): Promise<Array<{
    month: string;
    forecast: number;
    actual: number | null;
  }>> {
    // Simplified mock implementation
    return [
      { month: 'Jul', forecast: 295000, actual: 285000 },
      { month: 'Aug', forecast: 315000, actual: 305000 },
      { month: 'Sep', forecast: 325000, actual: null },
      { month: 'Oct', forecast: 310000, actual: null },
      { month: 'Nov', forecast: 335000, actual: null },
      { month: 'Dec', forecast: 350000, actual: null },
    ];
  }
}

export const storage = new MemStorage();
