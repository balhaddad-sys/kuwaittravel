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
        "travel-panel relative rounded-[var(--radius-card)] px-4 py-12 text-center sm:px-6",
        className
      )}
    >
      {icon && (
        <div className="mx-auto mb-4 h-16 w-16">
          <div className="travel-icon-circle travel-icon-circle-lg mx-auto h-16 w-16 text-navy-500 dark:text-navy-300">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-heading-md font-bold text-navy-800 dark:text-white">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-body-md text-navy-600 dark:text-navy-200">{description}</p>
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
