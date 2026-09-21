import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldAlert, KeyRound } from 'lucide-react';
import { adminLogin } from '../services/votingApi';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  onBackToVote: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBackToVote }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await adminLogin(password);
      if (!res.success) {
        setError(res.message || '관리자 비밀번호가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      onLogin(password);
    } catch {
      setError('인증 통신 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 py-12">
      <button
        type="button"
        onClick={onBackToVote}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#66758A] hover:text-[#0A2E6D] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>투표 화면으로 돌아가기</span>
      </button>

      <div className="bg-white rounded-2xl border border-[#D9E5F1] shadow-xs p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0A2E6D] text-white mb-3 shadow-xs">
            <Lock className="w-5 h-5 text-[#DCEEFF]" />
          </div>
          <span className="block text-xs font-black tracking-wider text-[#1268C4] uppercase">
            AX SUMMIT 2026
          </span>
          <h2 className="text-xl font-black text-[#102A56] tracking-tight mt-0.5">
            관리자 대시보드 로그인
          </h2>
          <p className="text-xs text-[#66758A] mt-1">
            현장 집계 모니터링 및 투표 데이터 확인을 위한 인증
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-extrabold text-[#102A56] mb-1.5"
            >
              관리자 비밀번호
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                autoFocus
                className="w-full h-12 px-3.5 pl-10 rounded-xl border border-[#D9E5F1] focus:outline-none focus:ring-2 focus:ring-[#1268C4] focus:border-transparent text-sm bg-[#F7FAFD]"
              />
              <KeyRound className="w-4 h-4 text-[#66758A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            id="btn-admin-login"
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-[#0A2E6D] hover:bg-[#0D3882] active:scale-[0.99] text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <span>관리자 로그인</span>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#D9E5F1] text-center">
          <span className="text-[11px] text-[#66758A]">
            Google Apps Script 관리자 인증 연동
          </span>
        </div>
      </div>
    </div>
  );
};
