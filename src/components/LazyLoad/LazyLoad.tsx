"use client";

import { useEffect, useState } from "react";

const placeHolder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII=";

type LazyImageProps = {
  src: string;
  alt?: string;
  className?: string;
  imageLoadedCallback?: () => void;
};

export default function LazyImage({
  src,
  alt,
  className,
  imageLoadedCallback,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeHolder);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const onLoad = () => {
    setImgLoaded(true);
    imageLoadedCallback?.();
  };

  const onError = () => {
    setImageSrc(placeHolder);
  };

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let didCancel = false;

    if (imageRef && imageSrc !== src) {
      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src);
                observer?.unobserve(imageRef);
              }
            });
          },
          {
            threshold: 1,
            rootMargin: "75%",
          }
        );
        observer.observe(imageRef);
      } else {
        setImageSrc(src);
      }
    }

    return () => {
      didCancel = true;
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
      className={[
        "transition-opacity duration-1000",
        imgLoaded ? "opacity-100" : "opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
