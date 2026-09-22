import React from 'react';
import { TrackInfo } from '../types';

interface TrackHeaderProps {
  track: TrackInfo;
  teamCount: number;
}

export function TrackHeader({ track, teamCount }: TrackHeaderProps) {
  const rangeStr =
    track.id === 'special'
      ? '01 ~ 03'
      : track.id === 'main1'
      ? '04 ~ 06'
      : '07 ~ 11';

  return (
    <div id={`track-${track.id}`} className="pt-6 pb-2 scroll-mt-28">
      {/* AX SUMMIT Light Blue Header Container with Navy Text */}
      <div className="bg-[#F3F8FD] border border-[#D9E5F1] rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wide bg-[#DCEEFF] text-[#0A2E6D] border border-[#D9E5F1]/80">
            {track.badge}
          </span>
          <span className="text-[11px] font-bold text-[#66758A] bg-white px-2.5 py-0.5 rounded-full border border-[#D9E5F1]">
            {rangeStr} · 총 {teamCount}개 발표
          </span>
        </div>

        {/* Navy Track Title */}
        <h3 className="text-base sm:text-lg font-black tracking-tight text-[#0A2E6D] leading-snug">
          {track.title}
        </h3>

        {/* Subtitle if available */}
        {track.subtitle && (
          <p className="text-xs text-[#66758A] mt-0.5 font-medium">
            {track.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
