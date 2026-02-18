"use client";

import { useState, useEffect, useMemo } from "react";
import { AppBar } from "@/components/layout/AppBar";
import { Container } from "@/components/layout/Container";
import { StatCard } from "@/components/data-display/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDirection } from "@/providers/DirectionProvider";
import { useAuth } from "@/hooks/useAuth";
import { onCollectionChange } from "@/lib/firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { cn } from "@/lib/utils/cn";
import { formatKWD, parseTimestamp, formatRelativeTime, formatPhone } from "@/lib/utils/format";
import type { Campaign } from "@/types/campaign";
import type { User } from "@/types/user";
import type { Trip } from "@/types/trip";
import type { Booking } from "@/types/booking";
import type { Dispute } from "@/types/notification";
import {
  Building2,
  Users,
  Wallet,
  Map,
  TrendingUp,
  AlertTriangle,
  Phone,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t, language } = useDirection();
  const { firebaseUser } = useAuth();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  // Track which collections have loaded
  const [loaded, setLoaded] = useState({ campaigns: false, users: false, trips: false, bookings: false, disputes: false });

  useEffect(() => {
    if (!firebaseUser) return;

    const unsubs: (() => void)[] = [];

    unsubs.push(
      onCollectionChange<Campaign>(COLLECTIONS.CAMPAIGNS, [], (data) => {
        setCampaigns(data);
        setLoaded((prev) => ({ ...prev, campaigns: true }));
      })
    );

    unsubs.push(
      onCollectionChange<User>(COLLECTIONS.USERS, [], (data) => {
        setUsers(data);
        setLoaded((prev) => ({ ...prev, users: true }));
      })
    );

    unsubs.push(
      onCollectionChange<Trip>(COLLECTIONS.TRIPS, [], (data) => {
        setTrips(data);
        setLoaded((prev) => ({ ...prev, trips: true }));
      })
    );

    unsubs.push(
      onCollectionChange<Booking>(COLLECTIONS.BOOKINGS, [], (data) => {
        setBookings(data);
        setLoaded((prev) => ({ ...prev, bookings: true }));
      })
    );

    unsubs.push(
      onCollectionChange<Dispute>(COLLECTIONS.DISPUTES, [], (data) => {
        setDisputes(data);
        setLoaded((prev) => ({ ...prev, disputes: true }));
      })
    );

    return () => unsubs.forEach((fn) => fn());
  }, [firebaseUser]);

  // Mark loading complete when all collections are loaded
  useEffect(() => {
    if (loaded.campaigns && loaded.users && loaded.trips && loaded.bookings && loaded.disputes) {
      setLoading(false);
    }
  }, [loaded]);

  // Computed stats
  const totalGMV = useMemo(() => bookings.reduce((sum, b) => sum + (b.totalKWD || 0), 0), [bookings]);
  const platformFee = totalGMV * 0.02;
  const campaignPayouts = totalGMV - platformFee;

  const activeTrips = useMemo(
    () => trips.filter((t) => ["published", "registration_open", "in_progress"].includes(t.status)),
    [trips]
  );

  const pendingCampaigns = useMemo(
    () =>
      campaigns
        .filter((c) => c.verificationStatus === "pending")
        .sort((a, b) => {
          const dateA = parseTimestamp(a.createdAt)?.getTime() ?? 0;
          const dateB = parseTimestamp(b.createdAt)?.getTime() ?? 0;
          return dateB - dateA;
        })
        .slice(0, 5),
    [campaigns]
  );

  const openDisputes = useMemo(
    () => disputes.filter((d) => d.status === "open" || d.status === "under_review"),
    [disputes]
  );

  const getCreatedDate = (createdAt: unknown) => {
    const d = parseTimestamp(createdAt);
    return d ? formatRelativeTime(d, language === "ar" ? "ar-KW" : "en-US") : "\u2014";
  };

  return (
    <>
      <AppBar
        title={t("\u0644\u0648\u062d\u0629 \u062a\u062d\u0643\u0645 \u0627\u0644\u0645\u0634\u0631\u0641", "Admin Dashboard")}
        breadcrumbs={[{ label: t("\u0627\u0644\u0645\u0634\u0631\u0641 \u0627\u0644\u0639\u0627\u0645", "Admin Console") }, { label: t("\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645", "Dashboard") }]}
      />
      <Container className="sacred-pattern py-3 sm:py-6 space-y-3 sm:space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title={t("\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u062d\u0645\u0644\u0627\u062a", "Total Campaigns")}
            value={loading ? "\u2026" : String(campaigns.length)}
            icon={<Building2 className="h-6 w-6" />}
            className="animate-stagger-in"
            hoverable
          />
          <StatCard
            title={t("\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u064a\u0646", "Total Users")}
            value={loading ? "\u2026" : String(users.length)}
            icon={<Users className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-1"
            hoverable
          />
          <StatCard
            title={t("GMV (\u062f.\u0643)", "GMV (KWD)")}
            value={loading ? "\u2026" : formatKWD(totalGMV)}
            icon={<Wallet className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-2"
            hoverable
          />
          <StatCard
            title={t("\u0627\u0644\u0631\u062d\u0644\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629", "Active Trips")}
            value={loading ? "\u2026" : String(activeTrips.length)}
            icon={<Map className="h-6 w-6" />}
            className="animate-stagger-in stagger-delay-3"
            hoverable
          />
        </div>

        {/* Two-column: Pending Campaigns + Open Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* Pending Campaigns */}
          <Card variant="elevated" padding="lg" className="sacred-glow">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="travel-icon-circle travel-icon-circle-sm travel-icon-circle-gold">
                <Building2 className="h-4 w-4" />
              </span>
              {t("\u062d\u0645\u0644\u0627\u062a \u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0627\u0644\u062a\u062d\u0642\u0642", "Campaigns Pending Verification")}
              {pendingCampaigns.length > 0 && (
                <Badge variant="warning" size="sm" dot>
                  {pendingCampaigns.length}
                </Badge>
              )}
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
              </div>
            ) : pendingCampaigns.length === 0 ? (
              <EmptyState
                icon={<Building2 className="h-12 w-12" />}
                title={t("\u0644\u0627 \u062a\u0648\u062c\u062f \u062d\u0645\u0644\u0627\u062a \u0645\u0639\u0644\u0642\u0629", "No Pending Campaigns")}
                description={t("\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0627\u0644\u062d\u0645\u0644\u0627\u062a \u0627\u0644\u062a\u064a \u062a\u062d\u062a\u0627\u062c \u0645\u0631\u0627\u062c\u0639\u0629", "Campaigns awaiting review will appear here")}
                className="py-8"
              />
            ) : (
              <div className="space-y-2">
                {pendingCampaigns.map((campaign) => (
                  <a
                    key={campaign.id}
                    href="/admin/campaigns"
                    className="group flex items-center gap-3 rounded-lg border border-surface-border/60 bg-white/60 p-3 transition-all hover:bg-amber-50/40 hover:shadow-sm dark:border-surface-dark-border/60 dark:bg-white/[0.02] dark:hover:bg-amber-900/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-stone-900 dark:text-white truncate">
                        {language === "ar" ? campaign.nameAr : campaign.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-400 dark:text-stone-500">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {campaign.licenseNumber}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span dir="ltr">{formatPhone(campaign.contactPhone)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-[11px] text-stone-400 dark:text-stone-500 hidden sm:block">
                      {getCreatedDate(campaign.createdAt)}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 group-hover:text-amber-500 transition-colors dark:text-stone-600 rtl:rotate-180" />
                  </a>
                ))}
              </div>
            )}
          </Card>

          {/* Open Disputes */}
          <Card variant="elevated" padding="lg" className="sacred-glow">
            <h3 className="text-body-lg sm:text-heading-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="travel-icon-circle travel-icon-circle-sm border-error/30 text-error dark:border-error/40">
                <AlertTriangle className="h-4 w-4" />
              </span>
              {t("\u0646\u0632\u0627\u0639\u0627\u062a \u0645\u0641\u062a\u0648\u062d\u0629", "Open Disputes")}
              {openDisputes.length > 0 && (
                <Badge variant="error" size="sm" dot>
                  {openDisputes.length}
                </Badge>
              )}
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-3 border-red-500 border-t-transparent" />
              </div>
            ) : openDisputes.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="h-12 w-12" />}
                title={t("\u0644\u0627 \u062a\u0648\u062c\u062f \u0646\u0632\u0627\u0639\u0627\u062a", "No Open Disputes")}
                description={t("\u0633\u062a\u0638\u0647\u0631 \u0647\u0646\u0627 \u0627\u0644\u0646\u0632\u0627\u0639\u0627\u062a \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629", "Open disputes will appear here")}
                className="py-8"
              />
            ) : (
              <div className="space-y-2">
                {openDisputes.slice(0, 5).map((dispute) => (
                  <a
                    key={dispute.id}
                    href="/admin/disputes"
                    className="group flex items-center gap-3 rounded-lg border border-surface-border/60 bg-white/60 p-3 transition-all hover:bg-red-50/40 hover:shadow-sm dark:border-surface-dark-border/60 dark:bg-white/[0.02] dark:hover:bg-red-900/10"
                  >
                    <div className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      dispute.status === "open"
                        ? "bg-red-50 dark:bg-red-900/20"
                        : "bg-amber-50 dark:bg-amber-900/20"
                    )}>
                      <AlertTriangle className={cn(
                        "h-4 w-4",
                        dispute.status === "open"
                          ? "text-red-600 dark:text-red-400"
                          : "text-amber-600 dark:text-amber-400"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold text-stone-900 dark:text-white truncate">
                        {dispute.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant={dispute.status === "open" ? "error" : "warning"}
                          size="sm"
                          dot
                        >
                          {dispute.status === "open"
                            ? t("\u0645\u0641\u062a\u0648\u062d\u0629", "Open")
                            : t("\u0642\u064a\u062f \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629", "Under Review")}
                        </Badge>
                        <Badge
                          variant={
                            dispute.type === "fraud" ? "error" :
                            dispute.type === "refund" ? "warning" :
                            "default"
                          }
                          size="sm"
                        >
                          {dispute.type === "refund" ? t("\u0627\u0633\u062a\u0631\u062f\u0627\u062f", "Refund") :
                           dispute.type === "service_quality" ? t("\u062c\u0648\u062f\u0629 \u0627\u0644\u062e\u062f\u0645\u0629", "Service") :
                           dispute.type === "fraud" ? t("\u0627\u062d\u062a\u064a\u0627\u0644", "Fraud") :
                           t("\u0623\u062e\u0631\u0649", "Other")}
                        </Badge>
                      </div>
                    </div>
                    <div className="shrink-0 text-[11px] text-stone-400 dark:text-stone-500 hidden sm:block">
                      {getCreatedDate(dispute.createdAt)}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-stone-300 group-hover:text-red-500 transition-colors dark:text-stone-600 rtl:rotate-180" />
                  </a>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Revenue Summary */}
        <Card variant="elevated" padding="lg" className="overflow-hidden">
          <div className="-mx-4 -mt-4 mb-4 border-b border-surface-border/80 bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-3 text-white dark:border-surface-dark-border/80 sm:-mx-6 sm:-mt-6 sm:px-6">
            <h3 className="text-body-lg sm:text-heading-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-300" /> {t("\u0645\u0644\u062e\u0635 \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a", "Revenue Summary")}
            </h3>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-3 border-amber-500 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-body-sm text-stone-500">{t("\u0625\u062c\u0645\u0627\u0644\u064a GMV", "Total GMV")}</p>
                <p className="tabular-nums text-body-lg sm:text-heading-md font-bold text-stone-900 dark:text-white">{formatKWD(totalGMV)}</p>
              </div>
              <div>
                <p className="text-body-sm text-stone-500">{t("\u0639\u0645\u0648\u0644\u0629 \u0627\u0644\u0645\u0646\u0635\u0629 (2%)", "Platform Fee (2%)")}</p>
                <p className="tabular-nums text-body-lg sm:text-heading-md font-bold text-success">{formatKWD(platformFee)}</p>
              </div>
              <div>
                <p className="text-body-sm text-stone-500">{t("\u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a \u0644\u0644\u062d\u0645\u0644\u0627\u062a", "Campaign Payouts")}</p>
                <p className="tabular-nums text-body-lg sm:text-heading-md font-bold text-stone-900 dark:text-white">{formatKWD(campaignPayouts)}</p>
              </div>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
