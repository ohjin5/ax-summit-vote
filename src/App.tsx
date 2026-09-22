import React, { useState, useEffect, useMemo } from 'react';
import { Team, VoteRank, VoteSelection, VoteReceipt, TrackId } from './types';
import { PRESENTATION_TEAMS, TRACKS_LIST } from './data/teams';
import { Header } from './components/Header';
import { VoteProgress } from './components/VoteProgress';
import { VoteSummary } from './components/VoteSummary';
import { TrackSection } from './components/TrackSection';
import { MySelectionSection } from './components/MySelectionSection';
import { ConfirmationView } from './components/ConfirmationView';
import { VoteSuccess } from './components/VoteSuccess';
import { VotingClosed } from './components/VotingClosed';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { TutorialOverlay } from './components/TutorialOverlay';
import { getOrCreateVoterId } from './lib/voter';
import { submitVote } from './services/votingApi';
import { ArrowRight, Search, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [teams] = useState<Team[]>(PRESENTATION_TEAMS);
  const [votingStatus] = useState<'ACTIVE' | 'CLOSED'>('ACTIVE');
  const [selection, setSelection] = useState<VoteSelection>({
    1: null,
    2: null,
    3: null,
  });

  // Track navigation state
  const [activeTrackId, setActiveTrackId] = useState<TrackId | 'all'>('all');

  // Flow views
  const [currentView, setCurrentView] = useState<
    'voting' | 'confirm' | 'success' | 'closed' | 'admin-login' | 'admin-dashboard'
  >('voting');

  const [voterId] = useState<string>(() => getOrCreateVoterId());
  const [receipt, setReceipt] = useState<VoteReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('ax_admin_token');
    } catch {
      return null;
    }
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Toast feedback state (1~2s)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1500);
  };

  // Tutorial state
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Auto-launch tutorial on first visit
  useEffect(() => {
    try {
      const seen = localStorage.getItem('axSummitTutorialSeen');
      if (!seen) {
        setIsTutorialOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // 1. Initial check: Admin deep link or stored token
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true' || window.location.hash === '#admin') {
      if (sessionStorage.getItem('ax_admin_token')) {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('admin-login');
      }
    }
  }, [voterId]);

  // Teams Map for instant lookup
  const teamsMap = useMemo(() => {
    return new Map(teams.map((t) => [t.id, t]));
  }, [teams]);

  // Filtered teams based on search query
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase().trim();
    return teams.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q) ||
        t.presenter.toLowerCase().includes(q) ||
        t.presentationNumber.includes(q) ||
        (t.displayNumber && t.displayNumber.includes(q)) ||
        (t.subPrograms &&
          t.subPrograms.some(
            (sp) =>
              sp.title.toLowerCase().includes(q) ||
              sp.subtitle.toLowerCase().includes(q) ||
              sp.department.toLowerCase().includes(q) ||
              sp.presenter.toLowerCase().includes(q)
          ))
    );
  }, [teams, searchQuery]);

  // Group teams by track
  const teamsByTrack = useMemo(() => {
    const map: Record<TrackId, Team[]> = {
      special: [],
      main1: [],
      main2: [],
    };
    for (const team of filteredTeams) {
      if (map[team.track]) {
        map[team.track].push(team);
      }
    }
    return map;
  }, [filteredTeams]);

  // Handle direct Rank Selection on a team card
  const handleSelectRank = (team: Team, rank: VoteRank) => {
    setSelection((prev) => {
      const next = { ...prev };
      // If this team was assigned to another rank, remove it from that rank first
      if (next[1] === team.id) next[1] = null;
      if (next[2] === team.id) next[2] = null;
      if (next[3] === team.id) next[3] = null;

      // Assign to target rank
      next[rank] = team.id;
      return next;
    });
    showToast(`✓ ${team.title}를 ${rank}위로 선택했어요.`);
  };

  // Clear specific rank
  const handleClearRank = (rank: VoteRank, teamTitle?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelection((prev) => ({
      ...prev,
      [rank]: null,
    }));
    showToast(teamTitle ? `${teamTitle}의 ${rank}위 선택을 취소했어요.` : `${rank}위 선택을 취소했어요.`);
  };

  // Disabled button click feedback (for mobile without hover)
  const handleDisabledClick = (reason: string) => {
    showToast(reason);
  };

  // Scroll to track section smoothly
  const handleSelectTrack = (trackId: TrackId | 'all') => {
    setActiveTrackId(trackId);
    if (trackId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(`track-${trackId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Proceed to Confirmation view
  const handleProceedToConfirm = () => {
    if (!selection[1] || !selection[2] || !selection[3]) {
      alert('1위, 2위, 3위 발표를 모두 선택해야 확인 및 제출할 수 있습니다.');
      return;
    }
    setSubmitError(null);
    setCurrentView('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit vote to Google Apps Script Web App
  const handleSubmitVote = async () => {
    if (!selection[1] || !selection[2] || !selection[3]) {
      setSubmitError('1위, 2위, 3위 발표팀을 모두 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitVote({
        voterId,
        firstId: selection[1],
        secondId: selection[2],
        thirdId: selection[3],
      });

      if (!res.success) {
        if (res.code === 'ALREADY_VOTED') {
          setSubmitError('이미 투표가 완료되었습니다.');
        } else {
          setSubmitError(res.message || '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      const firstTeam = teamsMap.get(selection[1]!);
      const secondTeam = teamsMap.get(selection[2]!);
      const thirdTeam = teamsMap.get(selection[3]!);

      const newReceipt: VoteReceipt = {
        id: 'VOTE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        voterId,
        first: selection[1]!,
        second: selection[2]!,
        third: selection[3]!,
        timestamp: Date.now(),
        firstTeam,
        secondTeam,
        thirdTeam,
      };

      setReceipt(newReceipt);
      setCurrentView('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError('투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin handlers
  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    try {
      sessionStorage.setItem('ax_admin_token', token);
    } catch {
      // ignore
    }
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    try {
      sessionStorage.removeItem('ax_admin_token');
    } catch {
      // ignore
    }
    setCurrentView('voting');
  };

  const handleOpenAdmin = () => {
    if (adminToken) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-login');
    }
  };

  const allSelected = Boolean(selection[1] && selection[2] && selection[3]);
  const selectedCount = [selection[1], selection[2], selection[3]].filter(Boolean).length;

  const firstTeam = selection[1] ? teamsMap.get(selection[1]) : null;
  const secondTeam = selection[2] ? teamsMap.get(selection[2]) : null;
  const thirdTeam = selection[3] ? teamsMap.get(selection[3]) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7FAFD] text-[#202B3C] selection:bg-[#1268C4] selection:text-white">
      {/* 1. Header */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        isAdmin={Boolean(adminToken && currentView === 'admin-dashboard')}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full pb-32">
        {/* VIEW: Admin Login */}
        {currentView === 'admin-login' && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBackToVote={() => setCurrentView('voting')}
          />
        )}

        {/* VIEW: Admin Dashboard */}
        {currentView === 'admin-dashboard' && adminToken && (
          <AdminDashboard
            token={adminToken}
            onLogout={handleAdminLogout}
            onViewVoterScreen={() => setCurrentView('voting')}
          />
        )}

        {/* VIEW: Success Receipt */}
        {currentView === 'success' && <VoteSuccess receipt={receipt} />}

        {/* VIEW: Voting Closed */}
        {currentView === 'closed' && <VotingClosed />}

        {/* VIEW: Final Confirmation */}
        {currentView === 'confirm' && (
          <ConfirmationView
            selection={selection}
            teamsMap={teamsMap}
            onBackToEdit={() => setCurrentView('voting')}
            onSubmit={handleSubmitVote}
            isSubmitting={isSubmitting}
            errorMessage={submitError}
          />
        )}

        {/* VIEW: Voting Flow with Track Grouping */}
        {currentView === 'voting' && (
          <>
            {votingStatus === 'CLOSED' ? (
              <VotingClosed />
            ) : (
              <div>
                {/* 1. Direct Selection Banner */}
                <VoteProgress
                  selection={selection}
                  onOpenTutorial={() => setIsTutorialOpen(true)}
                />

                {/* 2. Sticky Horizontal Track Navigation Chips */}
                <VoteSummary
                  activeTrackId={activeTrackId}
                  onSelectTrack={handleSelectTrack}
                />

                {/* Main List Container */}
                <div className="max-w-2xl mx-auto px-4 py-5 sm:px-6">
                  {/* Search Filter for Fast Finding */}
                  <div className="relative mb-6">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="발표 번호, 팀명, 부서명, 발표자 검색..."
                      className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-[#D9E5F1] text-xs sm:text-sm text-[#202B3C] placeholder-[#66758A] focus:outline-none focus:ring-2 focus:ring-[#1268C4] shadow-2xs"
                    />
                    <Search className="w-4 h-4 text-[#66758A] absolute left-3 top-1/2 -translate-y-1/2" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-xs text-[#66758A] hover:text-[#0A2E6D] absolute right-3 top-1/2 -translate-y-1/2 px-1 cursor-pointer"
                      >
                        지우기
                      </button>
                    )}
                  </div>

                  {/* Track Sections */}
                  {TRACKS_LIST.map((track) => {
                    const trackTeams = teamsByTrack[track.id];
                    return (
                      <TrackSection
                        key={track.id}
                        track={track}
                        teams={trackTeams}
                        selection={selection}
                        onSelectRank={handleSelectRank}
                        onClearRank={handleClearRank}
                        onDisabledClick={handleDisabledClick}
                        isTutorialOpen={isTutorialOpen}
                      />
                    );
                  })}

                  {filteredTeams.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-[#D9E5F1] p-6">
                      <p className="text-sm font-bold text-[#66758A]">
                        검색 결과가 없습니다: “{searchQuery}”
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 text-xs font-extrabold text-[#1268C4] underline cursor-pointer"
                      >
                        전체 발표 보기
                      </button>
                    </div>
                  )}

                  {/* 3. "내 선택" Bottom Summary Area */}
                  <MySelectionSection
                    selection={selection}
                    teamsMap={teamsMap}
                    onClearRank={handleClearRank}
                    onProceedToConfirm={handleProceedToConfirm}
                    allSelected={allSelected}
                  />
                </div>

                {/* Floating Toast Notification (1~2 seconds) */}
                {toastMessage && (
                  <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all px-4 max-w-[90vw]">
                    <div className="bg-[#0A2E6D]/95 backdrop-blur-xs text-white px-4 py-2.5 rounded-full shadow-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-[#2C8CE6]/40 text-center animate-in fade-in zoom-in-95 duration-150">
                      <span>{toastMessage}</span>
                    </div>
                  </div>
                )}

                {/* Sticky Bottom Action Bar (Compact Single-Row on Mobile) */}
                <div
                  id="tutorial-sticky-bar"
                  className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#D9E5F1] shadow-xl p-2.5 sm:p-3.5 z-30"
                >
                  <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 px-1">
                    {/* Compact Status Indicator */}
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-semibold text-[#66758A]">선택 진행 상황</span>
                      <span
                        className={`font-black text-xs sm:text-sm leading-tight ${
                          allSelected ? 'text-emerald-600' : 'text-[#0A2E6D]'
                        }`}
                      >
                        {allSelected ? '✓ 3 / 3 선택 완료' : `${selectedCount} / 3 선택`}
                      </span>
                    </div>

                    {/* Single Check Result Button (min-h-[44px] touch target) */}
                    <button
                      id="btn-proceed-confirm"
                      type="button"
                      disabled={!allSelected}
                      onClick={handleProceedToConfirm}
                      className={`min-h-[44px] px-4 sm:px-6 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        allSelected
                          ? 'bg-[#1268C4] hover:bg-[#0A2E6D] active:scale-[0.98] text-white shadow-[#1268C4]/20 cursor-pointer'
                          : 'bg-[#E2E8F0] text-[#94A3B8] border border-[#CBD5E1] cursor-not-allowed opacity-80'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          allSelected ? 'text-[#DCEEFF]' : 'text-[#94A3B8]'
                        }`}
                      />
                      <span>선택 결과 확인</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Hospital Official Footer */}
      <footer className="w-full bg-[#0A2E6D] text-[#DCEEFF]/80 py-6 text-center text-xs border-t border-[#1268C4]/40 mt-auto">
        <div className="max-w-2xl mx-auto px-4 space-y-1.5">
          <p className="font-extrabold text-white text-xs sm:text-sm">
            가톨릭대학교 은평성모병원 · 은평 AX SUMMIT 2026 현장 투표
          </p>
          <p className="text-[11px] text-blue-200">
            AI · AX로 연결하는 혁신의 미래 | 2026. 9. 29 · 본관 G층 대강당
          </p>
          <div className="pt-2">
            <button
              id="btn-footer-admin"
              type="button"
              onClick={handleOpenAdmin}
              className="text-[11px] text-blue-200 hover:text-white underline decoration-blue-300 transition-colors cursor-pointer"
            >
              관리자 페이지 로그인
            </button>
          </div>
        </div>
      </footer>
      {/* Guided Tour / Coach Mark Tutorial Overlay */}
      <TutorialOverlay
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
