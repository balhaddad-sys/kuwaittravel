import { cn } from "@/lib/utils/cn";

interface SkeletonCardProps {
  variant?: "trip" | "campaign" | "destination";
  className?: string;
}

function SkeletonCard({ variant = "trip", className }: SkeletonCardProps) {
  if (variant === "destination") {
    return (
      <div className={cn("skeleton-card rounded-2xl p-4", className)}>
        <div className="h-8 w-8 rounded-xl bg-gray-200/50 dark:bg-indigo-800/50" />
        <div className="mt-3 h-4 w-20 rounded-md bg-gray-200/60 dark:bg-indigo-800/60" />
        <div className="mt-1 h-3 w-12 rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
      </div>
    );
  }

  if (variant === "campaign") {
    return (
      <div className={cn("skeleton-card overflow-hidden", className)}>
        <div className="h-28 bg-gray-200/50 dark:bg-indigo-800/50" />
        <div className="space-y-3 px-4 pb-4 pt-8">
          <div className="h-4 w-2/3 rounded-md bg-gray-200/60 dark:bg-indigo-800/60" />
          <div className="h-3 w-full rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
          <div className="flex gap-4">
            <div className="h-3 w-12 rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
            <div className="h-3 w-16 rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
          </div>
        </div>
      </div>
    );
  }

  // Default: trip
  return (
    <div className={cn("skeleton-card overflow-hidden", className)}>
      <div className="h-40 bg-gray-200/50 dark:bg-indigo-800/50" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-md bg-gray-200/60 dark:bg-indigo-800/60" />
        <div className="h-3 w-1/2 rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
        <div className="h-2 w-full rounded-full bg-gray-200/30 dark:bg-indigo-800/30" />
        <div className="flex justify-between pt-2">
          <div className="h-3 w-16 rounded-md bg-gray-200/40 dark:bg-indigo-800/40" />
          <div className="h-4 w-20 rounded-md bg-gray-200/60 dark:bg-indigo-800/60" />
        </div>
      </div>
    </div>
  );
}

export { SkeletonCard, type SkeletonCardProps };
