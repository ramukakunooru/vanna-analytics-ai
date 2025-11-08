import ChartCard from '../ChartCard';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ChartCardExample() {
  return (
    <div className="p-6 space-y-6">
      <ChartCard
        title="Invoice Volume & Value Trend"
        action={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      >
        <div className="h-80 flex items-center justify-center bg-muted/30 rounded">
          <p className="text-sm text-muted-foreground">Chart visualization area</p>
        </div>
      </ChartCard>
    </div>
  );
}
