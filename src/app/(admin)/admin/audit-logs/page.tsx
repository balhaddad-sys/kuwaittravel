"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/forms/SearchInput";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils/cn";
import { parseTimestamp, formatRelativeTime } from "@/lib/utils/format";
import type { AuditLog } from "@/types/notification";
import {
  ScrollText,
  ShieldCheck,
  ShieldX,
  Ban,
  UserPlus,
  UserMinus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowUpCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Activity,
} from "lucide-react";

/* -- Action color/icon maps -- */

interface ActionConfig {
  icon: React.ReactNode;
  variant: "default" | "success" | "warning" | "error" | "info" | "teal" | "amber";
  labelAr: string;
  label: string;
  color: string;
}

const actionConfigMap: Record<string, ActionConfig> = {
  campaign_approved: {
    icon: <ShieldCheck className="h-4 w-4" />,
    variant: "success",
    labelAr: "\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u062d\u0645\u0644\u0629",
    label: "Campaign Approved",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  campaign_rejected: {
    icon: <ShieldX className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u0631\u0641\u0636 \u062d\u0645\u0644\u0629",
    label: "Campaign Rejected",
    color: "text-red-600 dark:text-red-400",
  },
  campaign_suspended: {
    icon: <Ban className="h-4 w-4" />,
    variant: "warning",
    labelAr: "\u062a\u0639\u0644\u064a\u0642 \u062d\u0645\u0644\u0629",
    label: "Campaign Suspended",
    color: "text-amber-600 dark:text-amber-400",
  },
  user_created: {
    icon: <UserPlus className="h-4 w-4" />,
    variant: "success",
    labelAr: "\u0625\u0646\u0634\u0627\u0621 \u0645\u0633\u062a\u062e\u062f\u0645",
    label: "User Created",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  user_deactivated: {
    icon: <UserMinus className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u062a\u0639\u0637\u064a\u0644 \u0645\u0633\u062a\u062e\u062f\u0645",
    label: "User Deactivated",
    color: "text-red-600 dark:text-red-400",
  },
  user_activated: {
    icon: <UserPlus className="h-4 w-4" />,
    variant: "success",
    labelAr: "\u062a\u0641\u0639\u064a\u0644 \u0645\u0633\u062a\u062e\u062f\u0645",
    label: "User Activated",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  booking_updated: {
    icon: <Edit className="h-4 w-4" />,
    variant: "info",
    labelAr: "\u062a\u062d\u062f\u064a\u062b \u062d\u062c\u0632",
    label: "Booking Updated",
    color: "text-blue-600 dark:text-blue-400",
  },
  booking_cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u0625\u0644\u063a\u0627\u0621 \u062d\u062c\u0632",
    label: "Booking Cancelled",
    color: "text-red-600 dark:text-red-400",
  },
  dispute_resolved: {
    icon: <CheckCircle className="h-4 w-4" />,
    variant: "success",
    labelAr: "\u062d\u0644 \u0646\u0632\u0627\u0639",
    label: "Dispute Resolved",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  dispute_escalated: {
    icon: <ArrowUpCircle className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u062a\u0635\u0639\u064a\u062f \u0646\u0632\u0627\u0639",
    label: "Dispute Escalated",
    color: "text-red-600 dark:text-red-400",
  },
  dispute_under_review: {
    icon: <Eye className="h-4 w-4" />,
    variant: "warning",
    labelAr: "\u0645\u0631\u0627\u062c\u0639\u0629 \u0646\u0632\u0627\u0639",
    label: "Dispute Under Review",
    color: "text-amber-600 dark:text-amber-400",
  },
  dispute_closed: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "default",
    labelAr: "\u0625\u063a\u0644\u0627\u0642 \u0646\u0632\u0627\u0639",
    label: "Dispute Closed",
    color: "text-stone-600 dark:text-stone-400",
  },
  trip_published: {
    icon: <Activity className="h-4 w-4" />,
    variant: "success",
    labelAr: "\u0646\u0634\u0631 \u0631\u062d\u0644\u0629",
    label: "Trip Published",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  trip_cancelled: {
    icon: <XCircle className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u0625\u0644\u063a\u0627\u0621 \u0631\u062d\u0644\u0629",
    label: "Trip Cancelled",
    color: "text-red-600 dark:text-red-400",
  },
  document_deleted: {
    icon: <Trash2 className="h-4 w-4" />,
    variant: "error",
    labelAr: "\u062d\u0630\u0641 \u0645\u0633\u062a\u0646\u062f",
    label: "Document Deleted",
    color: "text-red-600 dark:text-red-400",
  },
};

const defaultActionConfig: ActionConfig = {
  icon: <Activity className="h-4 w-4" />,
  variant: "default",
  labelAr: "\u0625\u062c\u0631\u0627\u0621",
  label: "Action",
  color: "text-stone-600 dark:text-stone-400",
};

function getActionConfig(action: string): ActionConfig {
  // Check direct match
  if (actionConfigMap[action]) return actionConfigMap[action];

  // Partial matching for dynamic action names
  if (action.includes("approve")) return actionConfigMap.campaign_approved;
  if (action.includes("reject")) return actionConfigMap.campaign_rejected;
  if (action.includes("suspend")) return actionConfigMap.campaign_suspended;
  if (action.includes("deactivat")) return actionConfigMap.user_deactivated;
  if (action.includes("activat")) return actionConfigMap.user_activated;
  if (action.includes("resolv")) return actionConfigMap.dispute_resolved;
  if (action.includes("escalat")) return actionConfigMap.dispute_escalated;
  if (action.includes("cancel")) return actionConfigMap.booking_cancelled;
  if (action.includes("delet")) return actionConfigMap.document_deleted;

  return defaultActionConfig;
}

/* -- Main page -- */

export default function AuditLogsPage() {
  const { t, language } = useDirection();
  const { firebaseUser } = useAuth();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Real-time subscription
  useEffect(() => {
    if (!firebaseUser) return;
    setLoadingData(true);
    const unsub = onCollectionChange<AuditLog>(
      COLLECTIONS.AUDIT_LOGS,
      [],
      (data) => {
        setLogs(data);
        setLoadingData(false);
      },
      (err) => {
        console.error("Audit logs listener failed:", err);
        setLoadingData(false);
      }
    );
    return unsub;
  }, [firebaseUser]);

  // Filtered + sorted logs
  const filtered = useMemo(() => {
    let list = logs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (log) =>
          log.actorName.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.entityType.toLowerCase().includes(q) ||
          (log.actorRole && log.actorRole.toLowerCase().includes(q))
      );
    }
    // Sort by newest first
    return [...list].sort((a, b) => {
      const dateA = parseTimestamp(a.createdAt)?.getTime() ?? 0;
      const dateB = parseTimestamp(b.createdAt)?.getTime() ?? 0;
      return dateB - dateA;
    });
  }, [logs, search]);

  const getDate = (ts: unknown) => {
    const d = parseTimestamp(ts);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
  };

  const roleDisplay = (role: string) => {
    const roleMap: Record<string, { ar: string; en: string }> = {
      admin: { ar: "\u0645\u0634\u0631\u0641", en: "Admin" },
      super_admin: { ar: "\u0645\u0634\u0631\u0641 \u0639\u0627\u0645", en: "Super Admin" },
      campaign_owner: { ar: "\u0635\u0627\u062d\u0628 \u062d\u0645\u0644\u0629", en: "Campaign Owner" },
      campaign_staff: { ar: "\u0641\u0631\u064a\u0642 \u0627\u0644\u062d\u0645\u0644\u0629", en: "Campaign Staff" },
      traveler: { ar: "\u0645\u0633\u0627\u0641\u0631", en: "Traveler" },
    };
    const r = roleMap[role];
    return r ? (language === "ar" ? r.ar : r.en) : role;
  };

  return (
    <>
      <AppBar
        title={t("\u0633\u062c\u0644 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a", "Audit Logs")}
        breadcrumbs={[
          { label: t("\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645", "Admin Console"), href: "/admin/dashboard" },
          { label: t("\u0633\u062c\u0644 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a", "Audit Logs") },
        ]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-4">
        {/* Search + Badge */}
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <SearchInput
            placeholder={t("\u0627\u0628\u062d\u062b \u0628\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0623\u0648 \u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644\u064a\u0629...", "Search by user or action type...")}
            onSearch={setSearch}
          />
          <div className="rounded-[var(--radius-input)] border border-surface-border/90 bg-white/80 px-4 py-2.5 text-body-sm text-stone-500 backdrop-blur-sm dark:border-surface-dark-border/90 dark:bg-surface-dark-card/80 dark:text-stone-400 flex items-center gap-2">
            <ScrollText className="h-4 w-4" />
            {loadingData ? "\u2026" : `${filtered.length} ${t("\u0633\u062c\u0644", "entries")}`}
          </div>
        </div>

        {/* Log entries */}
        <Card variant="elevated" padding="none">
          <div className="border-b border-surface-border/80 px-4 py-3 dark:border-surface-dark-border/80">
            <h3 className="text-body-md font-semibold text-stone-900 dark:text-white">
              {t("\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637 \u0648\u0627\u0644\u062a\u062f\u0642\u064a\u0642", "Activity & Audit Log")}
            </h3>
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<ScrollText className="h-16 w-16" />}
              title={t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0639\u0645\u0644\u064a\u0627\u062a", "No Activity")}
              description={
                search.trim()
                  ? t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u062a\u0627\u0626\u062c \u0644\u0644\u0628\u062d\u062b", "No results match your search")
                  : t("\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0633\u062c\u0644\u0627\u062a \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a", "Operations logs will appear here")
              }
            />
          ) : (
            <div className="divide-y divide-surface-border/60 dark:divide-surface-dark-border/60">
              {filtered.map((log) => {
                const config = getActionConfig(log.action);
                const isExpanded = expandedId === log.id;
                const hasChanges = log.changes && log.changes.length > 0;

                return (
                  <div key={log.id} className="group">
                    <button
                      className="w-full text-start px-4 py-3 transition-colors hover:bg-stone-50/60 dark:hover:bg-white/[0.02]"
                      onClick={() => hasChanges ? setExpandedId(isExpanded ? null : log.id) : undefined}
                    >
                      <div className="flex items-start gap-3">
                        {/* Action icon */}
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                          config.variant === "success" ? "bg-emerald-50 dark:bg-emerald-900/20" :
                          config.variant === "error" ? "bg-red-50 dark:bg-red-900/20" :
                          config.variant === "warning" ? "bg-amber-50 dark:bg-amber-900/20" :
                          config.variant === "info" ? "bg-blue-50 dark:bg-blue-900/20" :
                          "bg-stone-100 dark:bg-stone-800"
                        )}>
                          <span className={config.color}>{config.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={config.variant} size="sm">
                              {language === "ar" ? config.labelAr : config.label}
                            </Badge>
                            <span className="text-[11px] text-stone-400 dark:text-stone-500">
                              {log.action}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-body-sm">
                            <span className="font-semibold text-stone-900 dark:text-white">
                              {log.actorName}
                            </span>
                            <Badge variant="default" size="sm">
                              {roleDisplay(log.actorRole)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-400 dark:text-stone-500">
                            <span>
                              {t("\u0627\u0644\u0643\u064a\u0627\u0646", "Entity")}: {log.entityType}
                            </span>
                            <span className="font-mono text-[10px]">
                              {log.entityId}
                            </span>
                            <span className="ms-auto">{getDate(log.createdAt)}</span>
                          </div>
                        </div>

                        {/* Expand chevron */}
                        {hasChanges && (
                          <div className="shrink-0 mt-1">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-stone-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Expanded changes */}
                    {isExpanded && hasChanges && (
                      <div className="px-4 pb-3 ps-[3.25rem]">
                        <div className="rounded-lg border border-surface-border/70 bg-stone-50/80 p-3 dark:border-surface-dark-border/70 dark:bg-white/[0.02]">
                          <h5 className="text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-2">
                            {t("\u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a", "Changes")}
                          </h5>
                          <div className="space-y-2">
                            {log.changes!.map((change, idx) => (
                              <div key={idx} className="text-body-sm">
                                <span className="font-medium text-stone-700 dark:text-stone-300">
                                  {change.field}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5 text-xs">
                                  <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-red-700 dark:bg-red-900/20 dark:text-red-400 line-through">
                                    {String(change.oldValue ?? "\u2014")}
                                  </span>
                                  <span className="text-stone-400">{"\u2192"}</span>
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                    {String(change.newValue ?? "\u2014")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
