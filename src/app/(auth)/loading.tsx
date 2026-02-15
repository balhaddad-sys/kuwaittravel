import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted dark:bg-surface-dark p-4">
      <div className="w-full max-w-md rounded-[var(--radius-card)] border border-surface-border dark:border-surface-dark-border bg-white dark:bg-surface-dark-card p-6 space-y-4">
        <div className="flex justify-center">
          <Skeleton variant="circular" className="h-16 w-16" />
        </div>
        <Skeleton className="h-7 w-40 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}
