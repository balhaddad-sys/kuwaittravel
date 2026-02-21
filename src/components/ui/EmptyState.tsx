import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";
import { ArrowRight } from "lucide-react";

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
        "eo-panel relative rounded-[var(--radius-card)] px-4 py-8 text-center sm:px-6 sm:py-12",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16">
          <div className="eo-icon-circle mx-auto h-12 w-12 text-slate-500 dark:text-slate-300 sm:h-16 sm:w-16">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-body-lg font-bold text-slate-800 dark:text-white sm:text-heading-md">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-body-sm text-slate-500 dark:text-slate-400 sm:mt-2 sm:text-body-md">{description}</p>
      )}
      {action && (
        <Button
          variant="primary"
          className="mt-6"
          rightIcon={<ArrowRight className="h-4 w-4 rtl:rotate-180" />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };
