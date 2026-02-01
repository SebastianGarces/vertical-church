"use client";

import { useState } from "react";
import Image from "next/image";
import { VerticalShieldLogo } from "@/app/components/icons";

interface SermonThumbnailProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

function Placeholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-full w-full items-center justify-center bg-yuma ${className}`}>
      <VerticalShieldLogo className="h-12 w-12 text-sand" />
    </div>
  );
}

export function SermonThumbnail({
  src,
  alt,
  className = "",
  priority = false,
}: SermonThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Placeholder className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`object-cover ${className}`}
      priority={priority}
      onError={() => setHasError(true)}
    />
  );
}
