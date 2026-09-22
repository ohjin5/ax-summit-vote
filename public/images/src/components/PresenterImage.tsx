import React, { useState, useEffect } from 'react';

interface PresenterImageProps {
  src?: string;
  alt: string;
  presentationNumber: string;
  trackId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PresenterImage({
  src,
  alt,
  presentationNumber,
  trackId,
  className = '',
  size = 'md',
}: PresenterImageProps) {
  const initialSrc = src || '/images/default-profile.png';
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasTriedDefault, setHasTriedDefault] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const nextSrc = src || '/images/default-profile.png';
    setCurrentSrc(nextSrc);
    setHasTriedDefault(false);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Dimensions & sizes: strictly 1:1 aspect ratio
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-sm',
    lg: 'w-24 h-24 text-base',
  }[size];

  const handleImageError = () => {
    if (!hasTriedDefault && currentSrc !== '/images/default-profile.png') {
      // Step 1: Automatic fallback to public/images/default-profile.png
      setHasTriedDefault(true);
      setCurrentSrc('/images/default-profile.png');
    } else {
      // Step 2: If default-profile.png is missing or fails, use geometric placeholder (never show broken icon)
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`relative shrink-0 aspect-square rounded-xl bg-gradient-to-br from-[#0A2E6D] via-[#0D3882] to-[#1268C4] flex flex-col items-center justify-center border border-[#1268C4]/30 shadow-2xs overflow-hidden ${sizeClasses} ${className}`}
        title={`${alt} (은평 AX SUMMIT 2026)`}
      >
        {/* Subtle geometric light pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
        >
          <line x1="0" y1="20" x2="100" y2="80" stroke="#DCEEFF" strokeWidth="1" />
          <line x1="20" y1="0" x2="80" y2="100" stroke="#2C8CE6" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" stroke="#DCEEFF" strokeWidth="0.8" />
        </svg>

        <span className="relative z-10 text-[9px] font-mono font-bold tracking-widest text-[#DCEEFF] uppercase">
          NO.
        </span>
        <span className="relative z-10 text-lg sm:text-xl font-black tracking-tight text-white leading-none">
          {presentationNumber}
        </span>
        <span className="relative z-10 text-[8px] font-bold text-[#2C8CE6] mt-0.5 tracking-tighter">
          AX SUMMIT
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 aspect-square rounded-xl overflow-hidden bg-[#F3F8FD] border border-[#D9E5F1] shadow-2xs ${sizeClasses} ${className}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F3F8FD] animate-pulse flex items-center justify-center">
          <span className="text-[10px] font-bold text-[#66758A]">NO.{presentationNumber}</span>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        className={`w-full h-full aspect-square object-cover object-center transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Presentation number badge */}
      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#0A2E6D]/85 backdrop-blur-xs text-[9px] font-mono font-bold text-white leading-none">
        {presentationNumber}
      </div>
    </div>
  );
}
