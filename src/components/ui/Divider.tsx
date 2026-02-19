import { cn } from "@/lib/utils/cn";

interface DividerProps {
  className?: string;
  label?: string;
}

function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-surface-border dark:bg-surface-dark-border" />
        <span className="text-body-sm text-gray-400 shrink-0">{label}</span>
        <div className="flex-1 h-px bg-surface-border dark:bg-surface-dark-border" />
      </div>
    );
  }

  return <hr className={cn("border-surface-border dark:border-surface-dark-border", className)} />;
}

export { Divider, type DividerProps };
