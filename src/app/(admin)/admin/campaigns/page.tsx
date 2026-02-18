"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
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
  Mail,
  Globe,
  FileText,
  ExternalLink,
  XCircle,
  Ban,
} from "lucide-react";

const verificationColors: Record<VerificationStatus, { dot: string; bg: string; text: string; labelAr: string; label: string }> = {
  pending: { dot: "bg-warning", bg: "bg-warning-light dark:bg-amber-900/25", text: "text-amber-800 dark:text-amber-300", labelAr: "قيد المراجعة", label: "Under Review" },
  approved: { dot: "bg-success", bg: "bg-success-light dark:bg-green-900/25", text: "text-green-800 dark:text-green-300", labelAr: "معتمد", label: "Approved" },
  rejected: { dot: "bg-error", bg: "bg-error-light dark:bg-red-900/25", text: "text-red-800 dark:text-red-300", labelAr: "مرفوض", label: "Rejected" },
  suspended: { dot: "bg-error", bg: "bg-error-light dark:bg-red-900/25", text: "text-red-800 dark:text-red-300", labelAr: "معلق", label: "Suspended" },
};

function VerificationChip({ status }: { status: VerificationStatus }) {
  const { language } = useDirection();
  const c = verificationColors[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 py-1 text-body-sm font-medium border-current/15", c.bg, c.text)}>
      <span className={cn("h-2 w-2 rounded-full", c.dot)} />
      {language === "ar" ? c.labelAr : c.label}
    </span>
  );
}

