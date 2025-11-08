import { db } from "./db";
import { vendors, customers, invoices, lineItems, payments } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

interface AnalyticsData {
  vendors: Array<{
    name: string;
    category: string;
    contactEmail?: string;
  }>;
  customers: Array<{
    name: string;
    region?: string;
  }>;
  invoices: Array<{
    vendorName: string;
    customerName: string;
    invoiceNumber: string;
    dateIssued: string;
    dueDate: string;
    status: string;
    lineItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
    payments: Array<{
      datePaid: string;
      amountPaid: number;
      paymentMethod: string;
    }>;
  }>;
}

async function seed() {
  try {
    console.log("Starting database seed...");

    // Read the JSON file
    const dataPath = path.join(process.cwd(), "data", "Analytics_Test_Data.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data: AnalyticsData = JSON.parse(rawData);

    console.log(`Loaded ${data.vendors.length} vendors, ${data.customers.length} customers, ${data.invoices.length} invoices`);

    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(payments);
    await db.delete(lineItems);
    await db.delete(invoices);
    await db.delete(vendors);
    await db.delete(customers);

    // Insert vendors
    console.log("Inserting vendors...");
    const vendorMap = new Map<string, string>();
    for (const vendor of data.vendors) {
      const [inserted] = await db.insert(vendors).values({
        name: vendor.name,
        category: vendor.category,
        contactEmail: vendor.contactEmail || null,
      }).returning();
      vendorMap.set(vendor.name, inserted.id);
    }

    // Insert customers
    console.log("Inserting customers...");
    const customerMap = new Map<string, string>();
    for (const customer of data.customers) {
      const [inserted] = await db.insert(customers).values({
        name: customer.name,
        region: customer.region || null,
      }).returning();
      customerMap.set(customer.name, inserted.id);
    }

    // Insert invoices with line items and payments
    console.log("Inserting invoices...");
    for (const invoice of data.invoices) {
      const vendorId = vendorMap.get(invoice.vendorName);
      const customerId = customerMap.get(invoice.customerName);

      if (!vendorId) {
        console.warn(`Vendor not found: ${invoice.vendorName}`);
        continue;
      }

      // Calculate total amount from line items
      const totalAmount = invoice.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      // Insert invoice
      const [insertedInvoice] = await db.insert(invoices).values({
        vendorId,
        customerId: customerId || null,
        invoiceNumber: invoice.invoiceNumber,
        dateIssued: new Date(invoice.dateIssued),
        dueDate: new Date(invoice.dueDate),
        amount: totalAmount.toFixed(2),
        status: invoice.status,
      }).returning();

      // Insert line items
      for (const item of invoice.lineItems) {
        await db.insert(lineItems).values({
          invoiceId: insertedInvoice.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toFixed(2),
        });
      }

      // Insert payments
      for (const payment of invoice.payments) {
        await db.insert(payments).values({
          invoiceId: insertedInvoice.id,
          datePaid: new Date(payment.datePaid),
          amountPaid: payment.amountPaid.toFixed(2),
          paymentMethod: payment.paymentMethod,
        });
      }
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
