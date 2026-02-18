"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/feedback/ToastProvider";
import { onCollectionChange, updateDocument, createDocument } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils/cn";
import { parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { Dispute } from "@/types/notification";
import type { DisputeStatus, DisputeType } from "@/types/common";
import {
  AlertOctagon,
  AlertTriangle,
  MessageSquare,
  FileText,
  ChevronRight,
  ArrowLeft,
  X,
  CheckCircle,
  XCircle,
  ArrowUpCircle,
  Clock,
  Shield,
} from "lucide-react";

/* -- Status & Type color maps -- */

const statusConfig: Record<DisputeStatus, { variant: "default" | "success" | "warning" | "error" | "info"; labelAr: string; label: string }> = {
  open: { variant: "error", labelAr: "\u0645\u0641\u062a\u0648\u062d\u0629", label: "Open" },
  under_review: { variant: "warning", labelAr: "\u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629", label: "Under Review" },
  resolved: { variant: "success", labelAr: "\u0645\u062d\u0644\u0648\u0644\u0629", label: "Resolved" },
  escalated: { variant: "error", labelAr: "\u0645\u064f\u0635\u0639\u062f\u0629", label: "Escalated" },
  closed: { variant: "default", labelAr: "\u0645\u063a\u0644\u0642\u0629", label: "Closed" },
};

const typeConfig: Record<DisputeType, { variant: "default" | "success" | "warning" | "error" | "info"; labelAr: string; label: string }> = {
  refund: { variant: "warning", labelAr: "\u0627\u0633\u062a\u0631\u062f\u0627\u062f", label: "Refund" },
  service_quality: { variant: "info", labelAr: "\u062c\u0648\u062f\u0629 \u0627\u0644\u062e\u062f\u0645\u0629", label: "Service Quality" },
  fraud: { variant: "error", labelAr: "\u0627\u062d\u062a\u064a\u0627\u0644", label: "Fraud" },
  other: { variant: "default", labelAr: "\u0623\u062e\u0631\u0649", label: "Other" },
};

const statusBarColor: Record<DisputeStatus, string> = {
  open: "bg-red-500",
  under_review: "bg-amber-400",
  resolved: "bg-emerald-500",
  escalated: "bg-red-600",
  closed: "bg-stone-400",
};

/* -- Helper components -- */

function StatusBadge({ status }: { status: DisputeStatus }) {
  const { language } = useDirection();
  const c = statusConfig[status];
  return (
    <Badge variant={c.variant} size="sm" dot>
      {language === "ar" ? c.labelAr : c.label}
    </Badge>
  );
}

function TypeBadge({ type }: { type: DisputeType }) {
  const { language } = useDirection();
  const c = typeConfig[type];
  return (
    <Badge variant={c.variant} size="sm">
      {language === "ar" ? c.labelAr : c.label}
    </Badge>
  );
}

function DetailSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-surface-border/70 bg-stone-50/60 p-3 dark:border-surface-dark-border/70 dark:bg-white/[0.03]">
      <h4 className="text-body-sm font-bold text-stone-900 dark:text-white mb-2.5 flex items-center gap-2">
        <span className="text-amber-500 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        {title}
      </h4>
      <dl className="space-y-2 text-body-sm">{children}</dl>
    </div>
  );
}

function DetailRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
      <dd className={cn("font-medium text-stone-900 dark:text-white", !multiline && "truncate")}>
        {value}
      </dd>
    </div>
  );
}

/* -- Main page -- */

