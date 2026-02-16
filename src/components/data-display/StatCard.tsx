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
    <Card variant="elevated" padding="lg" className={cn("relative overflow-hidden", className)}>
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-body-sm text-navy-500 dark:text-navy-400">{title}</p>
          <p className="mt-1 text-heading-lg font-bold text-navy-900 dark:text-white sm:text-display-md">{value}</p>
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
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-navy-100/80 bg-gradient-to-br from-white to-navy-50/70 text-navy-500 shadow-sm dark:border-navy-700 dark:from-surface-dark-card dark:to-navy-900/40 sm:h-12 sm:w-12">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

export { StatCard, type StatCardProps };
