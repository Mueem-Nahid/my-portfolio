"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { cx } from "@/lib/cx";
import type { ProjectImage } from "@/lib/content";

type ProjectGalleryProps = {
  images: ProjectImage[];
  title: string;
};

/**
 * Screenshot gallery for project detail pages. Mixed aspect ratios are
 * letterboxed onto a fixed 16/10 stage with an ambient blurred backdrop, so
 * phone-tall and desktop-wide shots sit in the same frame without cropping.
 * Nav: arrows, thumbnail filmstrip, ←/→ keys, and touch swipe.
 */
export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const current = images[index];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  };

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      className="not-prose"
    >
      {/* Stage */}
      <div
        className="group/gallery relative aspect-[4/3] touch-pan-y overscroll-contain overflow-hidden rounded-xl border border-line bg-canvas sm:aspect-[16/10]"
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Screenshot viewer, use arrow keys to navigate"
      >
        {/* Ambient backdrop — the same image, blurred, fills the letterbox gaps.
            Requested tiny on purpose: the blur hides the low resolution. */}
        <Image
          key={`bg-${current.src}`}
          src={current.src}
          alt=""
          aria-hidden="true"
          fill
          sizes="128px"
          className="scale-125 object-cover opacity-25 blur-2xl"
        />
        {/* The screenshot itself — never cropped */}
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes={stageSizes(current)}
          className="object-contain"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
        />

        {count > 1 ? (
          <>
            <GalleryButton
              side="left"
              label="Previous screenshot"
              onClick={() => go(index - 1)}
            />
            <GalleryButton
              side="right"
              label="Next screenshot"
              onClick={() => go(index + 1)}
            />
            <span className="glass absolute right-3 bottom-3 rounded-md px-2 py-0.5 font-mono text-xs text-muted tabular-nums">
              {index + 1} / {count}
            </span>
          </>
        ) : null}

        {/* Touch swipe */}
        <div
          className="absolute inset-0 sm:hidden"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
            touchStartX.current = null;
          }}
          aria-hidden="true"
        />
      </div>

      {/* Thumbnail filmstrip */}
      {count > 1 ? (
        <div
          className="mt-3 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Choose screenshot"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              role="tab"
              aria-selected={i === index}
              aria-label={`Screenshot ${i + 1}`}
              onClick={() => go(i)}
              className={cx(
                "relative h-14 w-24 shrink-0 overflow-hidden rounded-md border transition-colors",
                i === index
                  ? "border-warm"
                  : "border-line opacity-55 hover:opacity-90",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {`Showing screenshot ${index + 1} of ${count}: ${current.alt}`}
      </p>
    </div>
  );
}

/**
 * How much resolution the stage actually needs for this image. A 16:10 stage
 * shows a landscape shot at full width, but a tall phone shot (or an ultra-tall
 * full-page capture) is letterboxed to a sliver — so a small variant is plenty.
 * Stage widths: ~342px on phones (4:3), ~1104px in the 6xl container (16:10).
 */
function stageSizes(image: ProjectImage): string {
  if (!image.width || !image.height) return "(max-width: 640px) 342px, 1104px";
  const aspect = image.width / image.height;
  const mobile = Math.max(64, Math.round(342 * Math.min(1, aspect / (4 / 3))));
  const desktop = Math.max(64, Math.round(1104 * Math.min(1, aspect / (16 / 10))));
  return `(max-width: 640px) ${mobile}px, ${desktop}px`;
}

function GalleryButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cx(
        "glass absolute top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-ink transition-opacity",
        "opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100",
        "max-sm:opacity-80",
        side === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon icon={side === "left" ? ChevronLeft : ChevronRight} size={18} />
    </button>
  );
}
