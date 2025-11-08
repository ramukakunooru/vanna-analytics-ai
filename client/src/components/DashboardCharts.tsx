import ChartCard from "./ChartCard";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInvoiceTrends, useTopVendors, useCategorySpend, useCashOutflow } from "@/hooks/useAnalytics";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function DashboardCharts() {
  const { data: invoiceTrendData, isLoading: trendsLoading } = useInvoiceTrends();
  const { data: vendorSpendData, isLoading: vendorsLoading } = useTopVendors();
  const { data: categoryData, isLoading: categoryLoading } = useCategorySpend();
  const { data: cashOutflowData, isLoading: outflowLoading } = useCashOutflow();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Invoice Volume & Value Trend">
        {trendsLoading ? (
          <div className="h-80 flex items-center justify-center bg-muted/30 rounded animate-pulse">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={invoiceTrendData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="volume" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Invoice Count" />
              <Line yAxisId="right" type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Total Value ($)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Spend by Vendor (Top 10)">
        {vendorsLoading ? (
          <div className="h-80 flex items-center justify-center bg-muted/30 rounded animate-pulse">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={vendorSpendData || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="vendor" type="category" width={120} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="spend" fill="hsl(var(--chart-1))" name="Spend ($)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Spend by Category">
        {categoryLoading ? (
          <div className="h-80 flex items-center justify-center bg-muted/30 rounded animate-pulse">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {(categoryData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Cash Outflow Forecast">
        {outflowLoading ? (
          <div className="h-80 flex items-center justify-center bg-muted/30 rounded animate-pulse">
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cashOutflowData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="actual" fill="hsl(var(--chart-1))" name="Actual" />
              <Bar dataKey="forecast" fill="hsl(var(--chart-3))" name="Forecast" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
