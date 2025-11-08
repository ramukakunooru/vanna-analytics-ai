import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./db-storage";
import { vendors, invoices } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Analytics Dashboard API Routes
  
  // GET /api/stats - Overview totals
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await dbStorage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  // GET /api/invoice-trends - Monthly invoice count & spend
  app.get("/api/invoice-trends", async (req, res) => {
    try {
      const trends = await dbStorage.getInvoiceTrends();
      res.json(trends);
    } catch (error) {
      console.error("Error fetching invoice trends:", error);
      res.status(500).json({ error: "Failed to fetch invoice trends" });
    }
  });

  // GET /api/vendors/top10 - Top 10 vendors by spend
  app.get("/api/vendors/top10", async (req, res) => {
    try {
      const topVendors = await dbStorage.getTopVendors(10);
      res.json(topVendors);
    } catch (error) {
      console.error("Error fetching top vendors:", error);
      res.status(500).json({ error: "Failed to fetch top vendors" });
    }
  });

  // GET /api/category-spend - Spend by category
  app.get("/api/category-spend", async (req, res) => {
    try {
      const categorySpend = await dbStorage.getCategorySpend();
      res.json(categorySpend);
    } catch (error) {
      console.error("Error fetching category spend:", error);
      res.status(500).json({ error: "Failed to fetch category spend" });
    }
  });

  // GET /api/cash-outflow - Forecasted outflow
  app.get("/api/cash-outflow", async (req, res) => {
    try {
      const cashOutflow = await dbStorage.getCashOutflow();
      res.json(cashOutflow);
    } catch (error) {
      console.error("Error fetching cash outflow:", error);
      res.status(500).json({ error: "Failed to fetch cash outflow forecast" });
    }
  });

  // GET /api/invoices - List of invoices with search/filter support
  app.get("/api/invoices", async (req, res) => {
    try {
      const { search, status } = req.query;
      const filters: { search?: string; status?: string } = {};
      
      if (typeof search === 'string') filters.search = search;
      if (typeof status === 'string') filters.status = status;
      
      const invoicesList = await dbStorage.getAllInvoices(filters);
      
      // Enrich with vendor names
      const enrichedInvoices = await Promise.all(
        invoicesList.map(async (invoice) => {
          const vendor = await dbStorage.getVendor(invoice.vendorId);
          return {
            id: invoice.id,
            vendor: vendor?.name || 'Unknown',
            date: invoice.dateIssued.toISOString().split('T')[0],
            invoiceNumber: invoice.invoiceNumber,
            amount: parseFloat(invoice.amount),
            status: invoice.status,
          };
        })
      );
      
      res.json(enrichedInvoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  // POST /api/chat-with-data - AI-powered chat endpoint
  app.post("/api/chat-with-data", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required" });
      }

      const { processChatQuery } = await import("./ai-chat");
      const response = await processChatQuery(query);
      
      res.json(response);
    } catch (error) {
      console.error("Error processing chat query:", error);
      res.status(500).json({ error: "Failed to process query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
