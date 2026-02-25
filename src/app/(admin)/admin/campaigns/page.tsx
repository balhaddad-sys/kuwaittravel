"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/forms/SearchInput";
import { Textarea } from "@/components/ui/Textarea";
import { AlertBanner } from "@/components/feedback/AlertBanner";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/feedback/ToastProvider";
import { onCollectionChange, updateDocument, createDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils/cn";
import { formatPhone, parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { Campaign } from "@/types/campaign";
import type { VerificationStatus } from "@/types/common";
import {
  Building2,
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Phone,
  FileText,
  ExternalLink,
  XCircle,
  Ban,
  ChevronRight,
  ArrowLeft,
  X,
} from "lucide-react";

/* ── Status color maps ─────────────────────────────────────────────── */

const verificationColors: Record<VerificationStatus, { dot: string; bg: string; text: string; labelAr: string; label: string }> = {
  pending: { dot: "bg-warning", bg: "bg-warning-light dark:bg-orange-900/25", text: "text-orange-800 dark:text-orange-300", labelAr: "قيد المراجعة", label: "Under Review" },
  approved: { dot: "bg-success", bg: "bg-success-light dark:bg-green-900/25", text: "text-green-800 dark:text-green-300", labelAr: "معتمد", label: "Approved" },
  rejected: { dot: "bg-error", bg: "bg-error-light dark:bg-red-900/25", text: "text-red-800 dark:text-red-300", labelAr: "مرفوض", label: "Rejected" },
  suspended: { dot: "bg-error", bg: "bg-error-light dark:bg-red-900/25", text: "text-red-800 dark:text-red-300", labelAr: "معلق", label: "Suspended" },
};

const statusBarColor: Record<VerificationStatus, string> = {
  pending: "bg-orange-400",
  approved: "bg-emerald-500",
  rejected: "bg-red-500",
  suspended: "bg-red-400",
};

/* ── Helper components ─────────────────────────────────────────────── */

function VerificationChip({ status }: { status: VerificationStatus }) {
  const { language } = useDirection();
  const c = verificationColors[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold border-current/15 whitespace-nowrap", c.bg, c.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {language === "ar" ? c.labelAr : c.label}
    </span>
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

function DetailRow({ label, value, dir, multiline }: { label: string; value: string; dir?: string; multiline?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-500 dark:text-slate-400/70">{label}</dt>
      <dd className={cn("font-medium text-slate-900 dark:text-white", !multiline && "truncate")} dir={dir}>
        {value}
      </dd>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────── */

export default function AdminCampaignsPage() {
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | VerificationStatus>("all");
  const [search, setSearch] = useState("");

  // Detail panel — ID-based so it stays in sync with real-time data
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => campaigns.find((c) => c.id === selectedId) ?? null, [campaigns, selectedId]);

  // Reject dialog
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const rejectTarget = useMemo(() => campaigns.find((c) => c.id === rejectTargetId) ?? null, [campaigns, rejectTargetId]);
  const [rejectionReason, setRejectionReason] = useState("");

  // Action loading
  const [actionLoading, setActionLoading] = useState(false);

  // ── Real-time subscription — wait for auth ──
  useEffect(() => {
    if (!firebaseUser) return;
    setLoadingData(true);
    const unsub = onCollectionChange<Campaign>(
      COLLECTIONS.CAMPAIGNS,
      [],
      (data) => {
        setCampaigns(data);
        setLoadingData(false);
      },
      () => {
        setLoadingData(false);
        toast({ type: "error", title: t("تعذر تحميل الحملات", "Failed to load campaigns") });
      }
    );
    return unsub;
  }, [firebaseUser, t, toast]);

  // ── Lock body scroll when detail panel is open ──
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  // ── Close detail panel on Escape ──
  const handleDetailEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!selected) return;
    document.addEventListener("keydown", handleDetailEscape);
    return () => document.removeEventListener("keydown", handleDetailEscape);
  }, [selected, handleDetailEscape]);

  // ── Filtered + searched campaigns ──
  const filtered = useMemo(() => {
    let list = campaigns;
    if (filter !== "all") {
      list = list.filter((c) => c.verificationStatus === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameAr.includes(q) ||
          c.licenseNumber.includes(q)
      );
    }
    return list;
  }, [campaigns, filter, search]);

  // Counts per status
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: campaigns.length, pending: 0, approved: 0, rejected: 0, suspended: 0 };
    for (const c of campaigns) m[c.verificationStatus] = (m[c.verificationStatus] || 0) + 1;
    return m;
  }, [campaigns]);

  // ── Actions ──
  const logAction = async (action: string, campaignId: string, oldStatus: string, newStatus: string) => {
    if (!firebaseUser || !userData) return;
    await createDocument(COLLECTIONS.AUDIT_LOGS, {
      actorId: firebaseUser.uid,
      actorRole: userData.role,
      actorName: userData.displayName,
      action,
      entityType: "campaign",
      entityId: campaignId,
      changes: [{ field: "verificationStatus", oldValue: oldStatus, newValue: newStatus }],
    });
  };

  const handleApprove = async (campaign: Campaign) => {
    setActionLoading(true);
    try {
      const oldStatus = campaign.verificationStatus;
      await updateDocument(COLLECTIONS.CAMPAIGNS, campaign.id, {
        verificationStatus: "approved",
        verifiedBy: firebaseUser?.uid,
        rejectionReason: null,
      });
      await logAction("campaign_approved", campaign.id, oldStatus, "approved");
      toast({ type: "success", title: t("تمت الموافقة على الحملة", "Campaign approved") });
      setSelectedId(null);
    } catch {
      toast({ type: "error", title: t("فشلت العملية", "Action failed") });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const oldStatus = rejectTarget.verificationStatus;
      await updateDocument(COLLECTIONS.CAMPAIGNS, rejectTarget.id, {
        verificationStatus: "rejected",
        rejectionReason: rejectionReason.trim(),
      });
      await logAction("campaign_rejected", rejectTarget.id, oldStatus, "rejected");
      toast({ type: "success", title: t("تم رفض الحملة", "Campaign rejected") });
      setRejectTargetId(null);
      setRejectionReason("");
      setSelectedId(null);
    } catch {
      toast({ type: "error", title: t("فشلت العملية", "Action failed") });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (campaign: Campaign) => {
    setActionLoading(true);
    try {
      const oldStatus = campaign.verificationStatus;
      await updateDocument(COLLECTIONS.CAMPAIGNS, campaign.id, {
        verificationStatus: "suspended",
      });
      await logAction("campaign_suspended", campaign.id, oldStatus, "suspended");
      toast({ type: "success", title: t("تم تعليق الحملة", "Campaign suspended") });
      setSelectedId(null);
    } catch {
      toast({ type: "error", title: t("فشلت العملية", "Action failed") });
    } finally {
      setActionLoading(false);
    }
  };

  const filterChips: { value: "all" | VerificationStatus; label: string }[] = [
    { value: "all", label: t("الكل", "All") },
    { value: "pending", label: t("قيد المراجعة", "Pending") },
    { value: "approved", label: t("معتمد", "Approved") },
    { value: "rejected", label: t("مرفوض", "Rejected") },
    { value: "suspended", label: t("معلق", "Suspended") },
  ];

  const getCreatedDate = (c: Campaign) => {
    const d = parseTimestamp(c.createdAt);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "—";
  };

  /* ── Render ── */

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#1A1A1A]">
      <AppBar
        title={t("إدارة الحملات", "Campaign Management")}
        breadcrumbs={[
          { label: t("المشرف العام", "Admin"), href: "/admin/dashboard" },
          { label: t("الحملات", "Campaigns") },
        ]}
      />

      <Container className="overflow-visible py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Search */}
        <SearchInput
          placeholder={t("ابحث بالاسم أو رقم الترخيص...", "Search by name or license...")}
          onSearch={setSearch}
        />

        {/* Filter chips — wrapping grid */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filterChips.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "eo-filter-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-body-sm font-medium transition-all",
                filter === f.value && "eo-filter-chip-active"
              )}
            >
              {f.label}
              <Badge variant={filter === f.value ? "default" : "gold"} size="sm">
                {counts[f.value] || 0}
              </Badge>
            </button>
          ))}
        </div>

        {/* Campaign list */}
        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-10 w-10 sm:h-16 sm:w-16" />}
            title={t("لا توجد حملات", "No campaigns")}
            description={
              filter !== "all"
                ? t("لا توجد حملات تحت هذا التصنيف", "No campaigns found under this filter")
                : t("ستظهر هنا الحملات المسجلة في المنصة", "Registered campaigns will appear here")
            }
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setSelectedId(campaign.id)}
                className="group w-full text-start"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:border-[#383838] dark:bg-[#262626]",
                  )}
                >
                  {/* Status indicator bar */}
                  <div className={cn("w-1 self-stretch shrink-0", statusBarColor[campaign.verificationStatus])} />

                  {/* Icon — desktop only */}
                  <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-[#262626]">
                    <Building2 className="h-5 w-5 text-slate-500 dark:text-slate-400/70" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-3 pe-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-body-sm font-bold text-slate-900 dark:text-white truncate">
                        {campaign.nameAr}
                      </h3>
                      <VerificationChip status={campaign.verificationStatus} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400/70 truncate mt-0.5" dir="ltr">
                      {campaign.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 dark:text-slate-400/60">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {campaign.licenseNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span dir="ltr">{formatPhone(campaign.contactPhone)}</span>
                      </span>
                      <span className="hidden sm:inline">{getCreatedDate(campaign)}</span>
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

      {/* ── Campaign Detail Panel ──────────────────────────────────── */}
      {/* Mobile: full-screen slide-up  |  Desktop: centered dialog   */}
      {selected && (
        <>
          {/* Backdrop — desktop only */}
          <div
            className="fixed inset-0 z-[var(--z-modal)] hidden bg-black/40 backdrop-blur-sm sm:block animate-fade-in"
            onClick={() => setSelectedId(null)}
          />

          <div
            className={cn(
              "fixed z-[var(--z-modal)] flex flex-col overflow-hidden bg-white dark:bg-surface-dark-card",
              // Mobile: full-screen, slide up
              "inset-0 animate-slide-up",
              // Desktop: centered dialog
              "sm:inset-0 sm:m-auto sm:w-full sm:max-w-lg sm:h-fit sm:max-h-[85vh] sm:rounded-[var(--radius-xl)] sm:border sm:border-surface-border sm:shadow-modal sm:dark:border-surface-dark-border sm:animate-scale-in"
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* ── Panel header ── */}
            <div className="shrink-0 flex items-center gap-3 border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
              {/* Back arrow — mobile */}
              <button
                onClick={() => setSelectedId(null)}
                className="shrink-0 rounded-lg p-1.5 -ms-1.5 text-slate-500 hover:bg-slate-100 transition-colors dark:text-slate-400/70 dark:hover:bg-surface-dark-border sm:hidden"
              >
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-slate-900 dark:text-white truncate text-body-md">
                  {selected.nameAr}
                </h2>
                <p className="text-xs text-slate-500 truncate" dir="ltr">{selected.name}</p>
              </div>
              <VerificationChip status={selected.verificationStatus} />
              {/* Close X — desktop */}
              <button
                onClick={() => setSelectedId(null)}
                className="hidden sm:flex shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors dark:hover:bg-surface-dark-border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Rejection / Suspension banners */}
              {selected.verificationStatus === "rejected" && selected.rejectionReason && (
                <AlertBanner
                  type="error"
                  title={t("سبب الرفض", "Rejection Reason")}
                  description={selected.rejectionReason}
                />
              )}
              {selected.verificationStatus === "suspended" && (
                <AlertBanner
                  type="warning"
                  title={t("حملة معلقة", "Campaign Suspended")}
                />
              )}

              {/* Organization */}
              <DetailSection icon={<Building2 />} title={t("بيانات المنظمة", "Organization")}>
                <DetailRow label={t("الاسم بالعربي", "Name (AR)")} value={selected.nameAr} />
                <DetailRow label={t("الاسم بالإنجليزي", "Name (EN)")} value={selected.name} dir="ltr" />
                {selected.descriptionAr && (
                  <DetailRow label={t("الوصف", "Description")} value={selected.descriptionAr} multiline />
                )}
                {selected.description && (
                  <DetailRow label={t("الوصف بالإنجليزي", "Description (EN)")} value={selected.description} dir="ltr" multiline />
                )}
              </DetailSection>

              {/* Legal Documents */}
              <DetailSection icon={<FileText />} title={t("الوثائق الرسمية", "Legal Documents")}>
                <DetailRow label={t("رقم الترخيص", "License No.")} value={selected.licenseNumber} />
                {selected.commercialRegNumber && (
                  <DetailRow label={t("السجل التجاري", "Comm. Reg.")} value={selected.commercialRegNumber} />
                )}
                {selected.licenseImageUrl && (
                  <div>
                    <dt className="text-xs text-slate-500 dark:text-slate-400/70">{t("صورة الترخيص", "License Image")}</dt>
                    <dd>
                      <a
                        href={selected.licenseImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-body-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                      >
                        {t("عرض", "View")} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
              </DetailSection>

              {/* Contact */}
              <DetailSection icon={<Phone />} title={t("بيانات التواصل", "Contact Info")}>
                <DetailRow label={t("الهاتف", "Phone")} value={formatPhone(selected.contactPhone)} dir="ltr" />
                {selected.contactEmail && (
                  <DetailRow label={t("البريد", "Email")} value={selected.contactEmail} dir="ltr" />
                )}
                {selected.website && (
                  <DetailRow label={t("الموقع", "Website")} value={selected.website} dir="ltr" />
                )}
                {(selected.socialMedia?.instagram || selected.socialMedia?.whatsapp) && (
                  <DetailRow
                    label={t("التواصل الاجتماعي", "Social")}
                    value={[selected.socialMedia.instagram, selected.socialMedia.whatsapp].filter(Boolean).join(" · ")}
                    dir="ltr"
                  />
                )}
              </DetailSection>

              {/* Verification Status */}
              <DetailSection icon={<ShieldAlert />} title={t("حالة التحقق", "Verification Status")}>
                <div>
                  <dt className="text-xs text-slate-500 dark:text-slate-400/70 mb-1">{t("الحالة", "Status")}</dt>
                  <dd><VerificationChip status={selected.verificationStatus} /></dd>
                </div>
                <DetailRow label={t("تاريخ التسجيل", "Registered")} value={getCreatedDate(selected)} />
                {selected.verifiedBy && (
                  <DetailRow label={t("تم التحقق بواسطة", "Verified By")} value={selected.verifiedBy} />
                )}
              </DetailSection>
            </div>

            {/* ── Footer actions ── */}
            <div className="shrink-0 flex items-center gap-2 border-t border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {selected.verificationStatus === "pending" && (
                <>
                  <Button variant="ghost" onClick={() => setRejectTargetId(selected.id)} disabled={actionLoading} className="flex-1 sm:flex-none">
                    <ShieldX className="h-4 w-4 me-1" />
                    {t("رفض", "Reject")}
                  </Button>
                  <Button variant="primary" onClick={() => handleApprove(selected)} loading={actionLoading} className="flex-1 sm:flex-none">
                    <ShieldCheck className="h-4 w-4 me-1" />
                    {t("موافقة", "Approve")}
                  </Button>
                </>
              )}
              {selected.verificationStatus === "approved" && (
                <Button variant="danger" onClick={() => handleSuspend(selected)} loading={actionLoading} className="flex-1 sm:flex-none">
                  <Ban className="h-4 w-4 me-1" />
                  {t("تعليق", "Suspend")}
                </Button>
              )}
              {(selected.verificationStatus === "rejected" || selected.verificationStatus === "suspended") && (
                <Button variant="primary" onClick={() => handleApprove(selected)} loading={actionLoading} className="flex-1 sm:flex-none">
                  <ShieldCheck className="h-4 w-4 me-1" />
                  {t("إعادة الموافقة", "Re-approve")}
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Reject Reason Modal ── */}
      <Modal
        open={!!rejectTarget}
        onClose={() => { setRejectTargetId(null); setRejectionReason(""); }}
        title={t("رفض الحملة", "Reject Campaign")}
        description={rejectTarget ? t(`رفض حملة "${rejectTarget.nameAr}"`, `Reject "${rejectTarget.name}"`) : ""}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setRejectTargetId(null); setRejectionReason(""); }}>
              {t("إلغاء", "Cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              loading={actionLoading}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="h-4 w-4 me-1" />
              {t("تأكيد الرفض", "Confirm Rejection")}
            </Button>
          </>
        }
      >
        <Textarea
          label={t("سبب الرفض", "Rejection Reason")}
          placeholder={t("أدخل سبب رفض هذه الحملة...", "Enter the reason for rejecting this campaign...")}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          required
        />
      </Modal>
    </div>
  );
}
