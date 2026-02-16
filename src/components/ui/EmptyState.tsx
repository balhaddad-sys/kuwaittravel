import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "travel-panel relative overflow-hidden rounded-[var(--radius-card)] px-4 py-12 text-center sm:px-6",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/70 to-transparent" />
      {icon && (
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-surface-border/80 bg-white/85 text-navy-400 shadow-sm dark:border-surface-dark-border/80 dark:bg-surface-dark-card/80 dark:text-navy-500">
          {icon}
        </div>
      )}
      <h3 className="text-heading-md font-semibold text-navy-700 dark:text-navy-200">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-body-md text-navy-500 dark:text-navy-300">{description}</p>
      )}
      {action && (
        <Button variant="primary" className="mt-6" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
