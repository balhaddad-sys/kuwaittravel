"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Modal } from "@/components/ui/Modal";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
  aspectRatio?: "16/9" | "4/3" | "3/2" | "1/1";
  className?: string;
  overlay?: React.ReactNode;
}

function ImageGallery({ images, alt, aspectRatio = "16/9", className, overlay }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
    setActiveIndex(index);
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  const aspectClass =
    aspectRatio === "16/9" ? "aspect-[16/9]" :
    aspectRatio === "4/3" ? "aspect-[4/3]" :
    aspectRatio === "3/2" ? "aspect-[3/2]" :
    "aspect-square";

  return (
    <>
      <div className={cn("relative overflow-hidden bg-slate-100 dark:bg-[#1E293B]", aspectClass, className)}>
        {/* Scrollable image strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
        >
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className="relative h-full w-full flex-shrink-0 snap-start"
              onClick={() => { setActiveIndex(i); setLightboxOpen(true); }}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 900px"
                priority={i === 0}
              />
            </button>
          ))}
        </div>

        {/* Overlay content (back button, wishlist, etc.) */}
        {overlay}

        {/* Navigation arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); scrollToIndex(Math.max(0, activeIndex - 1)); }}
              className={cn(
                "absolute start-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-md transition-opacity hover:bg-white sm:flex",
                activeIndex === 0 && "pointer-events-none opacity-0"
              )}
            >
              <ChevronLeft className="h-4 w-4 text-slate-800 rtl:rotate-180" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); scrollToIndex(Math.min(images.length - 1, activeIndex + 1)); }}
              className={cn(
                "absolute end-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-1.5 shadow-md transition-opacity hover:bg-white sm:flex",
                activeIndex === images.length - 1 && "pointer-events-none opacity-0"
              )}
            >
              <ChevronRight className="h-4 w-4 text-slate-800 rtl:rotate-180" />
            </button>
          </>
        )}

        {/* Photo counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 end-3 z-10 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            {activeIndex + 1}/{images.length}
          </div>
        )}

        {/* Dot indicators */}
        {images.length > 1 && images.length <= 8 && (
          <div className="absolute bottom-3 start-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); scrollToIndex(i); }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} size="xl" className="!max-w-4xl !p-0 !bg-black/95">
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute end-3 top-3 z-20 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={images[activeIndex]}
              alt={`${alt} ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 py-3">
              <button
                type="button"
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <span className="text-body-sm text-white/70">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveIndex(Math.min(images.length - 1, activeIndex + 1))}
                disabled={activeIndex === images.length - 1}
                className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

export { ImageGallery, type ImageGalleryProps };
