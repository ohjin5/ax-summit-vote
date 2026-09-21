import React from 'react';
import { VoteSelection, Team } from '../types';
import { PresenterImage } from './PresenterImage';
import { ArrowLeft, Send, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ConfirmationViewProps {
  selection: VoteSelection;
  teamsMap: Map<string, Team>;
  onBackToEdit: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  selection,
  teamsMap,
  onBackToEdit,
  onSubmit,
  isSubmitting,
  errorMessage,
}) => {
  const first = selection[1] ? teamsMap.get(selection[1]) : null;
  const second = selection[2] ? teamsMap.get(selection[2]) : null;
  const third = selection[3] ? teamsMap.get(selection[3]) : null;

  const ranksConfig = [
    {
      rank: 1 as const,
      team: first,
      medal: '🥇',
      badge: '1위',
      score: '5점 부여',
      bgClass: 'bg-white border-[#1268C4] shadow-xs ring-1 ring-[#1268C4]/20',
      badgeBg: 'bg-[#0A2E6D] text-white',
    },
    {
      rank: 2 as const,
      team: second,
      medal: '🥈',
      badge: '2위',
      score: '3점 부여',
      bgClass: 'bg-white border-[#D9E5F1] shadow-2xs',
      badgeBg: 'bg-[#1268C4] text-white',
    },
    {
      rank: 3 as const,
      team: third,
      medal: '🥉',
      badge: '3위',
      score: '1점 부여',
      bgClass: 'bg-white border-[#D9E5F1] shadow-2xs',
      badgeBg: 'bg-[#2C8CE6] text-white',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:px-6">
      {/* Top Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#DCEEFF] text-[#0A2E6D] mb-2.5 border border-[#D9E5F1]">
          <ShieldCheck className="w-6 h-6 text-[#1268C4]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">
          최종 선택을 확인해주세요
        </h2>
        <p className="text-xs sm:text-sm text-[#66758A] mt-1">
          선택하신 1위 · 2위 · 3위 발표를 최종 확인한 후 제출해주세요.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-rose-700 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ranks Cards (1위 -> 2위 -> 3위 정상 순서 표시) */}
      <div className="space-y-3.5 mb-6">
        {ranksConfig.map(({ rank, team, medal, badge, score, bgClass, badgeBg }) => (
          <div
            key={rank}
            className={`p-4 rounded-2xl border transition-all ${bgClass}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black tracking-wider px-2.5 py-0.5 rounded-full ${badgeBg}`}
              >
                <span>{medal}</span>
                <span>{badge}</span>
              </span>
              <span className="text-xs font-extrabold text-[#0A2E6D] bg-[#F3F8FD] px-2.5 py-0.5 rounded-md border border-[#D9E5F1]">
                {score}
              </span>
            </div>

            {team ? (
              <div className="flex items-start gap-3 pt-1">
                <PresenterImage
                  src={team.image}
                  alt={`${team.title} 발표자 ${team.presenter}`}
                  presentationNumber={team.presentationNumber}
                  trackId={team.track}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono font-bold text-[#66758A] mb-0.5">
                    발표 {team.presentationNumber} · {team.trackTitle}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#102A56] leading-snug">
                    {team.title}
                  </h3>
                  <p className="text-xs text-[#66758A] mt-0.5 line-clamp-1">
                    {team.subtitle}
                  </p>
                  <div className="mt-1 text-xs text-[#202B3C] font-medium">
                    <span className="text-[#66758A]">{team.department}</span>
                    <span className="mx-1 text-[#D9E5F1]">·</span>
                    <span className="font-bold text-[#102A56]">
                      {team.presenter}
                      {team.subPresenter && (
                        <span className="text-[11px] font-semibold text-[#66758A] ml-1">
                          ({team.subPresenter})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-rose-600 font-bold py-2">
                선택되지 않았습니다.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="mb-6 p-3.5 rounded-xl bg-[#F3F8FD] border border-[#D9E5F1] text-[11px] text-[#66758A] text-center leading-relaxed">
        공정한 심사를 위해 투표 제출 후에는 선택 내용을 변경하거나 재투표할 수 없습니다.
      </div>

      {/* Action Buttons: 투표 제출, 선택 수정 */}
      <div className="space-y-2.5">
        <button
          id="btn-submit-vote"
          type="button"
          disabled={isSubmitting || !first || !second || !third}
          onClick={onSubmit}
          className="w-full h-13 rounded-xl bg-[#1268C4] hover:bg-[#0A2E6D] active:scale-[0.98] text-white font-black text-base shadow-md shadow-[#1268C4]/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>투표 제출 중...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>투표 제출</span>
            </>
          )}
        </button>

        <button
          id="btn-back-to-edit"
          type="button"
          disabled={isSubmitting}
          onClick={onBackToEdit}
          className="w-full h-11 rounded-xl bg-white border border-[#D9E5F1] hover:bg-[#F3F8FD] text-[#0A2E6D] font-bold text-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>선택 수정</span>
        </button>
      </div>
    </div>
  );
};
