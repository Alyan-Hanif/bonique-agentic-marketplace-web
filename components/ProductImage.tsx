"use client";

import { useState } from "react";
import Image from "next/image";
import { imageFallback, productImageUrl } from "@/lib/product-images";

interface ProductImageProps {
  src: string;
  alt: string;
  productId?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ProductImage({
  src,
  alt,
  productId,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
}: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempt, setAttempt] = useState(0);

  const handleError = () => {
    if (attempt === 0 && productId) {
      setCurrentSrc(productImageUrl(productId));
      setAttempt(1);
    } else if (attempt <= 1) {
      setCurrentSrc(imageFallback);
      setAttempt(2);
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={handleError}
    />
  );
}
