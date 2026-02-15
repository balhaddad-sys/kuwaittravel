import { cn } from "@/lib/utils/cn";
import Link from "next/link";
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
  className?: string;
}

function AppBar({ title, breadcrumbs, actions, onMenuToggle, className }: AppBarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-[var(--z-topbar)] flex h-16 items-center justify-between gap-4 border-b border-surface-border dark:border-surface-dark-border bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm px-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-navy-400 hover:bg-surface-muted dark:hover:bg-surface-dark-card transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-body-sm text-navy-400">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span>/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-navy-600 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-navy-600 dark:text-navy-300">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {title && (
            <h1 className="text-heading-md font-bold text-navy-900 dark:text-white">
              {title}
            </h1>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export { AppBar, type AppBarProps };
