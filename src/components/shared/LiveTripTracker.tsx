"use client";

import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { CheckCircle2, Clock } from "lucide-react";

type TripPhase = "not_started" | "departing" | "in_destination" | "returning" | "completed";

interface TrackerStep {
  labelAr: string;
  labelEn: string;
  date?: string;
  location?: string;
}

interface LiveTripTrackerProps {
  currentPhase: TripPhase;
  steps: TrackerStep[];
  className?: string;
}

const phaseIndex: Record<TripPhase, number> = {
  not_started: -1,
  departing: 0,
  in_destination: 1,
  returning: 2,
  completed: 3,
};

function LiveTripTracker({ currentPhase, steps, className }: LiveTripTrackerProps) {
  const { t } = useDirection();
  const activeIdx = phaseIndex[currentPhase];

  return (
    <div className={cn("space-y-1", className)}>
      {/* Phase label */}
      <div className="mb-3 flex items-center gap-2">
        {currentPhase !== "completed" && currentPhase !== "not_started" && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
          </span>
        )}
        <span className="text-body-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {currentPhase === "not_started" && t("لم تبدأ بعد", "Not Started")}
          {currentPhase === "departing" && t("في طريق المغادرة", "Departing")}
          {currentPhase === "in_destination" && t("في الوجهة", "At Destination")}
          {currentPhase === "returning" && t("في طريق العودة", "Returning")}
          {currentPhase === "completed" && t("اكتملت", "Completed")}
        </span>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isDone = i <= activeIdx;
          const isCurrent = i === activeIdx;

          return (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isDone
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-gray-200 bg-white text-gray-400 dark:border-[#1A2D48] dark:bg-indigo-800",
                    isCurrent && "ring-4 ring-indigo-500/20"
                  )}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <p className={cn("mt-1.5 text-center text-[11px] font-medium", isDone ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400")}>
                  {t(step.labelAr, step.labelEn)}
                </p>
                {step.date && (
                  <p className="text-[10px] text-gray-400">{step.date}</p>
                )}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("mx-1 h-0.5 flex-1", isDone ? "bg-indigo-500" : "bg-gray-200 dark:bg-indigo-700/40")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { LiveTripTracker, type LiveTripTrackerProps, type TripPhase, type TrackerStep };
