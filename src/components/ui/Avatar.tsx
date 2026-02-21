import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const sizePx = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function Avatar({ src, alt, name, size = "md", ring = false, className }: AvatarProps) {
  const initial = (name || alt || "").trim().charAt(0).toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn(
          "rounded-full object-cover",
          ring && "ring-2 ring-white/90 ring-offset-2 ring-offset-transparent dark:ring-sky-400/40",
          sizeMap[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-slate-200/85 bg-gradient-to-br from-sky-50 to-violet-50 text-sky-700 dark:border-[#2D3B4F] dark:from-sky-900/40 dark:to-violet-900/40 dark:text-sky-300",
        ring && "ring-2 ring-white/90 ring-offset-2 ring-offset-transparent dark:ring-sky-400/40",
        sizeMap[size],
        className
      )}
    >
      {initial ? (
        <span className="font-bold">{initial}</span>
      ) : (
        <User className="h-1/2 w-1/2" />
      )}
    </div>
  );
}

export { Avatar, type AvatarProps };
