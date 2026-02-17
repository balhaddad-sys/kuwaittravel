"use client";

import Link from "next/link";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Plus, BookOpen, Wallet, Users, Settings } from "lucide-react";

interface OwnerQuickActionsProps {
  className?: string;
}

const actions = [
  { href: "/portal/trips/create", icon: Plus, key: "create" },
  { href: "/portal/bookings", icon: BookOpen, key: "bookings" },
  { href: "/portal/wallet", icon: Wallet, key: "wallet" },
  { href: "/portal/staff", icon: Users, key: "staff" },
  { href: "/portal/settings", icon: Settings, key: "settings" },
] as const;

function actionLabel(key: string, t: (ar: string, en: string) => string): string {
  if (key === "create") return t("رحلة جديدة", "New Trip");
  if (key === "bookings") return t("الحجوزات", "Bookings");
  if (key === "wallet") return t("المحفظة", "Wallet");
  if (key === "staff") return t("الفريق", "Team");
  return t("الإعدادات", "Settings");
}

export function OwnerQuickActions({ className }: OwnerQuickActionsProps) {
  const { t } = useDirection();

  return (
    <div
      className={cn(
        "sticky top-[60px] z-[var(--z-sticky)] border-b border-surface-border bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,17,22,0.05)] dark:border-surface-dark-border dark:bg-surface-dark-card lg:hidden",
        className
      )}
    >
      <div className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              prefetch
              className="inline-flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border border-surface-border bg-white px-3.5 py-2 text-body-sm font-semibold text-navy-700 shadow-none transform-gpu transition-[transform,background-color,color,border-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:border-gold-300 hover:bg-gold-50 active:scale-[0.97] dark:border-surface-dark-border dark:bg-surface-dark dark:text-navy-100 dark:hover:border-gold-700 dark:hover:bg-gold-900/20"
            >
              <Icon className="h-4 w-4" />
              <span>{actionLabel(action.key, t)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
