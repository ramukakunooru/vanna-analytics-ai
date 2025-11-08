import ChartCard from "./ChartCard";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const invoiceTrendData = [
  { month: 'Jan', volume: 145, value: 185000 },
  { month: 'Feb', volume: 168, value: 215000 },
  { month: 'Mar', volume: 152, value: 198000 },
  { month: 'Apr', volume: 187, value: 245000 },
  { month: 'May', volume: 195, value: 268000 },
  { month: 'Jun', volume: 203, value: 285000 },
];

const vendorSpendData = [
  { vendor: 'Acme Corp', spend: 125000 },
  { vendor: 'TechSupply Inc', spend: 98500 },
  { vendor: 'Cloud Services', spend: 87200 },
  { vendor: 'Marketing Agency', spend: 76800 },
  { vendor: 'Construction Co', spend: 65400 },
  { vendor: 'Legal Associates', spend: 54300 },
  { vendor: 'IT Services', spend: 48900 },
  { vendor: 'Consulting Group', spend: 42100 },
  { vendor: 'Equipment Rental', spend: 38700 },
  { vendor: 'Software Licenses', spend: 32500 },
];

const categoryData = [
  { name: 'Services', value: 385000 },
  { name: 'Equipment', value: 245000 },
  { name: 'Software', value: 165000 },
  { name: 'Marketing', value: 128000 },
  { name: 'Operations', value: 95000 },
];

const cashOutflowData = [
  { month: 'Jul', forecast: 295000, actual: 285000 },
  { month: 'Aug', forecast: 315000, actual: 305000 },
  { month: 'Sep', forecast: 325000, actual: null },
  { month: 'Oct', forecast: 310000, actual: null },
  { month: 'Nov', forecast: 335000, actual: null },
  { month: 'Dec', forecast: 350000, actual: null },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Invoice Volume & Value Trend">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={invoiceTrendData}>
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
      </ChartCard>

      <ChartCard title="Spend by Vendor (Top 10)">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={vendorSpendData} layout="vertical">
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
      </ChartCard>

      <ChartCard title="Spend by Category">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
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
      </ChartCard>

      <ChartCard title="Cash Outflow Forecast">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={cashOutflowData}>
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
      </ChartCard>
    </div>
  );
}
