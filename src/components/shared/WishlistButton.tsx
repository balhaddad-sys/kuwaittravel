"use client";

import { useState, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WishlistButtonProps {
  saved: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  variant?: "overlay" | "inline";
  className?: string;
}

function WishlistButton({ saved, onToggle, size = "md", variant = "overlay", className }: WishlistButtonProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  }, [onToggle]);

  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center transition-transform duration-200",
        variant === "overlay" && "rounded-full bg-white/90 p-2 shadow-md hover:bg-white dark:bg-[#262626]/90 dark:hover:bg-[#262626]/60",
        variant === "inline" && "rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-[#262626]/60",
        animating && "scale-125",
        className
      )}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          sizeClass,
          "transition-colors duration-200",
          saved ? "fill-red-500 text-red-500" : "fill-transparent text-slate-600 dark:text-sky-200"
        )}
      />
    </button>
  );
}

export { WishlistButton, type WishlistButtonProps };
