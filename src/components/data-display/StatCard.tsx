import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; label: string };
  icon?: React.ReactNode;
  className?: string;
}

function StatCard({ title, value, change, icon, className }: StatCardProps) {
  return (
    <Card variant="elevated" padding="lg" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-body-sm text-navy-500 dark:text-navy-400">{title}</p>
          <p className="mt-1 text-display-md font-bold text-navy-900 dark:text-white">{value}</p>
          {change && (
            <p className={cn(
              "mt-1 text-body-sm font-medium",
              change.value >= 0 ? "text-success" : "text-error"
            )}>
              {change.value >= 0 ? "+" : ""}{change.value}% {change.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-navy-50 dark:bg-navy-800 text-navy-500">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export { StatCard, type StatCardProps };
