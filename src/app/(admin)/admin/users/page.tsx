"use client";

import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { SearchInput } from "@/components/forms/SearchInput";
import { useState } from "react";

const mockUsers = [
  { id: "1", name: "أحمد محمد العلي", phone: "+965 9900 1234", role: "traveler", trips: 5, verified: true, joined: "2025-06-15" },
  { id: "2", name: "محمد علي", phone: "+965 9900 5555", role: "campaign_owner", trips: 0, verified: true, joined: "2024-06-15" },
  { id: "3", name: "فاطمة حسين", phone: "+965 9900 6666", role: "traveler", trips: 3, verified: true, joined: "2025-08-20" },
  { id: "4", name: "علي الحسيني", phone: "+965 6600 7777", role: "traveler", trips: 1, verified: false, joined: "2026-01-10" },
];

const roleLabels: Record<string, { ar: string; variant: "default" | "gold" | "info" }> = {
  traveler: { ar: "مسافر", variant: "default" },
  campaign_owner: { ar: "مدير حملة", variant: "gold" },
  admin: { ar: "مشرف", variant: "info" },
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter((u) => u.name.includes(search) || u.phone.includes(search));

  return (
    <>
      <AppBar title="إدارة المستخدمين" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "المستخدمون" }]} />
      <Container className="py-6 space-y-4">
        <SearchInput placeholder="ابحث بالاسم أو رقم الهاتف..." onSearch={setSearch} />
        <Card variant="outlined" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted dark:bg-surface-dark-card">
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المستخدم</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الهاتف</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الدور</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الرحلات</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">التحقق</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الانضمام</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.map((user) => {
                  const rl = roleLabels[user.role] || roleLabels.traveler;
                  return (
                    <tr key={user.id} className="hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar size="sm" />
                          <span className="text-body-md font-medium text-navy-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-navy-500 font-mono" dir="ltr">{user.phone}</td>
                      <td className="px-4 py-3"><Badge variant={rl.variant} size="sm">{rl.ar}</Badge></td>
                      <td className="px-4 py-3 text-body-md text-navy-600">{user.trips}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.verified ? "success" : "warning"} size="sm">
                          {user.verified ? "موثق" : "غير موثق"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-navy-500">{user.joined}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </>
  );
}
