import MetricCard from '../MetricCard';
import { DollarSign } from 'lucide-react';

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
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
        icon={DollarSign}
      />
    </div>
  );
}
