import React from 'react';
import { Clock } from 'lucide-react';

export const VotingClosed: React.FC = () => {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3F8FD] text-[#0A2E6D] mb-5 border border-[#D9E5F1]">
        <Clock className="w-8 h-8 text-[#1268C4]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-[#102A56] tracking-tight leading-snug">
        투표가 마감되었습니다
      </h1>
      <p className="text-base sm:text-lg font-bold text-[#202B3C] mt-2">
        참여해주셔서 대단히 감사합니다.
      </p>

      <div className="mt-6 p-5 rounded-2xl bg-white border border-[#D9E5F1] shadow-xs text-center">
        <span className="inline-block font-black text-[#0A2E6D] text-sm tracking-wider uppercase mb-1">
          은평 AX SUMMIT 2026
        </span>
        <p className="text-xs sm:text-sm text-[#66758A] leading-relaxed">
          현장 투표가 종료되었으며, 최종 집계 결과는 시상식에서 공식 발표됩니다.
        </p>
      </div>
    </div>
  );
};
