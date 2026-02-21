"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

interface Step {
  label: string;
  content: React.ReactNode;
  isValid?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: () => void;
  onStepChange?: (step: number) => void;
  completeLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
  loading?: boolean;
  className?: string;
}

function MultiStepForm({
  steps,
  onComplete,
  onStepChange,
  completeLabel = "حفظ",
  nextLabel = "التالي",
  prevLabel = "السابق",
  loading = false,
  className,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      goToStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Step Indicator + Labels */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => i < currentStep && goToStep(i)}
                className={cn(
                  "flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-body-sm font-bold transition-all duration-200",
                  i < currentStep
                    ? "bg-success text-white cursor-pointer"
                    : i === currentStep
                    ? "bg-orange-500 text-white"
                    : "bg-surface-muted text-slate-400 dark:bg-surface-dark-card"
                )}
              >
                {i < currentStep ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : i + 1}
              </button>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-5 sm:w-12 rounded-full transition-all duration-200",
                    i < currentStep ? "bg-success" : "bg-surface-border dark:bg-surface-dark-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        {/* Current step label (mobile), all labels (desktop) */}
        <div className="mt-3 sm:hidden text-center">
          <span className="text-body-sm font-medium text-slate-700 dark:text-white">
            {steps[currentStep].label}
          </span>
          <span className="text-body-sm text-slate-400 ms-1.5">
            ({currentStep + 1}/{steps.length})
          </span>
        </div>
        <div className="hidden sm:flex justify-between mt-4 px-2">
          {steps.map((step, i) => (
            <span
              key={i}
              className={cn(
                "text-body-sm text-center flex-1",
                i === currentStep ? "text-slate-700 dark:text-white font-medium" : "text-slate-400"
              )}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {steps[currentStep].content}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-surface-border dark:border-surface-dark-border">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex-1 sm:flex-none"
        >
          {prevLabel}
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
          loading={currentStep === steps.length - 1 && loading}
          disabled={steps[currentStep].isValid === false}
          className="flex-1 sm:flex-none"
        >
          {currentStep === steps.length - 1 ? completeLabel : nextLabel}
        </Button>
      </div>
    </div>
  );
}

export { MultiStepForm, type MultiStepFormProps, type Step };
