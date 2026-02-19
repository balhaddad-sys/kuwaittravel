"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { usePathname } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [active, setActive] = useState(false);
  const [width, setWidth] = useState(0);
  const trickle = useRef<ReturnType<typeof setInterval>>(undefined);
  const hide = useRef<ReturnType<typeof setTimeout>>(undefined);

  const start = useCallback(() => {
    clearTimeout(hide.current);
    clearInterval(trickle.current);
    setActive(true);
    setWidth(20);
    trickle.current = setInterval(() => {
      setWidth((w) => {
        if (w >= 80) return w;
        return w + (85 - w) * 0.1;
      });
    }, 200);
  }, []);

  const complete = useCallback(() => {
    clearInterval(trickle.current);
    setWidth(100);
    hide.current = setTimeout(() => {
      setActive(false);
      setWidth(0);
    }, 300);
  }, []);

  // Complete when pathname changes (route loaded)
  useEffect(() => {
    if (prevPath.current === pathname) return;

    const completeTick = window.setTimeout(() => {
      complete();
    }, 0);

    prevPath.current = pathname;
    return () => window.clearTimeout(completeTick);
  }, [pathname, complete]);

  // Listen for navigation events
  useEffect(() => {
    const onNavStart = () => start();
    window.addEventListener("nav:start", onNavStart);

    // Intercept <a> clicks (covers Next.js <Link> components)
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      if (href !== pathname) start();
    };

    document.addEventListener("click", onClick, { capture: true });

    return () => {
      window.removeEventListener("nav:start", onNavStart);
      document.removeEventListener("click", onClick, { capture: true });
      clearInterval(trickle.current);
      clearTimeout(hide.current);
    };
  }, [pathname, start]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
      style={{ opacity: active ? 1 : 0, transition: "opacity 300ms ease-out" }}
    >
      <div
        className="h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-400"
        style={{
          width: `${width}%`,
          transition:
            width === 100
              ? "width 200ms ease-out"
              : "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow:
            "0 0 10px rgba(37, 99, 235, 0.6), 0 0 3px rgba(37, 99, 235, 0.35)",
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
