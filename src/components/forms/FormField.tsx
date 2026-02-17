import { cn } from "@/lib/utils/cn";

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, error, hint, required, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-label font-medium text-stone-700 dark:text-stone-200">
          {label}
          {required && <span className="text-error ms-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-body-sm text-error">{error}</p>}
      {hint && !error && <p className="text-body-sm text-stone-400">{hint}</p>}
    </div>
  );
}

export { FormField, type FormFieldProps };
