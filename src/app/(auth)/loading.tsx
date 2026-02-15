import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="animate-fade-in rounded-[var(--radius-card)] border border-surface-border/80 bg-white/86 p-6 shadow-card backdrop-blur-sm dark:border-surface-dark-border/80 dark:bg-surface-dark-card/84">
      <div className="space-y-4">
        <div className="flex justify-center">
          <Skeleton variant="circular" className="h-16 w-16" />
        </div>
        <Skeleton className="mx-auto h-7 w-40" />
        <Skeleton className="mx-auto h-4 w-56" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
