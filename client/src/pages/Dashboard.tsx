import MetricCard from "@/components/MetricCard";
import DashboardCharts from "@/components/DashboardCharts";
import InvoicesTable from "@/components/InvoicesTable";
import { DollarSign, FileText, Upload, TrendingUp } from "lucide-react";

const mockInvoices = [
  { id: '1', vendor: 'Acme Corp', date: '2024-01-15', invoiceNumber: 'INV-2024-001', amount: 12500, status: 'paid' as const },
  { id: '2', vendor: 'TechSupply Inc', date: '2024-01-18', invoiceNumber: 'INV-2024-002', amount: 8900, status: 'paid' as const },
  { id: '3', vendor: 'Office Solutions', date: '2024-01-20', invoiceNumber: 'INV-2024-003', amount: 3400, status: 'pending' as const },
  { id: '4', vendor: 'Cloud Services Ltd', date: '2024-01-22', invoiceNumber: 'INV-2024-004', amount: 15600, status: 'overdue' as const },
  { id: '5', vendor: 'Marketing Agency', date: '2024-01-25', invoiceNumber: 'INV-2024-005', amount: 22000, status: 'paid' as const },
  { id: '6', vendor: 'Legal Associates', date: '2024-01-28', invoiceNumber: 'INV-2024-006', amount: 9800, status: 'pending' as const },
  { id: '7', vendor: 'Construction Co', date: '2024-02-01', invoiceNumber: 'INV-2024-007', amount: 45000, status: 'paid' as const },
  { id: '8', vendor: 'IT Services', date: '2024-02-05', invoiceNumber: 'INV-2024-008', amount: 6700, status: 'pending' as const },
  { id: '9', vendor: 'Consulting Group', date: '2024-02-08', invoiceNumber: 'INV-2024-009', amount: 18900, status: 'overdue' as const },
  { id: '10', vendor: 'Equipment Rental', date: '2024-02-10', invoiceNumber: 'INV-2024-010', amount: 4200, status: 'paid' as const },
  { id: '11', vendor: 'Software Licenses', date: '2024-02-12', invoiceNumber: 'INV-2024-011', amount: 12300, status: 'pending' as const },
  { id: '12', vendor: 'Shipping & Logistics', date: '2024-02-15', invoiceNumber: 'INV-2024-012', amount: 7500, status: 'paid' as const },
];

export default function Dashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time insights into your invoice and spending data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Spend (YTD)"
          value="$2.4M"
          trend={{ value: "12.5%", isPositive: true }}
          icon={DollarSign}
        />
        <MetricCard
          title="Total Invoices"
          value="1,847"
          trend={{ value: "8.2%", isPositive: true }}
          icon={FileText}
        />
        <MetricCard
          title="Documents Uploaded"
          value="2,156"
          trend={{ value: "15.3%", isPositive: true }}
          icon={Upload}
        />
        <MetricCard
          title="Average Invoice Value"
          value="$1,299"
          trend={{ value: "3.1%", isPositive: false }}
          icon={TrendingUp}
        />
      </div>

      <DashboardCharts />

      <InvoicesTable invoices={mockInvoices} />
    </div>
  );
}
