import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      <div className="sticky top-0 z-[var(--z-topbar)] h-16 border-b border-surface-border dark:border-surface-dark-border bg-white/95 dark:bg-surface-dark/95 px-6 flex items-center">
        <Skeleton className="h-6 w-64" />
      </div>
      <Container className="py-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-72 w-full" />
      </Container>
    </div>
  );
}
