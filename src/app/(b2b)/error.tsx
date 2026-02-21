"use client";

import { useEffect } from "react";

export default function B2BError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Something went wrong
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-sky-300/60">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
      >
        Try again
      </button>
    </div>
  );
}
