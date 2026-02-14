"use client";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Phone, MoreVertical } from "lucide-react";

interface PassengerRowProps {
  name: string;
  phone?: string;
  passportStatus: "uploaded" | "missing" | "expired";
  paymentStatus: "paid" | "partial" | "unpaid";
  visaStatus: "approved" | "pending" | "rejected" | "not_required";
  avatarUrl?: string;
  onAction?: () => void;
  className?: string;
}

const passportBadge = {
  uploaded: { variant: "success" as const, label: "جواز ✓" },
  missing: { variant: "error" as const, label: "جواز مفقود" },
  expired: { variant: "warning" as const, label: "جواز منتهي" },
};

const paymentBadge = {
  paid: { variant: "success" as const, label: "مدفوع" },
  partial: { variant: "warning" as const, label: "جزئي" },
  unpaid: { variant: "error" as const, label: "غير مدفوع" },
};

const visaBadge = {
  approved: { variant: "success" as const, label: "تأشيرة ✓" },
  pending: { variant: "warning" as const, label: "قيد المعالجة" },
  rejected: { variant: "error" as const, label: "مرفوض" },
  not_required: { variant: "default" as const, label: "لا يلزم" },
};

function PassengerRow({
  name,
  phone,
  passportStatus,
  paymentStatus,
  visaStatus,
  avatarUrl,
  onAction,
  className,
}: PassengerRowProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-[var(--radius-lg)] p-3 transition-colors hover:bg-surface-muted dark:hover:bg-surface-dark-card",
      className
    )}>
      <Avatar src={avatarUrl} alt={name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-medium text-navy-900 dark:text-white truncate">{name}</p>
        {phone && (
          <p className="text-body-sm text-navy-400 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {phone}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        <Badge variant={passportBadge[passportStatus].variant} size="sm">
          {passportBadge[passportStatus].label}
        </Badge>
        <Badge variant={paymentBadge[paymentStatus].variant} size="sm">
          {paymentBadge[paymentStatus].label}
        </Badge>
        <Badge variant={visaBadge[visaStatus].variant} size="sm">
          {visaBadge[visaStatus].label}
        </Badge>
      </div>
      {onAction && (
        <button onClick={onAction} className="shrink-0 rounded-lg p-1.5 text-navy-400 hover:bg-surface-muted transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { PassengerRow, type PassengerRowProps };
