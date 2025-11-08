import { db } from "./db";
import { vendors, invoices } from "@shared/schema";
import { sql, desc, eq } from "drizzle-orm";
import { dbStorage } from "./db-storage";

interface ChatQuery {
  query: string;
}

interface ChatResponse {
  message: string;
  sql?: string;
  results?: any[];
  visualization?: 'table' | 'chart' | 'number';
}

/**
 * Process natural language queries and convert them to SQL
 * This is a simplified implementation. In production, you would use:
 * - Vanna AI for SQL generation
 * - OpenAI/Anthropic for natural language understanding
 * - Groq for fast inference
 */
export async function processChatQuery(queryText: string): Promise<ChatResponse> {
  const lowerQuery = queryText.toLowerCase();

  // Pattern matching for common queries
  // In a real implementation, this would use an LLM to generate SQL

  // Total spend queries
  if (lowerQuery.includes('total spend') || lowerQuery.includes('total spending')) {
    const days = extractDays(lowerQuery);
    const stats = await dbStorage.getStats();
    
    return {
      message: `The total spend ${days ? `in the last ${days} days` : 'year-to-date'} is $${stats.totalSpendYTD.toLocaleString()}.`,
      sql: `SELECT SUM(CAST(amount AS DECIMAL)) as total FROM invoices${days ? ` WHERE date_issued >= CURRENT_DATE - INTERVAL '${days} days'` : ''};`,
      results: [{ total: stats.totalSpendYTD }],
      visualization: 'number',
    };
  }

  // Top vendors queries
  if (lowerQuery.includes('top') && (lowerQuery.includes('vendor') || lowerQuery.includes('supplier'))) {
    const limit = extractNumber(lowerQuery) || 5;
    const topVendors = await dbStorage.getTopVendors(limit);
    
    return {
      message: `Here are the top ${limit} vendors by spend:`,
      sql: `SELECT v.name as vendor, SUM(CAST(i.amount AS DECIMAL)) as spend
FROM invoices i
INNER JOIN vendors v ON i.vendor_id = v.id
GROUP BY v.name
ORDER BY spend DESC
LIMIT ${limit};`,
      results: topVendors,
      visualization: 'table',
    };
  }

  // Overdue invoices
  if (lowerQuery.includes('overdue')) {
    const overdueInvoices = await dbStorage.getAllInvoices({ status: 'overdue' });
    const enriched = await Promise.all(
      overdueInvoices.map(async (inv) => {
        const vendor = await dbStorage.getVendor(inv.vendorId);
        return {
          invoice_number: inv.invoiceNumber,
          vendor: vendor?.name || 'Unknown',
          due_date: inv.dueDate.toISOString().split('T')[0],
          amount: parseFloat(inv.amount),
        };
      })
    );
    
    return {
      message: `Found ${overdueInvoices.length} overdue invoices:`,
      sql: `SELECT i.invoice_number, v.name as vendor, i.due_date, i.amount
FROM invoices i
INNER JOIN vendors v ON i.vendor_id = v.id
WHERE i.status = 'overdue'
ORDER BY i.due_date;`,
      results: enriched,
      visualization: 'table',
    };
  }

  // Pending invoices
  if (lowerQuery.includes('pending')) {
    const pendingInvoices = await dbStorage.getAllInvoices({ status: 'pending' });
    const total = pendingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    
    return {
      message: `You have ${pendingInvoices.length} pending invoices totaling $${total.toLocaleString()}.`,
      sql: `SELECT COUNT(*) as count, SUM(CAST(amount AS DECIMAL)) as total
FROM invoices
WHERE status = 'pending';`,
      results: [{ count: pendingInvoices.length, total }],
      visualization: 'number',
    };
  }

  // Invoice count
  if (lowerQuery.includes('how many') && lowerQuery.includes('invoice')) {
    const stats = await dbStorage.getStats();
    
    return {
      message: `There are ${stats.totalInvoices} invoices in the system.`,
      sql: `SELECT COUNT(*) as count FROM invoices;`,
      results: [{ count: stats.totalInvoices }],
      visualization: 'number',
    };
  }

  // Category spending
  if (lowerQuery.includes('category') || lowerQuery.includes('categories')) {
    const categorySpend = await dbStorage.getCategorySpend();
    
    return {
      message: `Here's the breakdown of spending by category:`,
      sql: `SELECT v.category, SUM(CAST(i.amount AS DECIMAL)) as spend
FROM invoices i
INNER JOIN vendors v ON i.vendor_id = v.id
GROUP BY v.category
ORDER BY spend DESC;`,
      results: categorySpend.map(c => ({ category: c.name, spend: c.value })),
      visualization: 'table',
    };
  }

  // Average invoice value
  if (lowerQuery.includes('average') && lowerQuery.includes('invoice')) {
    const stats = await dbStorage.getStats();
    
    return {
      message: `The average invoice value is $${stats.averageInvoiceValue.toLocaleString()}.`,
      sql: `SELECT AVG(CAST(amount AS DECIMAL)) as average FROM invoices;`,
      results: [{ average: stats.averageInvoiceValue }],
      visualization: 'number',
    };
  }

  // Default response with suggestions
  return {
    message: `I can help you analyze your data! Try asking:
    
• "What's the total spend in the last 90 days?"
• "Show me the top 5 vendors by spend"
• "List all overdue invoices"
• "How many pending invoices do I have?"
• "Show spending by category"
• "What's the average invoice value?"`,
    visualization: 'table',
  };
}

function extractDays(query: string): number | null {
  const match = query.match(/(\d+)\s*days?/i);
  return match ? parseInt(match[1]) : null;
}

function extractNumber(query: string): number | null {
  const match = query.match(/top\s*(\d+)/i);
  return match ? parseInt(match[1]) : null;
}
