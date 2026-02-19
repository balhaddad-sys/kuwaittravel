"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { SlidersHorizontal } from "lucide-react";
import type { TripType } from "@/types/common";

export interface TripFilterState {
  tripType: TripType | null;
  priceMin: number | null;
  priceMax: number | null;
  destinations: string[];
  searchQuery: string;
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: TripFilterState;
  onApply: (filters: TripFilterState) => void;
  availableDestinations?: string[];
}

const TRIP_TYPES: { id: TripType; labelAr: string; labelEn: string }[] = [
  { id: "hajj", labelAr: "حج", labelEn: "Hajj" },
  { id: "umrah", labelAr: "عمرة", labelEn: "Umrah" },
  { id: "ziyarat", labelAr: "زيارة", labelEn: "Ziyarat" },
  { id: "combined", labelAr: "مشترك", labelEn: "Combined" },
];

const PRICE_RANGES = [
  { min: 0, max: 100, labelAr: "أقل من 100 د.ك", labelEn: "Under 100 KWD" },
  { min: 100, max: 300, labelAr: "100 - 300 د.ك", labelEn: "100 - 300 KWD" },
  { min: 300, max: 500, labelAr: "300 - 500 د.ك", labelEn: "300 - 500 KWD" },
  { min: 500, max: null, labelAr: "أكثر من 500 د.ك", labelEn: "500+ KWD" },
];

function FilterSheet({ open, onClose, filters, onApply, availableDestinations = [] }: FilterSheetProps) {
  const { t } = useDirection();
  const [draft, setDraft] = useState<TripFilterState>(filters);

  const handleOpen = useCallback(() => {
    setDraft(filters);
  }, [filters]);

  // Sync draft with filters when modal opens
  if (open && draft !== filters && draft.tripType === filters.tripType) {
    handleOpen();
  }

  const handleTypeSelect = (type: TripType) => {
    setDraft((prev) => ({
      ...prev,
      tripType: prev.tripType === type ? null : type,
    }));
  };

  const handlePriceSelect = (min: number, max: number | null) => {
    setDraft((prev) => {
      if (prev.priceMin === min && prev.priceMax === max) {
        return { ...prev, priceMin: null, priceMax: null };
      }
      return { ...prev, priceMin: min, priceMax: max };
    });
  };

  const handleDestinationToggle = (dest: string) => {
    setDraft((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter((d) => d !== dest)
        : [...prev.destinations, dest],
    }));
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    const reset: TripFilterState = {
      tripType: null,
      priceMin: null,
      priceMax: null,
      destinations: [],
      searchQuery: filters.searchQuery,
    };
    setDraft(reset);
    onApply(reset);
    onClose();
  };

  const activeFilterCount = [
    draft.tripType,
    draft.priceMin !== null || draft.priceMax !== null,
    draft.destinations.length > 0,
  ].filter(Boolean).length;

  return (
    <Modal open={open} onClose={onClose} title={t("فلترة الرحلات", "Filter Trips")} size="lg">
      <div className="space-y-6">
        {/* Trip Type */}
        <div>
          <h4 className="mb-2.5 text-body-md font-semibold text-gray-800 dark:text-white">
            {t("نوع الرحلة", "Trip Type")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {TRIP_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type.id)}
                className={cn(
                  "rounded-[var(--radius-pill)] px-4 py-2 text-body-sm font-medium transition-all duration-200",
                  draft.tripType === type.id
                    ? "travel-filter-chip-active"
                    : "travel-filter-chip"
                )}
              >
                {t(type.labelAr, type.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="mb-2.5 text-body-md font-semibold text-gray-800 dark:text-white">
            {t("نطاق السعر", "Price Range")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => (
              <button
                key={`${range.min}-${range.max}`}
                type="button"
                onClick={() => handlePriceSelect(range.min, range.max)}
                className={cn(
                  "rounded-[var(--radius-pill)] px-4 py-2 text-body-sm font-medium transition-all duration-200",
                  draft.priceMin === range.min && draft.priceMax === range.max
                    ? "travel-filter-chip-active"
                    : "travel-filter-chip"
                )}
              >
                {t(range.labelAr, range.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations */}
        {availableDestinations.length > 0 && (
          <div>
            <h4 className="mb-2.5 text-body-md font-semibold text-gray-800 dark:text-white">
              {t("الوجهات", "Destinations")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {availableDestinations.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => handleDestinationToggle(dest)}
                  className={cn(
                    "rounded-[var(--radius-pill)] px-4 py-2 text-body-sm font-medium transition-all duration-200",
                    draft.destinations.includes(dest)
                      ? "travel-filter-chip-active"
                      : "travel-filter-chip"
                  )}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-surface-border pt-4 dark:border-surface-dark-border">
        <button
          type="button"
          onClick={handleReset}
          className="text-body-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
        >
          {t("إعادة تعيين", "Reset All")}
        </button>
        <Button variant="primary" onClick={handleApply}>
          <SlidersHorizontal className="me-1.5 h-4 w-4" />
          {t("تطبيق", "Apply")}
          {activeFilterCount > 0 && (
            <span className="ms-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>
    </Modal>
  );
}

export { FilterSheet, type FilterSheetProps };
