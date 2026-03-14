"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ProductImage = {
  id?: string;
  url: string;
};

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const safeImages = useMemo(() => images ?? [], [images]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = safeImages[selectedIndex]?.url;

  if (!safeImages.length) {
    return (
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="flex aspect-square items-center justify-center bg-zinc-100 text-sm text-zinc-400">
          No Image Available
        </div>
      </div>
    );
  }

  function goToPrev() {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }

  function goToNext() {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="space-y-4">
      <div className="group relative overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-zinc-100">
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur">
          {selectedIndex + 1} / {safeImages.length}
        </div>

        <div className="relative aspect-[1/1] overflow-hidden bg-zinc-50">
          <Image
            key={selectedImage}
            src={selectedImage}
            alt="Product image"
            fill
            priority
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-zinc-700 shadow-sm backdrop-blur transition hover:bg-white"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((image, index) => {
            const isActive = index === selectedIndex;

            return (
              <button
                key={image.id ?? `${image.url}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`group relative overflow-hidden rounded-2xl bg-white transition duration-300 ${
                  isActive
                    ? "ring-2 ring-pink-400 shadow-md"
                    : "ring-1 ring-zinc-200 hover:-translate-y-0.5 hover:shadow-sm"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-50">
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                {isActive && (
                  <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-pink-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
