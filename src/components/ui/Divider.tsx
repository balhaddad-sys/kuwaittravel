import { cn } from "@/lib/utils/cn";

interface DividerProps {
  className?: string;
  label?: string;
}

function Divider({ className, label }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-slate-200 dark:bg-[#383838]" />
        <span className="text-body-sm text-slate-400 shrink-0">{label}</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-[#383838]" />
      </div>
    );
  }

  return <hr className={cn("border-slate-200 dark:border-[#383838]", className)} />;
}

export { Divider, type DividerProps };
