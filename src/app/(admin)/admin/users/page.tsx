"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils/cn";
import { formatPhone, parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { User } from "@/types/user";
import type { UserRole } from "@/types/common";
import {
  Users,
  User as UserIcon,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";

/* -- Role color maps -- */

const roleColors: Record<UserRole, { variant: "default" | "success" | "warning" | "error" | "info" | "teal" | "amber"; labelAr: string; label: string }> = {
  traveler: { variant: "info", labelAr: "\u0645\u0633\u0627\u0641\u0631", label: "Traveler" },
  campaign_owner: { variant: "amber", labelAr: "\u0635\u0627\u062d\u0628 \u062d\u0645\u0644\u0629", label: "Campaign Owner" },
  campaign_staff: { variant: "teal", labelAr: "\u0641\u0631\u064a\u0642 \u0627\u0644\u062d\u0645\u0644\u0629", label: "Campaign Staff" },
  admin: { variant: "warning", labelAr: "\u0645\u0634\u0631\u0641", label: "Admin" },
  super_admin: { variant: "error", labelAr: "\u0645\u0634\u0631\u0641 \u0639\u0627\u0645", label: "Super Admin" },
};

const statusBarColor: Record<UserRole, string> = {
  traveler: "bg-sky-400",
  campaign_owner: "bg-violet-500",
  campaign_staff: "bg-sky-500",
  admin: "bg-orange-500",
  super_admin: "bg-red-500",
};

/* -- Helper components -- */

function RoleBadge({ role }: { role: UserRole }) {
  const { language } = useDirection();
  const c = roleColors[role] || roleColors.traveler;
  return (
    <Badge variant={c.variant} size="sm" dot>
      {language === "ar" ? c.labelAr : c.label}
    </Badge>
  );
}

function VerificationBadge({ isVerified }: { isVerified: boolean }) {
  const { t } = useDirection();
  if (isVerified) {
    return (
      <Badge variant="success" size="sm" dot>
        {t("\u0645\u0648\u062b\u0642", "Verified")}
      </Badge>
    );
  }
  return (
    <Badge variant="default" size="sm" dot>
      {t("\u063a\u064a\u0631 \u0645\u0648\u062b\u0642", "Unverified")}
    </Badge>
  );
}

function DetailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-surface-border/70 bg-slate-50/60 p-3 dark:border-surface-dark-border/70 dark:bg-white/[0.03]">
      <h4 className="text-body-sm font-bold text-slate-900 dark:text-white mb-2.5 flex items-center gap-2">
        <span className="text-sky-500 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        {title}
      </h4>
      <dl className="space-y-2 text-body-sm">{children}</dl>
    </div>
  );
}

function DetailRow({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500 dark:text-slate-400/70">{label}</dt>
      <dd className="font-medium text-slate-900 dark:text-white truncate" dir={dir}>
        {value}
      </dd>
    </div>
  );
}

/* -- Main page -- */

