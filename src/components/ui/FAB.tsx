"use client";

import { cn } from "@/lib/utils/cn";

interface FABProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  className?: string;
}

const positionMap = {
  "bottom-right": "fixed bottom-6 end-6",
  "bottom-left": "fixed bottom-6 start-6",
  "bottom-center": "fixed bottom-6 start-1/2 -translate-x-1/2",
};

function FAB({ icon, label, onClick, position = "bottom-right", className }: FABProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fab-button animate-fab-enter animate-fab-idle z-[var(--z-fab)] flex items-center justify-center gap-2 border border-navy-500/90 bg-gradient-to-br from-navy-700 to-navy-800 text-white shadow-fab transition-[transform,box-shadow,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:from-navy-600 hover:to-navy-700 active:translate-y-0 active:scale-95",
        label ? "!w-auto h-16 px-6" : "",
        positionMap[position],
        className
      )}
    >
      {icon}
      {label && <span className="font-semibold text-body-md">{label}</span>}
    </button>
  );
}

export { FAB, type FABProps };
