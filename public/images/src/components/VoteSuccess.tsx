import React from 'react';
import { VoteReceipt } from '../types';
import { Check, ShieldCheck } from 'lucide-react';

interface VoteSuccessProps {
  receipt?: VoteReceipt | null;
}

export const VoteSuccess: React.FC<VoteSuccessProps> = ({ receipt }) => {
  const formattedTime = receipt?.timestamp
    ? new Date(receipt.timestamp).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <div className="w-full max-w-md mx-auto px-4 py-12 text-center">
      {/* Small AX Graphic / Brand Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCEEFF] text-[#0A2E6D] text-xs font-black tracking-wider mb-6 border border-[#D9E5F1]">
        <span>AX SUMMIT 2026</span>
      </div>

      {/* Clean Checkmark in AX Blue circle */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1268C4] text-white mb-5 shadow-lg shadow-[#1268C4]/25 ring-8 ring-[#DCEEFF]">
        <Check className="w-10 h-10 stroke-[3]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-[#102A56] tracking-tight leading-tight">
        투표가 완료되었습니다
      </h1>

      <div className="mt-4 p-5 rounded-2xl bg-white border border-[#D9E5F1] shadow-xs text-center space-y-1">
        <span className="font-extrabold text-[#0A2E6D] text-base sm:text-lg block">
          AX SUMMIT 2026
        </span>
        <p className="text-sm sm:text-base font-bold text-[#202B3C]">
          소중한 평가 감사합니다.
        </p>
        <p className="text-xs font-semibold text-[#1268C4] pt-1">
          AI · AX로 연결하는 혁신의 미래
        </p>
      </div>

      {/* Compact Receipt Card */}
      {receipt && (
        <div className="mt-6 text-left rounded-2xl bg-white border border-[#D9E5F1] p-4.5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#D9E5F1] text-xs text-[#66758A] font-medium">
            <span className="flex items-center gap-1.5 text-[#0A2E6D] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#1268C4]" />
              투표 인증 완료
            </span>
            <span>{formattedTime}</span>
          </div>

          <div className="mt-3.5 space-y-2.5 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#D9E5F1] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-[#0A2E6D] text-white text-[10px] font-black shrink-0 mt-0.5 flex items-center gap-1">
                <span>🥇</span>
                <span>1위</span>
              </span>
              <div className="min-w-0">
                <span className="font-black text-[#102A56] block truncate">
                  {receipt.firstTeam?.displayNumber ? `${receipt.firstTeam.displayNumber}. ` : ''}
                  {receipt.firstTeam?.title || receipt.first}
                </span>
                {receipt.firstTeam?.subPrograms && receipt.firstTeam.subPrograms.length > 0 ? (
                  <span className="text-[11px] text-[#66758A] block truncate">
                    {receipt.firstTeam.subPrograms.map(p => `${p.title} (${p.presenter})`).join(' + ')}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#66758A] truncate block">
                    {receipt.firstTeam?.department} · {receipt.firstTeam?.presenter}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#D9E5F1] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-[#1268C4] text-white text-[10px] font-black shrink-0 mt-0.5 flex items-center gap-1">
                <span>🥈</span>
                <span>2위</span>
              </span>
              <div className="min-w-0">
                <span className="font-black text-[#102A56] block truncate">
                  {receipt.secondTeam?.displayNumber ? `${receipt.secondTeam.displayNumber}. ` : ''}
                  {receipt.secondTeam?.title || receipt.second}
                </span>
                {receipt.secondTeam?.subPrograms && receipt.secondTeam.subPrograms.length > 0 ? (
                  <span className="text-[11px] text-[#66758A] block truncate">
                    {receipt.secondTeam.subPrograms.map(p => `${p.title} (${p.presenter})`).join(' + ')}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#66758A] truncate block">
                    {receipt.secondTeam?.department} · {receipt.secondTeam?.presenter}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F7FAFD] border border-[#D9E5F1] flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-[#2C8CE6] text-white text-[10px] font-black shrink-0 mt-0.5 flex items-center gap-1">
                <span>🥉</span>
                <span>3위</span>
              </span>
              <div className="min-w-0">
                <span className="font-black text-[#102A56] block truncate">
                  {receipt.thirdTeam?.displayNumber ? `${receipt.thirdTeam.displayNumber}. ` : ''}
                  {receipt.thirdTeam?.title || receipt.third}
                </span>
                {receipt.thirdTeam?.subPrograms && receipt.thirdTeam.subPrograms.length > 0 ? (
                  <span className="text-[11px] text-[#66758A] block truncate">
                    {receipt.thirdTeam.subPrograms.map(p => `${p.title} (${p.presenter})`).join(' + ')}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#66758A] truncate block">
                    {receipt.thirdTeam?.department} · {receipt.thirdTeam?.presenter}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-[#66758A] leading-relaxed">
        <p>※ 중복 투표 방지가 적용되어 투표 내용 변경이 불가합니다.</p>
        <p>본 화면을 닫으셔도 투표 결과는 안전하게 집계에 반영되었습니다.</p>
      </div>
    </div>
  );
};
