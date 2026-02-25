import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function DiscoverLoading() {
  return (
    <div className="min-h-screen">
      {/* Top bar skeleton */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#EBEBEB] dark:border-[#383838]">
        <div className="flex h-14 items-center justify-between px-4">
          <Skeleton className="h-5 w-16 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
        {/* Search skeleton */}
        <div className="px-4 pb-3">
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
        {/* Filter chips skeleton */}
        <div className="border-b border-[#EBEBEB] dark:border-[#383838] px-4 pb-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <Container className="space-y-8 py-6">
        <section>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="trip" />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
