import React, { useState, useEffect, useCallback } from 'react';
import { AdminStats } from '../types';
import { getAdminResults } from '../services/votingApi';
import {
  RefreshCw,
  LogOut,
  Users,
  Activity,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string; // password passed from AdminLogin
  onLogout: () => void;
  onViewVoterScreen: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  onLogout,
  onViewVoterScreen,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch results from Google Apps Script Web App
  const fetchResults = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await getAdminResults(token);
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Fetch admin results error:', err);
      setError(err?.message || '실제 결과를 가져오는 도중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchResults();

    // Polling interval every 6 seconds to stay synced with Google Sheets
    const interval = setInterval(() => {
      fetchResults();
    }, 6000);

    return () => clearInterval(interval);
  }, [fetchResults]);

  // Top 3 Podium Extraction
  const top1 = stats?.results?.[0];
  const top2 = stats?.results?.[1];
  const top3 = stats?.results?.[2];

  return (
    <div className="min-h-screen bg-[#F7FAFD] pb-16">
      {/* Top Admin Header Bar */}
      <div className="bg-[#0A2E6D] text-white border-b border-[#1268C4]/40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#2C8CE6]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  AX SUMMIT 2026
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCEEFF] text-[#0A2E6D]">
                  실시간 집계 대시보드
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Google Sheets Votes 연동 현장 투표 결과
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-switch-voter-view"
              type="button"
              onClick={onViewVoterScreen}
              className="h-9 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>투표 화면 보기</span>
            </button>
            <button
              id="btn-admin-logout"
              type="button"
              onClick={onLogout}
              className="h-9 px-3 rounded-lg bg-white/10 hover:bg-rose-900/60 text-white hover:text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Section 8 Requirement: Metric Cards (총 투표 완료) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {/* 1. 총 참여자 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#66758A] block">총 투표 완료</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#102A56]">
                  {stats ? stats.totalVoters : '-'}
                </span>
                <span className="text-sm font-bold text-[#66758A]">명</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F3F8FD] text-[#0A2E6D] flex items-center justify-center border border-[#D9E5F1]">
              <Users className="w-6 h-6 text-[#1268C4]" />
            </div>
          </div>

          {/* 2. 투표 상태 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#66758A] block">투표 상태</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-base sm:text-lg font-black text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  실시간 기록 중
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F3F8FD] text-[#0A2E6D] flex items-center justify-center border border-[#D9E5F1]">
              <Activity className="w-6 h-6 text-[#1268C4]" />
            </div>
          </div>

          {/* 3. 마지막 동기화 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-[#66758A] block">마지막 확인 시각</span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-[#102A56] font-mono">
                  {stats ? stats.lastUpdated : '-'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F3F8FD] text-[#0A2E6D] flex items-center justify-center border border-[#D9E5F1]">
              <Clock className="w-6 h-6 text-[#1268C4]" />
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-refresh-results"
              type="button"
              disabled={isRefreshing}
              onClick={fetchResults}
              className="h-10 px-4 rounded-xl bg-[#1268C4] hover:bg-[#0A2E6D] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? '결과 불러오는 중...' : '결과 새로고침'}</span>
            </button>
          </div>

          <div className="text-xs font-semibold text-[#66758A] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#1268C4]" />
              가중치 배점: 1위 5점 · 2위 3점 · 3위 1점
            </span>
            <span className="text-[11px] text-[#66758A] bg-[#F3F8FD] px-2.5 py-1 rounded-lg border border-[#D9E5F1] font-medium">
              동점 시 1위 선택 수 → 2위 선택 수 → 3위 선택 수 순으로 순위를 결정합니다.
            </span>
          </div>
        </div>

        {/* Podium Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-black text-[#102A56] tracking-tight mb-3 flex items-center gap-2">
            <span>실시간 TOP 3 프로그램</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1위 Card */}
            <div className="p-4.5 rounded-2xl bg-white border-2 border-[#0A2E6D] shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0A2E6D] text-white text-xs font-black">
                  1위 {top1?.isTie ? '(공동)' : ''}
                </span>
                <span className="text-xl font-black text-[#0A2E6D]">
                  {top1 ? top1.totalScore : 0}
                  <span className="text-xs font-bold ml-0.5">점</span>
                </span>
              </div>
              <h3 className="font-black text-[#102A56] text-base leading-snug line-clamp-2 min-h-[44px]">
                {top1 ? top1.team.title : '집계 대기 중'}
              </h3>
              <p className="text-xs text-[#66758A] mt-1 truncate">
                {top1 ? `${top1.team.department} · ${top1.team.presenter}` : '-'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#D9E5F1] text-[11px] text-[#66758A] flex justify-between">
                <span>1위표: {top1?.firstVotes || 0}</span>
                <span>2위표: {top1?.secondVotes || 0}</span>
                <span>3위표: {top1?.thirdVotes || 0}</span>
              </div>
            </div>

            {/* 2위 Card */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1268C4] text-white text-xs font-black">
                  2위 {top2?.isTie ? '(공동)' : ''}
                </span>
                <span className="text-xl font-black text-[#1268C4]">
                  {top2 ? top2.totalScore : 0}
                  <span className="text-xs font-bold ml-0.5">점</span>
                </span>
              </div>
              <h3 className="font-black text-[#102A56] text-base leading-snug line-clamp-2 min-h-[44px]">
                {top2 ? top2.team.title : '집계 대기 중'}
              </h3>
              <p className="text-xs text-[#66758A] mt-1 truncate">
                {top2 ? `${top2.team.department} · ${top2.team.presenter}` : '-'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#D9E5F1] text-[11px] text-[#66758A] flex justify-between">
                <span>1위표: {top2?.firstVotes || 0}</span>
                <span>2위표: {top2?.secondVotes || 0}</span>
                <span>3위표: {top2?.thirdVotes || 0}</span>
              </div>
            </div>

            {/* 3위 Card */}
            <div className="p-4.5 rounded-2xl bg-white border border-[#D9E5F1] shadow-2xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2C8CE6] text-white text-xs font-black">
                  3위 {top3?.isTie ? '(공동)' : ''}
                </span>
                <span className="text-xl font-black text-[#2C8CE6]">
                  {top3 ? top3.totalScore : 0}
                  <span className="text-xs font-bold ml-0.5">점</span>
                </span>
              </div>
              <h3 className="font-black text-[#102A56] text-base leading-snug line-clamp-2 min-h-[44px]">
                {top3 ? top3.team.title : '집계 대기 중'}
              </h3>
              <p className="text-xs text-[#66758A] mt-1 truncate">
                {top3 ? `${top3.team.department} · ${top3.team.presenter}` : '-'}
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#D9E5F1] text-[11px] text-[#66758A] flex justify-between">
                <span>1위표: {top3?.firstVotes || 0}</span>
                <span>2위표: {top3?.secondVotes || 0}</span>
                <span>3위표: {top3?.thirdVotes || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 Requirement: 전체 순위표 Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-[#102A56] tracking-tight">
              실시간 순위 집계표
            </h2>
            <span className="text-xs font-bold text-[#66758A]">
              Google Sheets 내림차순 정렬
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D9E5F1] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0A2E6D] text-white text-xs uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="py-3.5 px-4 text-center w-20">순위</th>
                    <th className="py-3.5 px-4 min-w-[240px]">프로그램명</th>
                    <th className="py-3.5 px-3 text-center w-24">1위 선택</th>
                    <th className="py-3.5 px-3 text-center w-24">2위 선택</th>
                    <th className="py-3.5 px-3 text-center w-24">3위 선택</th>
                    <th className="py-3.5 px-4 text-right w-24">총점</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9E5F1] text-xs sm:text-sm">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#66758A]">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#1268C4] border-t-transparent rounded-full animate-spin" />
                          <span>결과 불러오는 중...</span>
                        </div>
                      </td>
                    </tr>
                  ) : stats?.results && stats.results.length > 0 ? (
                    stats.results.map((row) => (
                      <tr
                        key={row.teamId}
                        className={`hover:bg-[#F3F8FD] transition-colors ${
                          row.rank === 1
                            ? 'bg-[#F3F8FD]/60 font-semibold'
                            : 'bg-white'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-full text-xs font-black ${
                              row.rank === 1
                                ? 'bg-[#0A2E6D] text-white'
                                : row.rank === 2
                                ? 'bg-[#1268C4] text-white'
                                : row.rank === 3
                                ? 'bg-[#2C8CE6] text-white'
                                : 'text-[#66758A] bg-[#F3F8FD]'
                            }`}
                          >
                            {row.rankDisplay || `${row.rank}위`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-[#102A56] leading-snug">
                            {row.team.title}
                          </div>
                          <div className="text-xs text-[#66758A] mt-0.5">
                            {row.team.department} · {row.team.presenter}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-[#102A56]">
                          {row.firstVotes}표
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-[#102A56]">
                          {row.secondVotes}표
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-[#102A56]">
                          {row.thirdVotes}표
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="text-base font-black text-[#0A2E6D]">
                            {row.totalScore}
                          </span>
                          <span className="text-xs text-[#66758A] ml-0.5">점</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#66758A]">
                        집계된 투표 데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
