import React, { useState, useEffect, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { Team } from '../types';

interface PresenterImageProps {
  src?: string;
  images?: string[];
  alt: string;
  presentationNumber: string;
  trackId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  team?: Team;
  isTutorialOpen?: boolean;
}

export function PresenterImage({
  src,
  images,
  alt,
  presentationNumber,
  className = '',
  size = 'md',
  team,
  isTutorialOpen = false,
}: PresenterImageProps) {
  // Determine image sources array
  const imgList =
    images && images.length > 0
      ? images
      : team?.images && team.images.length > 0
      ? team.images
      : src
      ? [src]
      : team?.image
      ? [team.image]
      : ['/images/default-profile.png'];

  const isTwoImages = imgList.length >= 2;

  const frontSrc = imgList[0];
  const backSrc = isTwoImages ? imgList[1] : null;

  const [isFlipped, setIsFlipped] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const [frontImageError, setFrontImageError] = useState(false);
  const [backImageError, setBackImageError] = useState(false);
  const [frontLoaded, setFrontLoaded] = useState(false);
  const [backLoaded, setBackLoaded] = useState(false);

  // Auto flip timer for 01~03 (two images)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isManual || !isTwoImages || isTutorialOpen) {
      return;
    }

    // Staggered initial delay based on presentationNumber (01->0s, 02->2.5s, 03->5s)
    const numVal = parseInt(presentationNumber, 10) || 1;
    const initialDelay = Math.max(0, (numVal - 1) * 2500);

    const initialTimeout = setTimeout(() => {
      setIsFlipped((prev) => !prev);

      // Subsequent flips every 9 seconds
      const interval = setInterval(() => {
        setIsFlipped((prev) => !prev);
      }, 9000);

      timerRef.current = interval;
    }, initialDelay + 4000);

    return () => {
      clearTimeout(initialTimeout);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTwoImages, isManual, presentationNumber]);

  // Dimensions & sizes: strictly 1:1 aspect ratio
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 sm:w-20 sm:h-20 text-sm',
    lg: 'w-24 h-24 text-base',
  }[size];

  // Program captions for 01~03
  const frontCaption = team?.subPrograms?.[0]?.title || (isTwoImages ? '프로그램 1' : null);
  const backCaption = team?.subPrograms?.[1]?.title || (isTwoImages ? '프로그램 2' : null);

  const handleFlipToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Never trigger parent card click or vote button
    setIsFlipped((prev) => !prev);
    setIsManual(true);
  };

  return (
    <div
      className={`relative shrink-0 aspect-square rounded-xl cursor-pointer select-none group ${sizeClasses} ${className}`}
      style={{ perspective: '600px' }}
      onClick={handleFlipToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          setIsFlipped((prev) => !prev);
          setIsManual(true);
        }
      }}
      title={
        isTwoImages
          ? `터치하여 사진 전환 (${isFlipped ? '2/2' : '1/2'})`
          : `터치하여 정보 뒤집기`
      }
    >
      {/* Flipping Container */}
      <div
        className="relative w-full h-full rounded-xl"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-[#F3F8FD] border border-[#D9E5F1] shadow-2xs"
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Number badge */}
          <div className="absolute top-1 left-1 z-20 px-1.5 py-0.5 rounded bg-[#0A2E6D]/85 backdrop-blur-xs text-[8.5px] sm:text-[9.5px] font-mono font-bold text-white leading-none shadow-2xs">
            {presentationNumber}
          </div>

          {!frontLoaded && !frontImageError && (
            <div className="absolute inset-0 bg-[#F3F8FD] animate-pulse flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#66758A]">NO.{presentationNumber}</span>
            </div>
          )}

          {!frontImageError ? (
            <img
              src={frontSrc}
              alt={`${alt} 1`}
              referrerPolicy="no-referrer"
              loading="lazy"
              onLoad={() => setFrontLoaded(true)}
              onError={() => setFrontImageError(true)}
              className={`w-full h-full aspect-square object-cover object-center transition-opacity duration-200 ${
                frontLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#0A2E6D] to-[#1268C4] flex items-center justify-center text-white text-xs font-bold">
              NO.{presentationNumber}
            </div>
          )}

          {/* Front Bottom Overlay: Indicator & Caption */}
          {isTwoImages ? (
            <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-3 pb-1 px-1 text-center pointer-events-none">
              {frontCaption && (
                <p className="text-[7.5px] sm:text-[8.5px] font-extrabold text-white truncate drop-shadow-xs tracking-tight">
                  {frontCaption}
                </p>
              )}
              <div className="flex items-center justify-center gap-1 mt-0.5 text-[8px] text-white/90">
                <span className="text-white font-bold">●</span>
                <span className="text-white/40">○</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-1 right-1 z-10 p-0.5 rounded-full bg-[#0A2E6D]/80 text-white backdrop-blur-xs shadow-2xs">
              <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#DCEEFF]" />
            </div>
          )}
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-2xs"
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {isTwoImages && backSrc ? (
            /* Back Face for Two Images (01 ~ 03) */
            <div className="relative w-full h-full bg-[#F3F8FD] border border-[#D9E5F1]">
              <div className="absolute top-1 left-1 z-20 px-1.5 py-0.5 rounded bg-[#0A2E6D]/85 backdrop-blur-xs text-[8.5px] sm:text-[9.5px] font-mono font-bold text-white leading-none shadow-2xs">
                {presentationNumber}
              </div>

              {!backLoaded && !backImageError && (
                <div className="absolute inset-0 bg-[#F3F8FD] animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#66758A]">NO.{presentationNumber}</span>
                </div>
              )}

              {!backImageError ? (
                <img
                  src={backSrc}
                  alt={`${alt} 2`}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onLoad={() => setBackLoaded(true)}
                  onError={() => setBackImageError(true)}
                  className={`w-full h-full aspect-square object-cover object-center transition-opacity duration-200 ${
                    backLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0A2E6D] to-[#1268C4] flex items-center justify-center text-white text-xs font-bold">
                  NO.{presentationNumber}
                </div>
              )}

              <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-3 pb-1 px-1 text-center pointer-events-none">
                {backCaption && (
                  <p className="text-[7.5px] sm:text-[8.5px] font-extrabold text-white truncate drop-shadow-xs tracking-tight">
                    {backCaption}
                  </p>
                )}
                <div className="flex items-center justify-center gap-1 mt-0.5 text-[8px] text-white/90">
                  <span className="text-white/40">○</span>
                  <span className="text-white font-bold">●</span>
                </div>
              </div>
            </div>
          ) : (
            /* Back Face for Single Image (04 ~ 11): Info Card */
            <div className="relative w-full h-full bg-gradient-to-br from-[#0A2E6D] via-[#0D3882] to-[#1268C4] border border-[#1268C4]/50 p-2 flex flex-col justify-between text-white overflow-hidden">
              <div className="absolute top-1 left-1 z-20 px-1 py-0.2 rounded bg-white/20 backdrop-blur-xs text-[8px] sm:text-[9px] font-mono font-bold text-white leading-none">
                NO.{presentationNumber}
              </div>

              <div className="mt-3.5 flex-1 flex flex-col justify-center text-center px-0.5 min-w-0">
                <h5 className="text-[10px] sm:text-xs font-black text-white leading-tight tracking-tight truncate">
                  {team?.title || alt}
                </h5>
                <p className="text-[8.5px] sm:text-[9.5px] text-blue-100/90 leading-tight mt-1 line-clamp-2 font-medium">
                  {team?.subtitle || team?.department}
                </p>
              </div>

              <div className="absolute bottom-1 right-1 z-10 p-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs shadow-2xs">
                <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
