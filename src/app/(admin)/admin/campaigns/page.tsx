"use client";

import { useState } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/forms/SearchInput";
import { CheckCircle2, XCircle, Eye, Building2 } from "lucide-react";

const mockCampaigns = [
  { id: "1", name: "حملة النور", owner: "محمد العلي", license: "AWQ-2024-1234", status: "approved", trips: 12, rating: 4.8, date: "2024-06-15" },
  { id: "2", name: "حملة الهدى", owner: "أحمد الصالح", license: "AWQ-2024-5678", status: "approved", trips: 8, rating: 4.6, date: "2024-08-20" },
  { id: "3", name: "حملة البيان", owner: "حسين الكاظمي", license: "AWQ-2026-5678", status: "pending", trips: 0, rating: 0, date: "2026-02-12" },
  { id: "4", name: "حملة الصفا", owner: "فاطمة الموسوي", license: "AWQ-2026-9012", status: "pending", trips: 0, rating: 0, date: "2026-02-13" },
  { id: "5", name: "حملة المتقين", owner: "علي الحسني", license: "AWQ-2025-3333", status: "rejected", trips: 0, rating: 0, date: "2025-12-01" },
];

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = mockCampaigns.filter((c) => {
    const matchesSearch = c.name.includes(search) || c.owner.includes(search);
    const matchesFilter = filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <AppBar title="إدارة الحملات" breadcrumbs={[{ label: "المشرف العام", href: "/admin/dashboard" }, { label: "الحملات" }]} />
      <Container className="py-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput placeholder="ابحث بالاسم أو المالك..." onSearch={setSearch} className="flex-1" />
          <div className="flex gap-2">
            {[
              { value: "all", label: "الكل" },
              { value: "pending", label: "قيد المراجعة" },
              { value: "approved", label: "معتمد" },
              { value: "rejected", label: "مرفوض" },
            ].map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-[var(--radius-chip)] text-body-sm font-medium transition-all ${
                  filter === f.value ? "bg-navy-700 text-white" : "bg-surface-muted text-navy-600 dark:bg-surface-dark-card"
                }`}>{f.label}</button>
            ))}
          </div>
        </div>

        <Card variant="outlined" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border dark:border-surface-dark-border bg-surface-muted dark:bg-surface-dark-card">
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحملة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">المالك</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الترخيص</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الرحلات</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">الحالة</th>
                  <th className="text-start px-4 py-3 text-body-sm font-semibold text-navy-600">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border dark:divide-surface-dark-border">
                {filtered.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-navy-500" />
                        </div>
                        <span className="text-body-md font-medium text-navy-900 dark:text-white">{campaign.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-md text-navy-600">{campaign.owner}</td>
                    <td className="px-4 py-3 text-body-sm font-mono text-navy-500">{campaign.license}</td>
                    <td className="px-4 py-3 text-body-md text-navy-600">{campaign.trips}</td>
                    <td className="px-4 py-3">
                      <Badge variant={campaign.status === "approved" ? "success" : campaign.status === "pending" ? "warning" : "error"} size="sm">
                        {campaign.status === "approved" ? "معتمد" : campaign.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        {campaign.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" className="text-success"><CheckCircle2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-error"><XCircle className="h-4 w-4" /></Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </>
  );
}
