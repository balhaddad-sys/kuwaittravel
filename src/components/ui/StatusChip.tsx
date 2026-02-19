"use client";

import { cn } from "@/lib/utils/cn";
import { useDirection } from "@/providers/DirectionProvider";

type Status = "active" | "draft" | "pending" | "completed" | "cancelled" | "suspended";

interface StatusChipProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; labelAr: string; dotColor: string; bgColor: string; textColor: string }> = {
  active: { label: "Active", labelAr: "نشط", dotColor: "bg-success", bgColor: "bg-success-light dark:bg-green-900/25", textColor: "text-green-800 dark:text-green-300" },
  draft: { label: "Draft", labelAr: "مسودة", dotColor: "bg-gray-400", bgColor: "bg-gray-100 dark:bg-gray-900/45", textColor: "text-gray-700 dark:text-gray-200" },
  pending: { label: "Pending", labelAr: "قيد الانتظار", dotColor: "bg-warning", bgColor: "bg-warning-light dark:bg-orange-900/25", textColor: "text-orange-800 dark:text-orange-300" },
  completed: { label: "Completed", labelAr: "مكتمل", dotColor: "bg-success", bgColor: "bg-success-light dark:bg-green-900/25", textColor: "text-green-800 dark:text-green-300" },
  cancelled: { label: "Cancelled", labelAr: "ملغي", dotColor: "bg-error", bgColor: "bg-error-light dark:bg-red-900/25", textColor: "text-red-800 dark:text-red-300" },
  suspended: { label: "Suspended", labelAr: "معلق", dotColor: "bg-error", bgColor: "bg-error-light dark:bg-red-900/25", textColor: "text-red-800 dark:text-red-300" },
};

function StatusChip({ status, className }: StatusChipProps) {
  const { language } = useDirection();
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 py-1 text-body-sm font-medium backdrop-blur-sm",
        config.bgColor,
        config.textColor,
        "border-current/15",
        className
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", config.dotColor)} />
      {language === "ar" ? config.labelAr : config.label}
    </span>
  );
}

export { StatusChip, type StatusChipProps };
