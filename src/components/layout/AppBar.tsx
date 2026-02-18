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
        "sticky top-0 z-[var(--z-topbar)] flex h-14 items-center justify-between gap-3 border-b border-stone-200 bg-white/95 px-4 shadow-topbar backdrop-blur-md sm:h-[72px] sm:gap-4 sm:px-6 lg:px-8 dark:border-stone-700 dark:bg-stone-900/95",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="shrink-0 rounded-[var(--radius-md)] border border-transparent p-2 text-stone-400 transition-[background-color,color,border-color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:border-stone-200 hover:bg-stone-50 hover:text-stone-600 active:scale-[0.97] dark:text-stone-500 dark:hover:border-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-300 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="hidden items-center gap-1.5 text-body-sm text-stone-400 dark:text-stone-500 sm:flex">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-stone-300 dark:text-stone-600">›</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} prefetch className="transition-colors duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:text-blue-600 dark:hover:text-blue-400">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-stone-900 dark:text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {title && (
            <h1 className="truncate text-body-lg font-bold text-stone-900 dark:text-white sm:text-heading-md">
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
