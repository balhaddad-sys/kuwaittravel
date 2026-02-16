import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; label: string };
  icon?: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

function StatCard({ title, value, change, icon, hoverable = false, className }: StatCardProps) {
  const isPositive = (change?.value || 0) >= 0;

  return (
    <Card
      variant="elevated"
      padding="lg"
      hoverable={hoverable}
      className={cn("travel-stat-accent relative overflow-hidden", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-body-sm text-navy-500 dark:text-navy-300">{title}</p>
          <p className="tabular-nums mt-1 text-heading-lg font-bold text-navy-900 animate-count-up dark:text-white sm:text-display-md">
            {value}
          </p>
          {change && (
            <p
              className={cn(
                "mt-1 inline-flex items-center gap-1 text-body-sm font-semibold",
                isPositive ? "text-success" : "text-error"
              )}
            >
              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span className="tabular-nums">
                {isPositive ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-navy-500 dark:text-navy-300">{change.label}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="travel-icon-circle travel-icon-circle-md shrink-0 sm:travel-icon-circle-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export { StatCard, type StatCardProps };
