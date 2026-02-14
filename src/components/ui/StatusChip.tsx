import { cn } from "@/lib/utils/cn";

type Status = "active" | "draft" | "pending" | "completed" | "cancelled" | "suspended";

interface StatusChipProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; labelAr: string; dotColor: string; bgColor: string; textColor: string }> = {
  active: { label: "Active", labelAr: "نشط", dotColor: "bg-success", bgColor: "bg-success-light", textColor: "text-green-800" },
  draft: { label: "Draft", labelAr: "مسودة", dotColor: "bg-navy-400", bgColor: "bg-navy-100", textColor: "text-navy-700" },
  pending: { label: "Pending", labelAr: "قيد الانتظار", dotColor: "bg-warning", bgColor: "bg-warning-light", textColor: "text-amber-800" },
  completed: { label: "Completed", labelAr: "مكتمل", dotColor: "bg-success", bgColor: "bg-success-light", textColor: "text-green-800" },
  cancelled: { label: "Cancelled", labelAr: "ملغي", dotColor: "bg-error", bgColor: "bg-error-light", textColor: "text-red-800" },
  suspended: { label: "Suspended", labelAr: "معلق", dotColor: "bg-error", bgColor: "bg-error-light", textColor: "text-red-800" },
};

function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-chip)] text-body-sm font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
      {config.labelAr}
    </span>
  );
}

export { StatusChip, type StatusChipProps };