export default function UsersPage() {
  const { t, language } = useDirection();
  const { firebaseUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [search, setSearch] = useState("");

  // Detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => users.find((u) => u.uid === selectedId) ?? null, [users, selectedId]);

  // Real-time subscription
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = onCollectionChange<User>(
      COLLECTIONS.USERS,
      [],
      (data) => {
        setUsers(data);
        setLoadingData(false);
      },
      () => {
        setLoadingData(false);
      }
    );
    return unsub;
  }, [firebaseUser]);

  // Lock body scroll when detail panel is open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  // Close detail panel on Escape
  const handleDetailEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.addEventListener("keydown", handleDetailEscape);
    return () => document.removeEventListener("keydown", handleDetailEscape);
  }, [selected, handleDetailEscape]);

  // Filtered + searched users
  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== "all") {
      list = list.filter((u) => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.displayName.toLowerCase().includes(q) ||
          (u.displayNameAr && u.displayNameAr.includes(q)) ||
          u.phone.includes(q)
      );
    }
    return list;
  }, [users, roleFilter, search]);

  // Counts per role
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: users.length };
    for (const u of users) m[u.role] = (m[u.role] || 0) + 1;
    return m;
  }, [users]);

  const getCreatedDate = (user: User) => {
    const d = parseTimestamp(user.createdAt);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
  };

  const filterChips: { value: "all" | UserRole; label: string }[] = [
    { value: "all", label: t("\u0627\u0644\u0643\u0644", "All") },
    { value: "traveler", label: t("\u0645\u0633\u0627\u0641\u0631", "Traveler") },
    { value: "campaign_owner", label: t("\u0635\u0627\u062d\u0628 \u062d\u0645\u0644\u0629", "Campaign Owner") },
    { value: "campaign_staff", label: t("\u0641\u0631\u064a\u0642 \u0627\u0644\u062d\u0645\u0644\u0629", "Campaign Staff") },
    { value: "admin", label: t("\u0645\u0634\u0631\u0641", "Admin") },
  ];

  return (
    <>
      <AppBar
        title={t("\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646", "User Management")}
        breadcrumbs={[
          { label: t("\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645", "Admin"), href: "/admin/dashboard" },
          { label: t("\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646", "Users") },
        ]}
      />

      <Container className="eo-pattern overflow-visible py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Search */}
        <SearchInput
          placeholder={t("\u0627\u0628\u062d\u062b \u0628\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641...", "Search by name or phone number...")}
          onSearch={setSearch}
        />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filterChips.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setRoleFilter(f.value)}
              className={cn(
                "eo-filter-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-body-sm font-medium transition-all",
                roleFilter === f.value && "eo-filter-chip-active"
              )}
            >
              {f.label}
              <Badge variant={roleFilter === f.value ? "default" : "gold"} size="sm">
                {counts[f.value] || 0}
              </Badge>
            </button>
          ))}
        </div>

        {/* User list */}
        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="h-10 w-10 sm:h-16 sm:w-16" />}
            title={t("\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646", "No users")}
            description={
              roleFilter !== "all"
                ? t("\u0644\u0627 \u064a\u0648\u062c\u062f \u0645\u0633\u062a\u062e\u062f\u0645\u0648\u0646 \u062a\u062d\u062a \u0647\u0630\u0627 \u0627\u0644\u062a\u0635\u0646\u064a\u0641", "No users found under this filter")
                : t("\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u062d\u0633\u0627\u0628\u0627\u062a \u0627\u0644\u0645\u0633\u0627\u0641\u0631\u064a\u0646 \u0648\u0623\u0635\u062d\u0627\u0628 \u0627\u0644\u062d\u0645\u0644\u0627\u062a", "Traveler and campaign owner accounts will appear here")
            }
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((user) => (
              <button
                key={user.uid}
                onClick={() => setSelectedId(user.uid)}
                className="group w-full text-start"
              >
                <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:border-[#2D3B4F] dark:bg-[#1E293B]">
                  {/* Role indicator bar */}
                  <div className={cn("w-1 self-stretch shrink-0", statusBarColor[user.role] || "bg-slate-400")} />

                  {/* Avatar */}
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-[#1E293B]">
                      {user.avatarUrl ? (
                        <Image
                          src={user.avatarUrl}
                          alt=""
                          width={40}
                          height={40}
                          unoptimized
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-5 w-5 text-slate-500 dark:text-slate-400/70" />
                      )}
                    </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-3 pe-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-body-sm font-bold text-slate-900 dark:text-white truncate">
                        {user.displayNameAr || user.displayName}
                      </h3>
                      <RoleBadge role={user.role} />
                      <VerificationBadge isVerified={user.isVerified} />
                    </div>
                    {user.displayNameAr && user.displayName && (
                      <p className="text-xs text-slate-500 dark:text-slate-400/70 truncate mt-0.5" dir="ltr">
                        {user.displayName}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 dark:text-slate-400/60">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span dir="ltr">{formatPhone(user.phone)}</span>
                      </span>
                      {user.email && (
                        <span className="flex items-center gap-1 hidden sm:inline-flex">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                      )}
                      <span className="hidden sm:inline">{getCreatedDate(user)}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 shrink-0 me-3 text-slate-300 group-hover:text-slate-500 transition-colors dark:text-slate-500 dark:group-hover:text-slate-400 rtl:rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* -- User Detail Panel -- */}
      {selected && (
        <>
          {/* Backdrop -- desktop only */}
          <div
            className="fixed inset-0 z-[var(--z-modal)] hidden bg-black/40 backdrop-blur-sm sm:block animate-fade-in"
            onClick={() => setSelectedId(null)}
          />

          <div
            className={cn(
              "fixed z-[var(--z-modal)] flex flex-col overflow-hidden bg-white dark:bg-surface-dark-card",
              "inset-0 animate-slide-up",
              "sm:inset-0 sm:m-auto sm:w-full sm:max-w-lg sm:h-fit sm:max-h-[85vh] sm:rounded-[var(--radius-xl)] sm:border sm:border-surface-border sm:shadow-modal sm:dark:border-surface-dark-border sm:animate-scale-in"
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Panel header */}
            <div className="shrink-0 flex items-center gap-3 border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
              <button
                onClick={() => setSelectedId(null)}
                className="shrink-0 rounded-lg p-1.5 -ms-1.5 text-slate-500 hover:bg-slate-100 transition-colors dark:text-slate-400/70 dark:hover:bg-surface-dark-border sm:hidden"
              >
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white truncate text-body-md">
                  {selected.displayNameAr || selected.displayName}
                </h2>
                {selected.displayNameAr && selected.displayName && (
                  <p className="text-xs text-slate-500 truncate" dir="ltr">{selected.displayName}</p>
                )}
              </div>
              <RoleBadge role={selected.role} />
              <button
                onClick={() => setSelectedId(null)}
                className="hidden sm:flex shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors dark:hover:bg-surface-dark-border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Account Info */}
              <DetailSection icon={<UserIcon />} title={t("\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u062d\u0633\u0627\u0628", "Account Info")}>
                <DetailRow label={t("\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0639\u0631\u0628\u064a", "Name (AR)")} value={selected.displayNameAr || "\u2014"} />
                <DetailRow label={t("\u0627\u0644\u0627\u0633\u0645 \u0628\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a", "Name (EN)")} value={selected.displayName} dir="ltr" />
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400/70 mb-1">{t("\u0627\u0644\u062f\u0648\u0631", "Role")}</dt>
                  <dd><RoleBadge role={selected.role} /></dd>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <dt className="text-xs text-slate-500 dark:text-slate-400/70 mb-1">{t("\u0627\u0644\u062a\u0648\u062b\u064a\u0642", "Verification")}</dt>
                    <dd><VerificationBadge isVerified={selected.isVerified} /></dd>
                  </div>
                  <div className="flex-1">
                    <dt className="text-xs text-slate-500 dark:text-slate-400/70 mb-1">{t("\u0627\u0644\u062d\u0627\u0644\u0629", "Status")}</dt>
                    <dd>
                      <Badge variant={selected.isActive ? "success" : "error"} size="sm" dot>
                        {selected.isActive ? t("\u0646\u0634\u0637", "Active") : t("\u0645\u0639\u0637\u0644", "Inactive")}
                      </Badge>
                    </dd>
                  </div>
                </div>
              </DetailSection>

              {/* Contact Info */}
              <DetailSection icon={<Phone />} title={t("\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644", "Contact Info")}>
                <DetailRow label={t("\u0627\u0644\u0647\u0627\u062a\u0641", "Phone")} value={formatPhone(selected.phone)} dir="ltr" />
                {selected.email && (
                  <DetailRow label={t("\u0627\u0644\u0628\u0631\u064a\u062f", "Email")} value={selected.email} dir="ltr" />
                )}
                {selected.nationality && (
                  <DetailRow label={t("\u0627\u0644\u062c\u0646\u0633\u064a\u0629", "Nationality")} value={selected.nationality} />
                )}
              </DetailSection>

              {/* Dates */}
              <DetailSection icon={<Calendar />} title={t("\u0627\u0644\u062a\u0648\u0627\u0631\u064a\u062e", "Dates")}>
                <DetailRow
                  label={t("\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062a\u0633\u062c\u064a\u0644", "Registered")}
                  value={getCreatedDate(selected)}
                />
                {selected.lastLoginAt && (
                  <DetailRow
                    label={t("\u0622\u062e\u0631 \u062f\u062e\u0648\u0644", "Last Login")}
                    value={(() => {
                      const d = parseTimestamp(selected.lastLoginAt);
                      return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
                    })()}
                  />
                )}
                <DetailRow
                  label={t("\u0627\u0644\u0644\u063a\u0629 \u0627\u0644\u0645\u0641\u0636\u0644\u0629", "Preferred Language")}
                  value={selected.preferredLanguage === "ar" ? t("\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "Arabic") : t("\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629", "English")}
                />
              </DetailSection>

              {/* Identity Documents (if available) */}
              {(selected.civilId || selected.passportNumber) && (
                <DetailSection icon={<ShieldCheck />} title={t("\u0648\u062b\u0627\u0626\u0642 \u0627\u0644\u0647\u0648\u064a\u0629", "Identity Documents")}>
                  {selected.civilId && (
                    <DetailRow label={t("\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0645\u062f\u0646\u064a", "Civil ID")} value={selected.civilId} dir="ltr" />
                  )}
                  {selected.passportNumber && (
                    <DetailRow label={t("\u0631\u0642\u0645 \u0627\u0644\u062c\u0648\u0627\u0632", "Passport No.")} value={selected.passportNumber} dir="ltr" />
                  )}
                  {selected.gender && (
                    <DetailRow
                      label={t("\u0627\u0644\u062c\u0646\u0633", "Gender")}
                      value={selected.gender === "male" ? t("\u0630\u0643\u0631", "Male") : t("\u0623\u0646\u062b\u0649", "Female")}
                    />
                  )}
                </DetailSection>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-end gap-2 border-t border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <Button variant="ghost" onClick={() => setSelectedId(null)}>
                {t("\u0625\u063a\u0644\u0627\u0642", "Close")}
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
