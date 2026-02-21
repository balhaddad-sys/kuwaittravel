"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useDirection } from "@/providers/DirectionProvider";
import { cn } from "@/lib/utils/cn";
import { Star, Camera, X } from "lucide-react";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; title: string; body: string; photos: File[] }) => void;
  loading?: boolean;
  className?: string;
}

function ReviewForm({ onSubmit, loading = false, className }: ReviewFormProps) {
  const { t } = useDirection();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const photoPreviews = useMemo(
    () => photos.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [photos]
  );

  useEffect(() => {
    return () => {
      photoPreviews.forEach(({ url }) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [photoPreviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, title, body, photos });
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      {/* Star Rating */}
      <div>
        <label className="text-body-md font-semibold text-slate-800 dark:text-white">
          {t("تقييمك", "Your Rating")}
        </label>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  (hoverRating || rating) > i
                    ? "fill-orange-400 text-orange-400"
                    : "fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-sky-400/50"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-body-sm font-medium text-slate-600 dark:text-sky-200">
          {t("العنوان", "Title")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("اكتب عنواناً لتقييمك", "Write a title for your review")}
          className="mt-1 w-full rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2.5 text-body-md text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-300/40"
        />
      </div>

      {/* Body */}
      <div>
        <label className="text-body-sm font-medium text-slate-600 dark:text-sky-200">
          {t("التفاصيل", "Details")}
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder={t("شاركنا تجربتك", "Share your experience")}
          className="mt-1 w-full rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2.5 text-body-md text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-[#2D3B4F] dark:bg-[#1E293B] dark:text-white dark:placeholder:text-slate-300/40"
        />
      </div>

      {/* Photos */}
      <div>
        <label className="text-body-sm font-medium text-slate-600 dark:text-sky-200">
          {t("صور (اختياري)", "Photos (optional)")}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {photoPreviews.map(({ url }, i) => (
            <div key={i} className="relative h-16 w-16 rounded-lg bg-slate-100 dark:bg-[#1E293B]">
              <Image
                src={url}
                alt={t("صورة مرفقة", "Uploaded photo")}
                fill
                sizes="64px"
                className="rounded-lg object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -end-1 -top-1 rounded-full bg-red-500 p-0.5 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <label className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-sky-400 hover:text-sky-500 dark:border-slate-600 dark:hover:border-sky-500">
              <Camera className="h-5 w-5" />
              <input type="file" accept="image/*" onChange={handlePhotoAdd} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading} disabled={rating === 0}>
        {t("إرسال التقييم", "Submit Review")}
      </Button>
    </form>
  );
}

export { ReviewForm, type ReviewFormProps };
