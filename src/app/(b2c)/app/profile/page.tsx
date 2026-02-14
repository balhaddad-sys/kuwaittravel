"use client";

import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import {
  FileText, CreditCard, Settings, HelpCircle, LogOut, ChevronLeft,
  Shield, Globe,
} from "lucide-react";

const menuItems = [
  { label: "المستندات والجوازات", icon: FileText, href: "/app/profile/documents" },
  { label: "طرق الدفع", icon: CreditCard, href: "/app/profile/payment-methods" },
  { label: "الأمان والخصوصية", icon: Shield, href: "/app/profile/security" },
  { label: "الإعدادات", icon: Settings, href: "/app/profile/settings" },
  { label: "المساعدة والدعم", icon: HelpCircle, href: "/app/help" },
];

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="bg-surface-muted dark:bg-surface-dark min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-bl from-navy-700 to-navy-900 px-4 pt-12 pb-8">
        <Container>
          <div className="flex items-center gap-4">
            <Avatar size="xl" className="border-4 border-white/20" />
            <div>
              <h1 className="text-heading-lg font-bold text-white">أحمد محمد العلي</h1>
              <p className="text-body-md text-navy-200">+965 9900 1234</p>
              <Badge variant="gold" size="sm" className="mt-1">مسافر موثق ✓</Badge>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-6 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "رحلات", value: "5" },
            { label: "حجوزات", value: "8" },
            { label: "تقييمات", value: "3" },
          ].map((stat, i) => (
            <Card key={i} variant="elevated" padding="md" className="text-center">
              <p className="text-heading-md font-bold text-navy-900 dark:text-white">{stat.value}</p>
              <p className="text-body-sm text-navy-500">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Menu */}
        <Card variant="elevated" padding="sm">
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.href)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors hover:bg-surface-muted dark:hover:bg-surface-dark-card rounded-[var(--radius-md)]"
            >
              <item.icon className="h-5 w-5 text-navy-500 shrink-0" />
              <span className="flex-1 text-body-md text-navy-700 dark:text-navy-200">{item.label}</span>
              <ChevronLeft className="h-4 w-4 text-navy-400 rtl:rotate-180" />
            </button>
          ))}
        </Card>

        {/* Language */}
        <Card variant="outlined" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-navy-500" />
              <span className="text-body-md text-navy-700 dark:text-navy-200">اللغة</span>
            </div>
            <LanguageToggle />
          </div>
        </Card>

        {/* Logout */}
        <Button variant="ghost" fullWidth className="text-error hover:bg-error-light" leftIcon={<LogOut className="h-5 w-5" />}>
          تسجيل الخروج
        </Button>
      </Container>
    </div>
  );
}
