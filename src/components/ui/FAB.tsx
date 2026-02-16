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
        "z-[var(--z-fab)] flex items-center justify-center gap-2 rounded-[var(--radius-fab)] border border-gold-300/70 bg-gradient-to-br from-gold-400 to-gold-500 text-navy-900 shadow-fab transition-[transform,box-shadow,background-color] duration-[var(--duration-ui)] ease-[var(--ease-smooth)] hover:-translate-y-0.5 hover:from-gold-300 hover:to-gold-500 active:translate-y-0 active:scale-95",
        label ? "px-5 h-14" : "h-14 w-14",
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
