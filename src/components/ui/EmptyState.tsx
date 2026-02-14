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
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && <div className="mb-4 text-navy-300 dark:text-navy-600">{icon}</div>}
      <h3 className="text-heading-md font-semibold text-navy-700 dark:text-navy-200">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-body-md text-navy-400">{description}</p>
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
