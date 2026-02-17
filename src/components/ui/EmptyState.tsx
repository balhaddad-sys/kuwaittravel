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
        "travel-panel relative rounded-[var(--radius-card)] px-4 py-8 text-center sm:px-6 sm:py-12",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-3 h-12 w-12 sm:mb-4 sm:h-16 sm:w-16">
          <div className="travel-icon-circle mx-auto h-12 w-12 text-navy-500 dark:text-navy-300 sm:h-16 sm:w-16 sm:travel-icon-circle-lg">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-body-lg font-bold text-navy-800 dark:text-white sm:text-heading-md">{title}</h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-sm text-body-sm text-navy-600 dark:text-navy-200 sm:mt-2 sm:text-body-md">{description}</p>
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
