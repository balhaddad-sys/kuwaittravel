import { cn } from "@/lib/utils/cn";
import { formatKWD } from "@/lib/utils/format";

interface PriceDisplayProps {
  amount: number;
  originalAmount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-body-md",
  md: "text-heading-md",
  lg: "text-display-md",
};

function PriceDisplay({ amount, originalAmount, size = "md", className }: PriceDisplayProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn(sizeMap[size], "font-bold text-gray-900 dark:text-white")}>
        {formatKWD(amount)}
      </span>
      {originalAmount && originalAmount > amount && (
        <span className="text-body-sm text-gray-400 line-through">
          {formatKWD(originalAmount)}
        </span>
      )}
    </div>
  );
}

export { PriceDisplay, type PriceDisplayProps };
