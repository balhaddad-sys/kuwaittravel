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
      padding="md"
      hoverable={hoverable}
      className={cn("!p-4 sm:!p-4 lg:!p-6", className)}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="truncate text-body-sm text-gray-500 dark:text-indigo-200">{title}</p>
          <p className="tabular-nums mt-1 text-heading-sm font-bold text-gray-900 dark:text-white sm:text-heading-lg lg:text-display-md">
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
              <span className="text-gray-500 dark:text-indigo-200">{change.label}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="travel-icon-circle travel-icon-circle-md shrink-0 lg:travel-icon-circle-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export { StatCard, type StatCardProps };
