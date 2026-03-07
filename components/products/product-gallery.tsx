"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images }: { images: { url: string }[] }) {
  const [selected, setSelected] = useState(images?.[0]?.url);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[2rem] bg-zinc-100 text-sm text-zinc-400">
        No Image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-zinc-100">
        <Image src={selected} alt="Product" fill className="object-cover" />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {images.map((img) => (
          <button
            key={img.url}
            onClick={() => setSelected(img.url)}
            className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
              selected === img.url
                ? "border-pink-500 ring-2 ring-pink-200"
                : "border-zinc-200"
            }`}
          >
            <Image
              src={img.url}
              alt="Thumbnail"
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
