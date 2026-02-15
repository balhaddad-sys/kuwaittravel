import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function B2CLoading() {
  return (
    <div className="min-h-screen bg-surface-muted dark:bg-surface-dark">
      <div className="px-4 pt-12 pb-4 border-b border-surface-border dark:border-surface-dark-border bg-white dark:bg-surface-dark-card">
        <Container>
          <Skeleton className="h-8 w-40" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-9 w-24 rounded-[var(--radius-chip)]" />
            <Skeleton className="h-9 w-24 rounded-[var(--radius-chip)]" />
          </div>
        </Container>
      </div>
      <Container className="py-6 space-y-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </Container>
    </div>
  );
}
