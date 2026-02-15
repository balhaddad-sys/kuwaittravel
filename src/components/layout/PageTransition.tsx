interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return className ? <div className={className}>{children}</div> : <>{children}</>;
}
