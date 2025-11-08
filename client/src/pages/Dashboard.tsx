import MetricCard from "@/components/MetricCard";
import DashboardCharts from "@/components/DashboardCharts";
import InvoicesTable from "@/components/InvoicesTable";
import { DollarSign, FileText, Upload, TrendingUp } from "lucide-react";
import { useStats, useInvoices } from "@/hooks/useAnalytics";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time insights into your invoice and spending data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted/30 animate-pulse" />
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Spend (YTD)"
              value={formatCurrency(stats?.totalSpendYTD || 0)}
              trend={{ value: "12.5%", isPositive: true }}
              icon={DollarSign}
            />
            <MetricCard
              title="Total Invoices"
              value={formatNumber(stats?.totalInvoices || 0)}
              trend={{ value: "8.2%", isPositive: true }}
              icon={FileText}
            />
            <MetricCard
              title="Documents Uploaded"
              value={formatNumber(stats?.documentsUploaded || 0)}
              trend={{ value: "15.3%", isPositive: true }}
              icon={Upload}
            />
            <MetricCard
              title="Average Invoice Value"
              value={formatCurrency(stats?.averageInvoiceValue || 0)}
              trend={{ value: "3.1%", isPositive: false }}
              icon={TrendingUp}
            />
          </>
        )}
      </div>

      <DashboardCharts />

      {invoicesLoading ? (
        <div className="h-96 rounded-lg bg-muted/30 animate-pulse" />
      ) : (
        <InvoicesTable invoices={invoices || []} />
      )}
    </div>
  );
}
