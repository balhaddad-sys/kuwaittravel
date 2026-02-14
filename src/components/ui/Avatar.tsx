import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
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

function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={sizePx[size]}
        height={sizePx[size]}
        className={cn("rounded-full object-cover", sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-300",
        sizeMap[size],
        className
      )}
    >
      <User className="h-1/2 w-1/2" />
    </div>
  );
}

export { Avatar, type AvatarProps };
