import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Menu } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AppBarProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  onMenuToggle?: () => void;
  showLanguageToggle?: boolean;
  className?: string;
}

function AppBar({
  title,
  breadcrumbs,
  actions,
  onMenuToggle,
  showLanguageToggle = true,
  className,
}: AppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-topbar)] flex h-14 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/98 px-4 backdrop-blur-xl sm:h-16 sm:gap-4 sm:px-6 lg:px-8 dark:border-[#2D3B4F] dark:bg-[#111827]/95",
        "shadow-[0_1px_0_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="shrink-0 rounded-xl border border-transparent p-2 text-slate-500 transition-all duration-[var(--duration-ui)] hover:border-slate-200 hover:bg-slate-50 hover:text-slate-700 active:scale-95 dark:text-slate-300/60 dark:hover:border-sky-700/40 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="hidden items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 sm:flex">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-300 dark:text-sky-700/60">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} prefetch className="transition-colors hover:text-sky-600 dark:hover:text-sky-400">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-slate-900 dark:text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {title && (
            <h1 className="truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
              {title}
            </h1>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showLanguageToggle && <LanguageToggle className="shrink-0 hidden sm:inline-flex" />}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export { AppBar, type AppBarProps };
