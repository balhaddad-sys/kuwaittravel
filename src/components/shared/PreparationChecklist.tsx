"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Circle, SkipForward, FileText, Backpack, Heart, Wallet, Sparkles } from "lucide-react";
import type { ChecklistCategory, ChecklistItemStatus } from "@/types/checklist";

interface ChecklistItemProps {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
  descriptionAr?: string;
  category: ChecklistCategory;
  required: boolean;
  status: ChecklistItemStatus;
  onToggle: (id: string, status: ChecklistItemStatus) => void;
}

const categoryIcon: Record<ChecklistCategory, React.ReactNode> = {
  document: <FileText className="h-4 w-4" />,
  packing: <Backpack className="h-4 w-4" />,
  health: <Heart className="h-4 w-4" />,
  financial: <Wallet className="h-4 w-4" />,
  spiritual: <Sparkles className="h-4 w-4" />,
};

const categoryColor: Record<ChecklistCategory, string> = {
  document: "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/30",
  packing: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30",
  health: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30",
  financial: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30",
  spiritual: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30",
};

function ChecklistItem({ id, title, titleAr, description, descriptionAr, category, required, status, onToggle }: ChecklistItemProps) {
  const { language } = useDirection();

  const nextStatus = (): ChecklistItemStatus => {
    if (status === "pending") return "completed";
    if (status === "completed") return required ? "pending" : "skipped";
    return "pending";
  };

  return (
    <button
      type="button"
      onClick={() => onToggle(id, nextStatus())}
      className={cn(
        "flex w-full items-start gap-3 rounded-[var(--radius-md)] p-3 text-start transition-colors",
        status === "completed" ? "bg-sky-50/50 dark:bg-sky-900/10" : "hover:bg-slate-50 dark:hover:bg-[#262626]/50"
      )}
    >
      <div className="mt-0.5 shrink-0">
        {status === "completed" ? (
          <CheckCircle2 className="h-5 w-5 text-sky-500" />
        ) : status === "skipped" ? (
          <SkipForward className="h-5 w-5 text-slate-400" />
        ) : (
          <Circle className="h-5 w-5 text-slate-300 dark:text-sky-400/50" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-body-md font-medium", status === "completed" ? "text-slate-400 line-through" : "text-slate-800 dark:text-white")}>
          {language === "ar" ? titleAr : title}
          {required && <span className="ms-1 text-orange-500">*</span>}
        </p>
        {(description || descriptionAr) && (
          <p className="mt-0.5 text-body-sm text-slate-500 dark:text-neutral-300/60">
            {language === "ar" ? descriptionAr || description : description || descriptionAr}
          </p>
        )}
      </div>
      <div className={cn("shrink-0 rounded-lg p-1.5", categoryColor[category])}>
        {categoryIcon[category]}
      </div>
    </button>
  );
}

interface PreparationChecklistProps {
  items: {
    id: string;
    title: string;
    titleAr: string;
    description?: string;
    descriptionAr?: string;
    category: ChecklistCategory;
    required: boolean;
    status: ChecklistItemStatus;
  }[];
  onToggle: (id: string, status: ChecklistItemStatus) => void;
  className?: string;
}

function PreparationChecklist({ items, onToggle, className }: PreparationChecklistProps) {
  const { t } = useDirection();
  const completed = items.filter((i) => i.status === "completed").length;
  const total = items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-body-sm">
          <span className="font-medium text-slate-700 dark:text-neutral-100">
            {t("التحضيرات", "Preparation")}
          </span>
          <span className="font-medium text-sky-600 dark:text-sky-400">
            {completed}/{total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-[#262626]">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-surface-border dark:divide-surface-dark-border">
        {items.map((item) => (
          <ChecklistItem key={item.id} {...item} onToggle={onToggle} />
        ))}
      </div>
    </div>
  );
}

export { PreparationChecklist, type PreparationChecklistProps };