export default function DisputesPage() {
  const { t, language } = useDirection();
  const { firebaseUser, userData } = useAuth();
  const { toast } = useToast();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<"all" | DisputeStatus>("all");

  // Detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = useMemo(() => disputes.find((d) => d.id === selectedId) ?? null, [disputes, selectedId]);

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<DisputeStatus>("under_review");
  const [resolution, setResolution] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Real-time subscription
  useEffect(() => {
    if (!firebaseUser) return;
    setLoadingData(true);
    const unsub = onCollectionChange<Dispute>(
      COLLECTIONS.DISPUTES,
      [],
      (data) => {
        setDisputes(data);
        setLoadingData(false);
      },
      (err) => {
        console.error("Disputes listener failed:", err);
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

  // Close on Escape
  const handleDetailEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (statusModalOpen) return;
      setSelectedId(null);
    }
  }, [statusModalOpen]);

  useEffect(() => {
    if (!selected) return;
    document.addEventListener("keydown", handleDetailEscape);
    return () => document.removeEventListener("keydown", handleDetailEscape);
  }, [selected, handleDetailEscape]);

  // Filtered disputes
  const filtered = useMemo(() => {
    if (filter === "all") return disputes;
    return disputes.filter((d) => d.status === filter);
  }, [disputes, filter]);

  // Sort by newest first
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = parseTimestamp(a.createdAt)?.getTime() ?? 0;
      const dateB = parseTimestamp(b.createdAt)?.getTime() ?? 0;
      return dateB - dateA;
    });
  }, [filtered]);

  // Counts per status
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: disputes.length };
    for (const d of disputes) m[d.status] = (m[d.status] || 0) + 1;
    return m;
  }, [disputes]);

  const getDate = (ts: unknown) => {
    const d = parseTimestamp(ts);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const updateData: Record<string, unknown> = { status: newStatus };
      if (newStatus === "resolved" || newStatus === "closed") {
        updateData.resolution = resolution.trim();
        updateData.resolvedBy = firebaseUser?.uid;
      }

      await updateDocument(COLLECTIONS.DISPUTES, selected.id, updateData);

      // Log the action
      if (firebaseUser && userData) {
        await createDocument(COLLECTIONS.AUDIT_LOGS, {
          actorId: firebaseUser.uid,
          actorRole: userData.role,
          actorName: userData.displayName,
          action: `dispute_${newStatus}`,
          entityType: "dispute",
          entityId: selected.id,
          changes: [{ field: "status", oldValue: selected.status, newValue: newStatus }],
        });
      }

      toast({ type: "success", title: t("\u062a\u0645 \u062a\u062d\u062f\u064a\u062b \u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0632\u0627\u0639", "Dispute status updated") });
      setStatusModalOpen(false);
      setResolution("");
    } catch {
      toast({ type: "error", title: t("\u0641\u0634\u0644\u062a \u0627\u0644\u0639\u0645\u0644\u064a\u0629", "Action failed") });
    } finally {
      setActionLoading(false);
    }
  };

  const filterChips: { value: "all" | DisputeStatus; label: string }[] = [
    { value: "all", label: t("\u0627\u0644\u0643\u0644", "All") },
    { value: "open", label: t("\u0645\u0641\u062a\u0648\u062d\u0629", "Open") },
    { value: "under_review", label: t("\u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629", "Under Review") },
    { value: "resolved", label: t("\u0645\u062d\u0644\u0648\u0644\u0629", "Resolved") },
    { value: "escalated", label: t("\u0645\u064f\u0635\u0639\u062f\u0629", "Escalated") },
  ];

  const statusOptions: { value: DisputeStatus; label: string; icon: React.ReactNode }[] = [
    { value: "under_review", label: t("\u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629", "Under Review"), icon: <Clock className="h-4 w-4" /> },
    { value: "escalated", label: t("\u062a\u0635\u0639\u064a\u062f", "Escalate"), icon: <ArrowUpCircle className="h-4 w-4" /> },
    { value: "resolved", label: t("\u0645\u062d\u0644\u0648\u0644\u0629", "Resolved"), icon: <CheckCircle className="h-4 w-4" /> },
    { value: "closed", label: t("\u0645\u063a\u0644\u0642\u0629", "Closed"), icon: <XCircle className="h-4 w-4" /> },
  ];

  return (
    <>
      <AppBar
        title={t("\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a", "Manage Disputes")}
        breadcrumbs={[
          { label: t("\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645", "Admin Console"), href: "/admin/dashboard" },
          { label: t("\u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a", "Disputes") },
        ]}
      />

      <Container className="sacred-pattern overflow-visible py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filterChips.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "sacred-filter-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs sm:text-body-sm font-medium transition-all",
                filter === f.value && "sacred-filter-chip-active"
              )}
            >
              {f.label}
              <Badge variant={filter === f.value ? "default" : "gold"} size="sm">
                {counts[f.value] || 0}
              </Badge>
            </button>
          ))}
        </div>

        {/* Disputes list */}
        {loadingData ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<AlertOctagon className="h-10 w-10 sm:h-16 sm:w-16" />}
            title={t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u0632\u0627\u0639\u0627\u062a", "No Disputes")}
            description={
              filter !== "all"
                ? t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u0632\u0627\u0639\u0627\u062a \u062a\u062d\u062a \u0647\u0630\u0627 \u0627\u0644\u062a\u0635\u0646\u064a\u0641", "No disputes found under this filter")
                : t("\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a \u0627\u0644\u0645\u0631\u0641\u0648\u0639\u0629 \u0645\u0646 \u0627\u0644\u0645\u0633\u0627\u0641\u0631\u064a\u0646", "Traveler-filed disputes will appear here")
            }
          />
        ) : (
          <div className="space-y-2">
            {sorted.map((dispute) => (
              <button
                key={dispute.id}
                onClick={() => setSelectedId(dispute.id)}
                className="group w-full text-start"
              >
                <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800">
                  {/* Status indicator bar */}
                  <div className={cn("w-1 self-stretch shrink-0", statusBarColor[dispute.status])} />

                  {/* Icon */}
                  <div className={cn(
                    "hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    dispute.type === "fraud" ? "bg-red-50 dark:bg-red-900/20" :
                    dispute.type === "refund" ? "bg-amber-50 dark:bg-amber-900/20" :
                    "bg-stone-100 dark:bg-stone-800"
                  )}>
                    <AlertTriangle className={cn(
                      "h-5 w-5",
                      dispute.type === "fraud" ? "text-red-500 dark:text-red-400" :
                      dispute.type === "refund" ? "text-amber-500 dark:text-amber-400" :
                      "text-stone-500 dark:text-stone-400"
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 py-3 pe-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-body-sm font-bold text-stone-900 dark:text-white truncate">
                        {dispute.subject}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={dispute.status} />
                      <TypeBadge type={dispute.type} />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-stone-400 dark:text-stone-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {dispute.filedByRole === "traveler"
                          ? t("\u0645\u0633\u0627\u0641\u0631", "Traveler")
                          : t("\u0635\u0627\u062d\u0628 \u062d\u0645\u0644\u0629", "Campaign Owner")}
                      </span>
                      {dispute.amountDisputedKWD != null && dispute.amountDisputedKWD > 0 && (
                        <span className="font-semibold text-stone-600 dark:text-stone-300">
                          {dispute.amountDisputedKWD.toFixed(3)} KWD
                        </span>
                      )}
                      <span className="hidden sm:inline">{getDate(dispute.createdAt)}</span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronRight className="h-4 w-4 shrink-0 me-3 text-stone-300 group-hover:text-stone-500 transition-colors dark:text-stone-600 dark:group-hover:text-stone-400 rtl:rotate-180" />
                </div>
              </button>
            ))}
          </div>
        )}
      </Container>

      {/* -- Dispute Detail Panel -- */}
      {selected && (
        <>
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
                className="shrink-0 rounded-lg p-1.5 -ms-1.5 text-stone-500 hover:bg-stone-100 transition-colors dark:text-stone-400 dark:hover:bg-surface-dark-border sm:hidden"
              >
                <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-stone-900 dark:text-white truncate text-body-md">
                  {selected.subject}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusBadge status={selected.status} />
                  <TypeBadge type={selected.type} />
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="hidden sm:flex shrink-0 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition-colors dark:hover:bg-surface-dark-border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Resolution banner */}
              {selected.resolution && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800/40 dark:bg-emerald-900/15">
                  <p className="text-body-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" />
                    {t("\u0627\u0644\u0642\u0631\u0627\u0631", "Resolution")}
                  </p>
                  <p className="text-body-sm text-emerald-700 dark:text-emerald-400">
                    {selected.resolution}
                  </p>
                </div>
              )}

              {/* Dispute Details */}
              <DetailSection icon={<FileText />} title={t("\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u0646\u0632\u0627\u0639", "Dispute Details")}>
                <DetailRow label={t("\u0627\u0644\u0645\u0648\u0636\u0648\u0639", "Subject")} value={selected.subject} />
                <DetailRow label={t("\u0627\u0644\u0648\u0635\u0641", "Description")} value={selected.description} multiline />
                <DetailRow
                  label={t("\u0627\u0644\u0646\u0648\u0639", "Type")}
                  value={language === "ar" ? typeConfig[selected.type].labelAr : typeConfig[selected.type].label}
                />
                <DetailRow
                  label={t("\u0627\u0644\u062d\u0627\u0644\u0629", "Status")}
                  value={language === "ar" ? statusConfig[selected.status].labelAr : statusConfig[selected.status].label}
                />
                {selected.amountDisputedKWD != null && selected.amountDisputedKWD > 0 && (
                  <DetailRow
                    label={t("\u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u0645\u062a\u0646\u0627\u0632\u0639 \u0639\u0644\u064a\u0647", "Disputed Amount")}
                    value={`${selected.amountDisputedKWD.toFixed(3)} KWD`}
                  />
                )}
                {selected.amountRefundedKWD != null && selected.amountRefundedKWD > 0 && (
                  <DetailRow
                    label={t("\u0627\u0644\u0645\u0628\u0644\u063a \u0627\u0644\u0645\u0633\u062a\u0631\u062f", "Refunded Amount")}
                    value={`${selected.amountRefundedKWD.toFixed(3)} KWD`}
                  />
                )}
              </DetailSection>

              {/* Filed By */}
              <DetailSection icon={<MessageSquare />} title={t("\u0645\u0642\u062f\u0645 \u0627\u0644\u0646\u0632\u0627\u0639", "Filed By")}>
                <DetailRow label={t("\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645", "User ID")} value={selected.filedBy} />
                <DetailRow
                  label={t("\u0627\u0644\u062f\u0648\u0631", "Role")}
                  value={selected.filedByRole === "traveler"
                    ? t("\u0645\u0633\u0627\u0641\u0631", "Traveler")
                    : t("\u0635\u0627\u062d\u0628 \u062d\u0645\u0644\u0629", "Campaign Owner")}
                />
                <DetailRow label={t("\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u062a\u0642\u062f\u064a\u0645", "Filed On")} value={getDate(selected.createdAt)} />
                {selected.updatedAt && (
                  <DetailRow label={t("\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b", "Last Updated")} value={getDate(selected.updatedAt)} />
                )}
              </DetailSection>

              {/* References */}
              <DetailSection icon={<Shield />} title={t("\u0627\u0644\u0645\u0631\u0627\u062c\u0639", "References")}>
                <DetailRow label={t("\u0631\u0642\u0645 \u0627\u0644\u062d\u062c\u0632", "Booking ID")} value={selected.bookingId} />
                <DetailRow label={t("\u0631\u0642\u0645 \u0627\u0644\u0631\u062d\u0644\u0629", "Trip ID")} value={selected.tripId} />
                <DetailRow label={t("\u0631\u0642\u0645 \u0627\u0644\u062d\u0645\u0644\u0629", "Campaign ID")} value={selected.campaignId} />
              </DetailSection>

              {/* Evidence */}
              {selected.evidenceUrls && selected.evidenceUrls.length > 0 && (
                <DetailSection icon={<FileText />} title={t("\u0627\u0644\u0623\u062f\u0644\u0629 \u0627\u0644\u0645\u0631\u0641\u0642\u0629", "Evidence")}>
                  <div className="space-y-1">
                    {selected.evidenceUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-body-sm font-medium text-amber-600 hover:text-amber-700 transition-colors truncate"
                      >
                        {t("\u0645\u0631\u0641\u0642", "Attachment")} {i + 1}
                      </a>
                    ))}
                  </div>
                </DetailSection>
              )}
            </div>

            {/* Footer actions */}
            <div className="shrink-0 flex items-center gap-2 border-t border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {selected.status !== "closed" && selected.status !== "resolved" && (
                <>
                  {selected.status === "open" && (
                    <Button
                      variant="primary"
                      onClick={() => { setNewStatus("under_review"); setStatusModalOpen(true); }}
                      className="flex-1 sm:flex-none"
                    >
                      <Clock className="h-4 w-4 me-1" />
                      {t("\u0628\u062f\u0621 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629", "Start Review")}
                    </Button>
                  )}
                  {(selected.status === "under_review" || selected.status === "escalated") && (
                    <>
                      <Button
                        variant="primary"
                        onClick={() => { setNewStatus("resolved"); setStatusModalOpen(true); }}
                        className="flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 me-1" />
                        {t("\u062d\u0644", "Resolve")}
                      </Button>
                    </>
                  )}
                  {selected.status !== "escalated" && (
                    <Button
                      variant="ghost"
                      onClick={() => { setNewStatus("escalated"); setStatusModalOpen(true); }}
                      className="flex-1 sm:flex-none"
                    >
                      <ArrowUpCircle className="h-4 w-4 me-1" />
                      {t("\u062a\u0635\u0639\u064a\u062f", "Escalate")}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => { setNewStatus("closed"); setStatusModalOpen(true); }}
                    className="flex-1 sm:flex-none"
                  >
                    <XCircle className="h-4 w-4 me-1" />
                    {t("\u0625\u063a\u0644\u0627\u0642", "Close")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* -- Status Update Modal -- */}
      <Modal
        open={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setResolution(""); }}
        title={t("\u062a\u062d\u062f\u064a\u062b \u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0632\u0627\u0639", "Update Dispute Status")}
        description={
          selected
            ? t(
                `\u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u062d\u0627\u0644\u0629 \u0625\u0644\u0649: ${statusConfig[newStatus]?.labelAr}`,
                `Change status to: ${statusConfig[newStatus]?.label}`
              )
            : ""
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setStatusModalOpen(false); setResolution(""); }}>
              {t("\u0625\u0644\u063a\u0627\u0621", "Cancel")}
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateStatus}
              loading={actionLoading}
              disabled={(newStatus === "resolved" || newStatus === "closed") && !resolution.trim()}
            >
              {t("\u062a\u0623\u0643\u064a\u062f", "Confirm")}
            </Button>
          </>
        }
      >
        {/* Status selector */}
        <div className="space-y-2 mb-4">
          <label className="text-body-sm font-medium text-stone-700 dark:text-stone-300">
            {t("\u0627\u0644\u062d\u0627\u0644\u0629 \u0627\u0644\u062c\u062f\u064a\u062f\u0629", "New Status")}
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions
              .filter((opt) => opt.value !== selected?.status)
              .map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setNewStatus(opt.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body-sm font-medium border transition-all",
                    newStatus === opt.value
                      ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-300"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400"
                  )}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
          </div>
        </div>

        {/* Resolution text (required for resolved/closed) */}
        {(newStatus === "resolved" || newStatus === "closed") && (
          <Textarea
            label={t("\u0627\u0644\u0642\u0631\u0627\u0631 / \u0627\u0644\u0645\u0644\u0627\u062d\u0638\u0627\u062a", "Resolution / Notes")}
            placeholder={t("\u0623\u062f\u062e\u0644 \u0642\u0631\u0627\u0631 \u0627\u0644\u0646\u0632\u0627\u0639...", "Enter the dispute resolution...")}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            required
          />
        )}
      </Modal>
    </>
  );
}
