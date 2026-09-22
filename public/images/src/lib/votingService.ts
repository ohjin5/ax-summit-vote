import { Team, TeamScoreResult, AdminStats } from '../types';
import { TEAMS } from '../data/teams';

export interface SubmitVotePayload {
  voterId: string;
  firstId?: string;
  first?: string;
  secondId?: string;
  second?: string;
  thirdId?: string;
  third?: string;
}

let isVotingActive = true;

export function getVotingStatus(): 'ACTIVE' | 'CLOSED' {
  return isVotingActive ? 'ACTIVE' : 'CLOSED';
}

export function setVotingStatus(status: 'ACTIVE' | 'CLOSED') {
  isVotingActive = status === 'ACTIVE';
}

/**
 * Gets the configured Google Apps Script Web App URL from environment variables.
 */
export function getAppsScriptUrl(): string {
  let url = '';
  if (typeof process !== 'undefined' && process.env) {
    url = process.env.VITE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL || '';
  }
  if (!url && typeof import.meta !== 'undefined' && import.meta.env) {
    url = (import.meta.env.VITE_APPS_SCRIPT_URL as string) || '';
  }
  return url.trim();
}

/**
 * Validates and processes a vote submission by sending a request to Google Apps Script Web App.
 */
export async function processVoteSubmission(payload: SubmitVotePayload): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}> {
  const voterId = payload.voterId;
  const firstId = payload.firstId || payload.first;
  const secondId = payload.secondId || payload.second;
  const thirdId = payload.thirdId || payload.third;

  // 1. Check voting status
  if (!isVotingActive) {
    return {
      success: false,
      error: '현재 투표가 마감되었거나 일시 정지된 상태입니다.',
    };
  }

  // 2. Validate voterId presence
  if (!voterId || typeof voterId !== 'string' || voterId.trim().length === 0) {
    return {
      success: false,
      error: '유효하지 않은 투표자 식별 정보(voterId)입니다.',
    };
  }

  // 3. Validate choices presence
  if (!firstId || !secondId || !thirdId) {
    return {
      success: false,
      error: '1위, 2위, 3위 발표를 모두 선택해야 합니다.',
    };
  }

  // 4. Validate distinct choices
  if (firstId === secondId || secondId === thirdId || firstId === thirdId) {
    return {
      success: false,
      error: '1위, 2위, 3위 후보는 서로 다른 발표이어야 합니다.',
    };
  }

  // 5. Validate candidate existence
  const teamMap = new Map<string, Team>(TEAMS.map((t) => [t.id, t]));
  const firstTeam = teamMap.get(firstId);
  const secondTeam = teamMap.get(secondId);
  const thirdTeam = teamMap.get(thirdId);

  if (!firstTeam || !secondTeam || !thirdTeam) {
    return {
      success: false,
      error: '선택한 후보 중 유효하지 않은 발표가 포함되어 있습니다.',
    };
  }

  const appsScriptUrl = getAppsScriptUrl();
  if (!appsScriptUrl) {
    return {
      success: false,
      error:
        'Google Apps Script URL이 설정되지 않았습니다. Vercel 환경변수(VITE_APPS_SCRIPT_URL)를 입력해주세요.',
    };
  }

  // 6. Send request to Google Apps Script Web App
  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        voterId,
        firstId: firstTeam.id,
        firstTitle: firstTeam.title,
        secondId: secondTeam.id,
        secondTitle: secondTeam.title,
        thirdId: thirdTeam.id,
        thirdTitle: thirdTeam.title,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: result.error || '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.',
      };
    }

    return {
      success: true,
      message: '투표가 완료되었습니다.',
      data: result.data || {
        receipt: {
          id: 'vote-' + Math.random().toString(36).substring(2, 9),
          voterId,
          first: firstTeam.id,
          second: secondTeam.id,
          third: thirdTeam.id,
          timestamp: Date.now(),
          firstTeam,
          secondTeam,
          thirdTeam,
        },
      },
    };
  } catch (err: any) {
    console.error('Google Apps Script vote submission error:', err);
    return {
      success: false,
      error: '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * Calculates results from Google Sheets via Google Apps Script for Admin panel.
 */
export async function calculateAdminResults(): Promise<AdminStats> {
  const appsScriptUrl = getAppsScriptUrl();

  if (!appsScriptUrl) {
    throw new Error('VITE_APPS_SCRIPT_URL 환경변수가 설정되지 않았습니다.');
  }

  try {
    const response = await fetch(`${appsScriptUrl}?action=results&_t=${Date.now()}`);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(
        result.error || 'Google Sheets에서 데이터를 불러오는 도중 오류가 발생했습니다.'
      );
    }

    // Transform team stats if necessary to ensure icon / full team info is attached
    const teamMap = new Map<string, Team>(TEAMS.map((t) => [t.id, t]));
    const results: TeamScoreResult[] = (result.data.results || []).map((r: any) => {
      const fullTeam = teamMap.get(r.teamId) || teamMap.get(r.team?.id) || r.team;
      return {
        teamId: r.teamId || fullTeam?.id,
        team: fullTeam,
        firstVotes: r.firstVotes || 0,
        secondVotes: r.secondVotes || 0,
        thirdVotes: r.thirdVotes || 0,
        totalVotes: r.totalVotes || 0,
        totalScore: r.totalScore || 0,
        rank: r.rank || 1,
        isTie: !!r.isTie,
        rankDisplay: r.rankDisplay || `${r.rank || 1}위`,
      };
    });

    const now = new Date();
    const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(
      now.getSeconds()
    ).padStart(2, '0')}`;

    return {
      totalVoters: result.data.totalVoters || 0,
      votingStatus: getVotingStatus(),
      lastUpdated: result.data.lastUpdated || timeString,
      lastUpdatedTimestamp: Date.now(),
      results,
    };
  } catch (err: any) {
    console.error('Error fetching admin results from Google Apps Script:', err);
    throw new Error(
      err?.message || 'Google Apps Script 연결 실패. VITE_APPS_SCRIPT_URL 환경변수를 확인하세요.'
    );
  }
}

/**
 * Validates admin password.
 */
export function verifyAdminPassword(inputPassword: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin2026';
  return inputPassword === expectedPassword;
}
