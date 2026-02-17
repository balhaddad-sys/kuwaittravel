"use client";

import { Modal } from "@/components/ui/Modal";
import { useDirection } from "@/providers/DirectionProvider";
import { formatKWD } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface PriceLineItem {
  labelAr: string;
  labelEn: string;
  amount: number;
  type?: "base" | "fee" | "discount" | "tax";
}

interface PriceBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  items: PriceLineItem[];
  total: number;
  currency?: string;
}

function PriceBreakdownModal({ open, onClose, items, total }: PriceBreakdownModalProps) {
  const { t } = useDirection();

  return (
    <Modal open={open} onClose={onClose} title={t("تفاصيل السعر", "Price Breakdown")} size="sm">
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className={cn(
              "text-body-md",
              item.type === "discount" ? "text-teal-600 dark:text-teal-400" : "text-stone-600 dark:text-stone-300"
            )}>
              {t(item.labelAr, item.labelEn)}
            </span>
            <span className={cn(
              "font-numbers text-body-md font-medium",
              item.type === "discount" ? "text-teal-600 dark:text-teal-400" : "text-stone-900 dark:text-white"
            )}>
              {item.type === "discount" ? "-" : ""}{formatKWD(Math.abs(item.amount))}
            </span>
          </div>
        ))}
        <div className="border-t-2 border-stone-200 pt-3 dark:border-stone-700">
          <div className="flex items-center justify-between">
            <span className="text-body-lg font-bold text-stone-900 dark:text-white">
              {t("الإجمالي", "Total")}
            </span>
            <span className="font-numbers text-heading-md font-bold text-teal-700 dark:text-teal-400">
              {formatKWD(total)}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { PriceBreakdownModal, type PriceBreakdownModalProps, type PriceLineItem };
