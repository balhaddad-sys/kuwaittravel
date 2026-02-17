import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        <span className="travel-chip inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
          Rahal
        </span>
        <h1 className="text-display-md font-bold text-stone-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-body-lg text-stone-500 dark:text-stone-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 mt-3 sm:mt-0">{actions}</div>}
    </div>
  );
}

export { PageHeader, type PageHeaderProps };
