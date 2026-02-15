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
        "relative sticky top-0 z-[var(--z-topbar)] flex h-[72px] items-center justify-between gap-4 border-b border-surface-border/80 dark:border-surface-dark-border/80 bg-white/78 dark:bg-surface-dark/70 backdrop-blur-sm px-6 shadow-topbar",
        className
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-navy-400 transition-[background-color,color,transform] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:bg-surface-muted dark:hover:bg-surface-dark-card active:scale-[0.97] lg:hidden"
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
                    <Link href={crumb.href} prefetch className="transition-colors duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:text-navy-600">
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
      <div className="flex items-center gap-2">
        {showLanguageToggle && <LanguageToggle className="shrink-0" />}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export { AppBar, type AppBarProps };
