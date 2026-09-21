import React, { useState } from 'react';
import { ShieldCheck, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, isAdmin }) => {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="relative bg-[#0A2E6D] text-white overflow-hidden border-b border-[#1268C4]/40 shadow-sm">
      {/* Abstract Futuristic AI Glow & Curved Light Wave Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2E6D] via-[#0D3882] to-[#1268C4] opacity-95" />
        
        {/* Curved luminous light beams (SVG) */}
        <svg
          className="absolute -right-10 -bottom-10 w-96 h-56 text-[#2C8CE6] opacity-25"
          viewBox="0 0 400 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-50 200 C 100 220, 200 120, 450 60"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <path
            d="M-30 230 C 140 240, 260 100, 430 20"
            stroke="url(#beamGrad)"
            strokeWidth="4"
          />
          <path
            d="M20 260 C 180 220, 310 70, 460 -10"
            stroke="#DCEEFF"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <defs>
            <linearGradient id="beamGrad" x1="0" y1="200" x2="400" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1268C4" stopOpacity="0" />
              <stop offset="0.5" stopColor="#2C8CE6" />
              <stop offset="1" stopColor="#DCEEFF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-36 bg-[#2C8CE6]/20 rounded-full blur-3xl" />
      </div>

      {/* Top Utility Bar */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-3.5 pb-2 sm:px-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Hospital Logo Image with Error Fallback */}
          {!logoError ? (
            <img
              src="/images/logo.png"
              alt="가톨릭대학교 은평성모병원"
              onError={() => setLogoError(true)}
              className="h-6 sm:h-7 w-auto object-contain max-w-[160px] sm:max-w-[200px]"
            />
          ) : (
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-blue-100/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C8CE6]" />
              가톨릭대학교 은평성모병원
            </span>
          )}
        </div>

        <button
          id="btn-toggle-admin"
          type="button"
          onClick={onOpenAdmin}
          className="px-2.5 py-1 rounded-lg text-blue-100 hover:text-white bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-[11px] sm:text-xs flex items-center gap-1.5 border border-white/20 cursor-pointer"
          title="관리자 페이지"
        >
          {isAdmin ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <Settings className="w-3.5 h-3.5 text-blue-200" />
          )}
          <span className="font-medium">
            {isAdmin ? '관리자 모드' : '관리자'}
          </span>
        </button>
      </div>

      {/* Compact Official Hero Block */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-4 sm:px-6">
        <div className="flex flex-col items-start">
          {/* Main Title Block */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              은평
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              AX SUMMIT
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#2C8CE6]">
              2026
            </span>
          </div>

          {/* Slogan */}
          <p className="text-xs sm:text-sm font-bold text-white/95 mt-1 tracking-tight">
            AI · AX로 연결하는 혁신의 미래
          </p>

          {/* Date & Location tiny badge */}
          <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-blue-200/90">
            <span>2026. 9. 29</span>
            <span className="text-blue-300/60">·</span>
            <span>본관 G층 대강당</span>
            <span className="text-blue-300/60">·</span>
            <span className="px-1.5 py-0.2 rounded bg-white/15 text-white text-[10px] font-semibold">
              현장 모바일 투표
            </span>
          </div>
        </div>
      </div>

      {/* Subtle thin bottom blue accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#2C8CE6] to-transparent opacity-80" />
    </header>
  );
};
