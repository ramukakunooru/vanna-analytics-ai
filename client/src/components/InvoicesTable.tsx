import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Invoice {
  id: string;
  vendor: string;
  date: string;
  invoiceNumber: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface InvoicesTableProps {
  invoices: Invoice[];
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredInvoices = invoices.filter(
    inv => 
      inv.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  return (
    <Card>
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">Recent Invoices</h3>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
            data-testid="input-search-invoices"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left py-3 px-4">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover-elevate active-elevate-2 -mx-2 px-2 py-1 rounded">
                  Vendor
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover-elevate active-elevate-2 -mx-2 px-2 py-1 rounded">
                  Date
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover-elevate active-elevate-2 -mx-2 px-2 py-1 rounded">
                  Invoice #
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-4">
                <button className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider hover-elevate active-elevate-2 -mx-2 px-2 py-1 rounded ml-auto">
                  Amount
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="text-xs font-medium uppercase tracking-wider">Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedInvoices.map((invoice, idx) => (
              <tr
                key={invoice.id}
                className={`border-b last:border-0 hover-elevate ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                data-testid={`row-invoice-${invoice.id}`}
              >
                <td className="py-3 px-4 font-medium">{invoice.vendor}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{invoice.date}</td>
                <td className="py-3 px-4 text-sm font-mono">{invoice.invoiceNumber}</td>
                <td className="py-3 px-4 text-right font-medium">
                  ${invoice.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <Badge className={`${getStatusColor(invoice.status)} capitalize`} data-testid={`badge-status-${invoice.status}`}>
                    {invoice.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            data-testid="button-next-page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
