import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  contactEmail: text("contact_email"),
});

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  region: text("region"),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  customerId: varchar("customer_id").references(() => customers.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  dateIssued: timestamp("date_issued").notNull(),
  dueDate: timestamp("due_date").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'paid', 'pending', 'overdue'
});

// Line items table
export const lineItems = pgTable("line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
});

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  datePaid: timestamp("date_paid").notNull(),
  amountPaid: decimal("amount_paid", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
});

// Relations
export const vendorsRelations = relations(vendors, ({ many }) => ({
  invoices: many(invoices),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [invoices.vendorId],
    references: [vendors.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  lineItems: many(lineItems),
  payments: many(payments),
}));

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [lineItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, {
    fields: [payments.invoiceId],
    references: [invoices.id],
  }),
}));

// Insert schemas
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export const insertInvoiceSchema = createInsertSchema(invoices).omit({ id: true });
export const insertLineItemSchema = createInsertSchema(lineItems).omit({ id: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true });

// Types
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type LineItem = typeof lineItems.$inferSelect;
export type InsertLineItem = z.infer<typeof insertLineItemSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
