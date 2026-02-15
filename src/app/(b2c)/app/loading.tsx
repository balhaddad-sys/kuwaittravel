import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function B2CLoading() {
  return (
    <Container className="animate-fade-in py-6 space-y-4">
      <div className="rounded-[var(--radius-card)] border border-surface-border/80 bg-white/84 p-4 shadow-card backdrop-blur-sm dark:border-surface-dark-border/80 dark:bg-surface-dark-card/82">
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-9 w-24 rounded-[var(--radius-chip)]" />
          <Skeleton className="h-9 w-24 rounded-[var(--radius-chip)]" />
        </div>
      </div>
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-28 w-full" />
    </Container>
  );
}