export default function AdminCampaignsPage() {
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();
  const { toast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | VerificationStatus>("all");
  const [search, setSearch] = useState("");

  // Detail modal — ID-based so it stays in sync with real-time data
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => campaigns.find((c) => c.id === selectedId) ?? null, [campaigns, selectedId]);

  // Reject dialog
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const rejectTarget = useMemo(() => campaigns.find((c) => c.id === rejectTargetId) ?? null, [campaigns, rejectTargetId]);
  const [rejectionReason, setRejectionReason] = useState("");

  // Action loading
  const [actionLoading, setActionLoading] = useState(false);

  // Real-time subscription — wait for auth before subscribing
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
      (err) => {
        console.error("Campaigns listener failed:", err);
        setLoadingData(false);
        toast({ type: "error", title: t("تعذر تحميل الحملات", "Failed to load campaigns") });
      }
    );
    return unsub;
  }, [firebaseUser]);

  // Filtered + searched campaigns
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
    { value: "pending", label: t("قيد المراجعة", "Under Review") },
    { value: "approved", label: t("معتمد", "Approved") },
    { value: "rejected", label: t("مرفوض", "Rejected") },
    { value: "suspended", label: t("معلق", "Suspended") },
  ];

  const getCreatedDate = (c: Campaign) => {
    const d = parseTimestamp(c.createdAt);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "—";
  };

  return (
    <>
      <AppBar
        title={t("إدارة الحملات", "Campaign Management")}
        breadcrumbs={[
          { label: t("المشرف العام", "Admin"), href: "/admin/dashboard" },
          { label: t("الحملات", "Campaigns") },
        ]}
      />

      <Container className="sacred-pattern overflow-visible py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder={t("ابحث بالاسم أو رقم الترخيص...", "Search by name or license number...")}
            onSearch={setSearch}
            className="flex-1"
          />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterChips.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`sacred-filter-chip shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-body-sm font-medium ${filter === f.value ? "sacred-filter-chip-active" : ""}`}
              >
                <span>{f.label}</span>
                <Badge variant={filter === f.value ? "default" : "gold"} size="sm">
                  {counts[f.value] || 0}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Campaign List */}
        {loadingData ? (
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          </Card>
        ) : filtered.length === 0 ? (
          <Card variant="elevated" padding="none">
            <EmptyState
              icon={<Building2 className="h-10 w-10 sm:h-16 sm:w-16" />}
              title={t("لا توجد حملات", "No campaigns")}
              description={
                filter !== "all"
                  ? t("لا توجد حملات تحت هذا التصنيف", "No campaigns found under this filter")
                  : t("ستظهر هنا الحملات المسجلة في المنصة", "Registered campaigns will appear here")
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((campaign) => (
              <Card
                key={campaign.id}
                variant="elevated"
                padding="none"
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => setSelectedId(campaign.id)}
              >
                <div className="flex items-start gap-3 p-3 sm:items-center sm:gap-4 sm:p-4">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700">
                    <Building2 className="h-6 w-6 text-stone-600 dark:text-stone-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <h3 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white truncate">
                        {campaign.nameAr}
                      </h3>
                      <VerificationChip status={campaign.verificationStatus} />
                    </div>
                    <p className="text-xs sm:text-body-sm text-stone-500 truncate" dir="ltr">
                      {campaign.name}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-body-sm text-stone-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {campaign.licenseNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span dir="ltr">{formatPhone(campaign.contactPhone)}</span>
                      </span>
                      <span className="hidden sm:inline">{getCreatedDate(campaign)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>

      {/* Campaign Detail Modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.nameAr || ""}
        description={selected?.name}
        size="lg"
        footer={
          selected && (
            <>
              {selected.verificationStatus === "pending" && (
                <>
                  <Button variant="ghost" onClick={() => { setRejectTargetId(selected.id); }} disabled={actionLoading}>
                    <ShieldX className="h-4 w-4 me-1" />
                    {t("رفض", "Reject")}
                  </Button>
                  <Button variant="primary" onClick={() => handleApprove(selected)} loading={actionLoading}>
                    <ShieldCheck className="h-4 w-4 me-1" />
                    {t("موافقة", "Approve")}
                  </Button>
                </>
              )}
              {selected.verificationStatus === "approved" && (
                <Button variant="danger" onClick={() => handleSuspend(selected)} loading={actionLoading}>
                  <Ban className="h-4 w-4 me-1" />
                  {t("تعليق", "Suspend")}
                </Button>
              )}
              {(selected.verificationStatus === "rejected" || selected.verificationStatus === "suspended") && (
                <Button variant="primary" onClick={() => handleApprove(selected)} loading={actionLoading}>
                  <ShieldCheck className="h-4 w-4 me-1" />
                  {t("إعادة الموافقة", "Re-approve")}
                </Button>
              )}
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-3 sm:space-y-5 -mt-1 sm:-mt-2">
            {/* Status banner */}
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
            <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
              <h4 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-amber-500 shrink-0" />
                {t("بيانات المنظمة", "Organization")}
              </h4>
              <dl className="space-y-2 text-body-sm">
                <div>
                  <dt className="text-stone-500 text-xs">{t("الاسم بالعربي", "Name (AR)")}</dt>
                  <dd className="font-medium text-stone-900 dark:text-white">{selected.nameAr}</dd>
                </div>
                <div>
                  <dt className="text-stone-500 text-xs">{t("الاسم بالإنجليزي", "Name (EN)")}</dt>
                  <dd className="font-medium text-stone-900 dark:text-white" dir="ltr">{selected.name}</dd>
                </div>
                {selected.descriptionAr && (
                  <div>
                    <dt className="text-stone-500 text-xs mb-0.5">{t("الوصف", "Description")}</dt>
                    <dd className="text-stone-700 dark:text-stone-400">{selected.descriptionAr}</dd>
                  </div>
                )}
                {selected.description && (
                  <div>
                    <dt className="text-stone-500 text-xs mb-0.5">{t("الوصف بالإنجليزي", "Description (EN)")}</dt>
                    <dd className="text-stone-700 dark:text-stone-400" dir="ltr">{selected.description}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Legal Documents */}
            <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
              <h4 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                {t("الوثائق الرسمية", "Legal Documents")}
              </h4>
              <dl className="space-y-2 text-body-sm">
                <div>
                  <dt className="text-stone-500 text-xs">{t("رقم الترخيص", "License No.")}</dt>
                  <dd className="font-medium text-stone-900 dark:text-white">{selected.licenseNumber}</dd>
                </div>
                {selected.commercialRegNumber && (
                  <div>
                    <dt className="text-stone-500 text-xs">{t("السجل التجاري", "Comm. Reg.")}</dt>
                    <dd className="font-medium text-stone-900 dark:text-white">{selected.commercialRegNumber}</dd>
                  </div>
                )}
                {selected.licenseImageUrl && (
                  <div>
                    <dt className="text-stone-500 text-xs">{t("صورة الترخيص", "License Image")}</dt>
                    <dd>
                      <a
                        href={selected.licenseImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-body-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        {t("عرض", "View")}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Contact */}
            <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
              <h4 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                {t("بيانات التواصل", "Contact Info")}
              </h4>
              <dl className="space-y-2 text-body-sm">
                <div>
                  <dt className="text-stone-500 text-xs flex items-center gap-1"><Phone className="h-3 w-3" /> {t("الهاتف", "Phone")}</dt>
                  <dd className="font-medium text-stone-900 dark:text-white" dir="ltr">{formatPhone(selected.contactPhone)}</dd>
                </div>
                {selected.contactEmail && (
                  <div>
                    <dt className="text-stone-500 text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> {t("البريد", "Email")}</dt>
                    <dd className="font-medium text-stone-900 dark:text-white truncate" dir="ltr">{selected.contactEmail}</dd>
                  </div>
                )}
                {selected.website && (
                  <div>
                    <dt className="text-stone-500 text-xs flex items-center gap-1"><Globe className="h-3 w-3" /> {t("الموقع", "Website")}</dt>
                    <dd className="font-medium text-stone-900 dark:text-white truncate" dir="ltr">{selected.website}</dd>
                  </div>
                )}
                {(selected.socialMedia?.instagram || selected.socialMedia?.whatsapp) && (
                  <div>
                    <dt className="text-stone-500 text-xs">{t("التواصل الاجتماعي", "Social")}</dt>
                    <dd className="font-medium text-stone-900 dark:text-white truncate" dir="ltr">
                      {[selected.socialMedia.instagram, selected.socialMedia.whatsapp].filter(Boolean).join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Status info */}
            <div className="rounded-[var(--radius-lg)] border border-surface-border bg-surface-muted/50 p-3 sm:p-4 dark:border-surface-dark-border dark:bg-surface-dark-card/50">
              <h4 className="text-body-sm sm:text-body-md font-bold text-stone-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                {t("حالة التحقق", "Verification Status")}
              </h4>
              <dl className="space-y-2 text-body-sm">
                <div>
                  <dt className="text-stone-500 text-xs">{t("الحالة", "Status")}</dt>
                  <dd className="mt-0.5"><VerificationChip status={selected.verificationStatus} /></dd>
                </div>
                <div>
                  <dt className="text-stone-500 text-xs">{t("تاريخ التسجيل", "Registered")}</dt>
                  <dd className="font-medium text-stone-900 dark:text-white">{getCreatedDate(selected)}</dd>
                </div>
                {selected.verifiedBy && (
                  <div>
                    <dt className="text-stone-500 text-xs">{t("تم التحقق بواسطة", "Verified By")}</dt>
                    <dd className="font-medium text-stone-900 dark:text-white truncate">{selected.verifiedBy}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Reason Modal */}
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
    </>
  );
}
