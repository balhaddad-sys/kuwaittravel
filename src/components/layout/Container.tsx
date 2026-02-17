import { cn } from "@/lib/utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

function Container({ children, className, size = "xl" }: ContainerProps) {
  return (
    <div className={cn("mx-auto flex-1 w-full px-4 sm:px-6 lg:px-8", sizeMap[size], className)}>
      {children}
    </div>
  );
}

export { Container, type ContainerProps };
