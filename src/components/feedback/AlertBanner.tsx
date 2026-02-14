import { cn } from "@/lib/utils/cn";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

interface AlertBannerProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  className?: string;
}

const config = {
  success: { icon: CheckCircle2, bg: "bg-success-light", border: "border-success", text: "text-green-800" },
  error: { icon: XCircle, bg: "bg-error-light", border: "border-error", text: "text-red-800" },
  warning: { icon: AlertTriangle, bg: "bg-warning-light", border: "border-warning", text: "text-amber-800" },
  info: { icon: Info, bg: "bg-info-light", border: "border-info", text: "text-blue-800" },
};

function AlertBanner({ type, title, description, className }: AlertBannerProps) {
  const { icon: Icon, bg, border, text } = config[type];
  return (
    <div className={cn("flex items-start gap-3 rounded-[var(--radius-lg)] border p-4", bg, border, text, className)}>
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <p className="text-body-md font-medium">{title}</p>
        {description && <p className="mt-1 text-body-sm opacity-80">{description}</p>}
      </div>
    </div>
  );
}

export { AlertBanner, type AlertBannerProps };
