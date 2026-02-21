"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDirection } from "@/providers/DirectionProvider";
import { formatKWD } from "@/lib/utils/format";
import { MapPin, Calendar, Users, Star } from "lucide-react";

interface CompareTrip {
  id: string;
  title: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  capacity: number;
  booked: number;
  rating?: number;
  campaignName?: string;
  coverImage?: string;
}

interface TripCompareModalProps {
  open: boolean;
  onClose: () => void;
  trips: CompareTrip[];
  onSelect?: (tripId: string) => void;
}

function TripCompareModal({ open, onClose, trips, onSelect }: TripCompareModalProps) {
  const { t } = useDirection();

  const rows: { labelAr: string; labelEn: string; icon: React.ReactNode; getValue: (trip: CompareTrip) => string }[] = [
    { labelAr: "الوجهة", labelEn: "Destination", icon: <MapPin className="h-4 w-4" />, getValue: (trip) => trip.destination },
    { labelAr: "المغادرة", labelEn: "Departure", icon: <Calendar className="h-4 w-4" />, getValue: (trip) => trip.departureDate },
    { labelAr: "العودة", labelEn: "Return", icon: <Calendar className="h-4 w-4" />, getValue: (trip) => trip.returnDate },
    { labelAr: "السعر", labelEn: "Price", icon: <Star className="h-4 w-4" />, getValue: (trip) => formatKWD(trip.price) },
    { labelAr: "السعة", labelEn: "Capacity", icon: <Users className="h-4 w-4" />, getValue: (trip) => `${trip.booked}/${trip.capacity}` },
    { labelAr: "التقييم", labelEn: "Rating", icon: <Star className="h-4 w-4" />, getValue: (trip) => trip.rating ? trip.rating.toFixed(1) : "\u2014" },
    { labelAr: "الحملة", labelEn: "Campaign", icon: <Users className="h-4 w-4" />, getValue: (trip) => trip.campaignName || "\u2014" },
  ];

  return (
    <Modal open={open} onClose={onClose} title={t("مقارنة الرحلات", "Compare Trips")} size="xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr>
              <th className="p-3 text-start text-body-sm font-medium text-slate-500 dark:text-slate-300/60" />
              {trips.map((trip) => (
                <th key={trip.id} className="p-3 text-center">
                  <p className="text-body-md font-bold text-slate-900 dark:text-white">{trip.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-slate-50/50 dark:bg-[#1E293B]/30" : ""}>
                <td className="p-3">
                  <span className="flex items-center gap-2 text-body-sm font-medium text-slate-600 dark:text-sky-200">
                    {row.icon}
                    {t(row.labelAr, row.labelEn)}
                  </span>
                </td>
                {trips.map((trip) => {
                  const value = row.getValue(trip);
                  const isBest = row.labelEn === "Price" && trip.price === Math.min(...trips.map((t) => t.price));
                  return (
                    <td key={trip.id} className="p-3 text-center">
                      <span className={isBest ? "font-bold text-sky-600 dark:text-sky-400" : "text-slate-800 dark:text-slate-100"}>
                        {value}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onSelect && (
        <div className="mt-4 flex justify-center gap-3">
          {trips.map((trip) => (
            <Button key={trip.id} variant="primary" size="sm" onClick={() => onSelect(trip.id)}>
              {t("اختر", "Select")} {trip.title}
            </Button>
          ))}
        </div>
      )}
    </Modal>
  );
}

export { TripCompareModal, type TripCompareModalProps, type CompareTrip };
