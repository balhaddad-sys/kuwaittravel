import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      {/* Hero skeleton — matches gradient hero */}
      <section className="relative overflow-hidden pb-8 pt-6 sm:pb-12 sm:pt-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#082F49] via-[#0C4A6E] to-[#2E1065]" />
        <Container className="relative">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded-full bg-white/15" />
              <Skeleton className="h-5 w-16 rounded bg-white/15" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg bg-white/15" />
          </div>
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <Skeleton className="mx-auto h-5 w-48 rounded-full bg-white/10" />
            <Skeleton className="mx-auto h-8 w-72 rounded bg-white/15" />
            <Skeleton className="mx-auto h-4 w-56 rounded bg-white/10" />
            <Skeleton className="mx-auto mt-5 h-14 w-full max-w-xl rounded-2xl bg-white/10" />
          </div>
        </Container>
      </section>

      {/* Filter bar skeleton */}
      <div className="border-b border-slate-200/80 bg-white/98 px-4 py-3 dark:border-[#2D3B4F] dark:bg-[#0B1120]/98">
        <Container>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
            ))}
          </div>
        </Container>
      </div>

      {/* Content grid skeleton */}
      <Container className="space-y-8 py-6">
        <section>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="trip" />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
