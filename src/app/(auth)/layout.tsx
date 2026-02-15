import { PageTransition } from "@/components/layout/PageTransition";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted dark:bg-surface-dark p-4">
      <div className="w-full max-w-md">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
