import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function ChartCard({ title, children, action }: ChartCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        {action}
      </div>
      <div className="w-full" data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {children}
      </div>
    </Card>
  );
}
