"use client";

import Image from "next/image";

type Props = {
  images: string[];
};

const COLS = 9;
const ROWS = 9;
const CELL = 72;
const GAP = 3;

export function ArtGridPreview({ images }: Props) {
  if (!images.length) return null;

  const total = COLS * ROWS;
  const cells = Array.from({ length: total }, (_, i) => images[i % images.length]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 52% 52% at 50% 50%, black 0%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 52% 52% at 50% 50%, black 0%, transparent 100%)",
      }}
    >
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
          gap: `${GAP}px`,
          transform: "translate(-50%, -50%) rotate(45deg)",
        }}
      >
        {cells.map((src, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={src}
              alt=""
              fill
              sizes={`${CELL}px`}
              className="object-cover opacity-50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
