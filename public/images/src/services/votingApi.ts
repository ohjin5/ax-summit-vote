import { PRESENTATION_TEAMS } from '../data/teams';
import { Team, TeamScoreResult, AdminStats } from '../types';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbweOEvOkvSGmK5KHvIAbJiMcerAWxV7RahIpny_XYig-50UFO8YuNP69FsCcdw2z6u_/exec';

/**
 * Get configured Apps Script Web App URL from environment or constant.
 */
export function getAppsScriptUrl(): string {
  let url = '';
  if (typeof process !== 'undefined' && process.env) {
    url = process.env.VITE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL || '';
  }
  if (!url && typeof import.meta !== 'undefined' && import.meta.env) {
    url = (import.meta.env.VITE_APPS_SCRIPT_URL as string) || '';
  }
  return url.trim() || DEFAULT_APPS_SCRIPT_URL;
}

/**
 * Converts team ID (e.g. 'team-01', '1', 1) to numeric candidate ID 1~14.
 */
export function toNumericCandidateId(id: string | number): number {
  if (typeof id === 'number') return id;
  const match = id.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? 1 : parsed;
}

export interface SubmitVoteParams {
  voterId: string;
  firstId: string | number;
  secondId: string | number;
  thirdId: string | number;
}

export interface VoteApiResponse {
  success: boolean;
  code?: string;
  message?: string;
  data?: any;
}

/**
 * Submit vote to Google Apps Script Web App.
 */
export async function submitVote(params: SubmitVoteParams): Promise<VoteApiResponse> {
  const url = getAppsScriptUrl();
  const voterId = params.voterId;
  const numFirst = toNumericCandidateId(params.firstId);
  const numSecond = toNumericCandidateId(params.secondId);
  const numThird = toNumericCandidateId(params.thirdId);

  const payload = {
    action: 'vote',
    voterId: voterId,
    thirdId: numThird,
    secondId: numSecond,
    firstId: numFirst,
  };

  try {
    // Standard POST fetch to Google Apps Script Web App
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        message: data.message || '투표가 정상적으로 저장되었습니다.',
        data: data.data,
      };
    }

    if (
      data.code === 'ALREADY_VOTED' ||
      (data.message && (data.message.includes('이미') || data.message.includes('중복')))
    ) {
      return {
        success: false,
        code: 'ALREADY_VOTED',
        message: '이미 투표가 완료되었습니다.',
      };
    }

    return {
      success: false,
      code: data.code || 'SAVE_FAILED',
      message: data.message || '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.',
    };
  } catch (err) {
    console.error('Error submitting vote to Apps Script:', err);

    // Fallback: GET request attempt if POST was blocked by strict CORS policies in some browser environments
    try {
      const getUrl = `${url}?action=vote&voterId=${encodeURIComponent(voterId)}&firstId=${numFirst}&secondId=${numSecond}&thirdId=${numThird}&_t=${Date.now()}`;
      const fallbackRes = await fetch(getUrl);
      const fallbackData = await fallbackRes.json();

      if (fallbackData.success) {
        return {
          success: true,
          message: fallbackData.message || '투표가 정상적으로 저장되었습니다.',
          data: fallbackData.data,
        };
      }

      if (
        fallbackData.code === 'ALREADY_VOTED' ||
        (fallbackData.message &&
          (fallbackData.message.includes('이미') || fallbackData.message.includes('중복')))
      ) {
        return {
          success: false,
          code: 'ALREADY_VOTED',
          message: '이미 투표가 완료되었습니다.',
        };
      }

      return {
        success: false,
        message: fallbackData.message || '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.',
      };
    } catch (fallbackErr) {
      console.error('Fallback GET submission also failed:', fallbackErr);
    }

    return {
      success: false,
      message: '투표 저장 중 문제가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * Admin authentication call to Apps Script API.
 */
export async function adminLogin(password: string): Promise<{ success: boolean; message: string }> {
  const url = getAppsScriptUrl();
  try {
    const res = await fetch(`${url}?action=adminLogin&password=${encodeURIComponent(password)}&_t=${Date.now()}`);
    const data = await res.json();
    return {
      success: !!data.success,
      message: data.message || (data.success ? '관리자 인증에 성공했습니다.' : '관리자 비밀번호가 올바르지 않습니다.'),
    };
  } catch (err) {
    console.error('Admin login error:', err);
    return {
      success: false,
      message: '인증 서버와의 통신 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

/**
 * Fetch actual calculation results for Admin panel from Google Apps Script.
 */
export async function getAdminResults(password: string): Promise<AdminStats> {
  const url = getAppsScriptUrl();
  const res = await fetch(`${url}?action=results&password=${encodeURIComponent(password)}&_t=${Date.now()}`);
  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || data.error || '실제 결과를 가져오는 도중 오류가 발생했습니다.');
  }

  const teamMap = new Map<string, Team>();
  for (const t of PRESENTATION_TEAMS) {
    teamMap.set(t.id, t);
    teamMap.set(String(t.order), t);
    teamMap.set(t.numberStr, t);
    teamMap.set(t.displayNumber, t);
    teamMap.set(t.presentationNumber, t);
    if (t.originalId) {
      teamMap.set(t.originalId, t);
    }
  }

  const rawResults: any[] = data.results || data.data?.results || [];

  const mappedResults: TeamScoreResult[] = rawResults.map((r: any, idx: number) => {
    const numericId = r.id !== undefined ? r.id : r.teamId !== undefined ? r.teamId : idx + 1;
    const teamObj =
      teamMap.get(`team-${String(numericId).padStart(2, '0')}`) ||
      teamMap.get(String(numericId)) ||
      {
        id: `team-${String(numericId).padStart(2, '0')}`,
        order: numericId,
        displayNumber: String(numericId).padStart(2, '0'),
        numberStr: String(numericId).padStart(2, '0'),
        presentationNumber: String(numericId).padStart(2, '0'),
        track: 'main1',
        trackTitle: 'Main Track',
        title: r.title || `후보 ${numericId}`,
        subtitle: '',
        department: '',
        presenter: '',
        category: '',
        image: `/images/photo${numericId}.png`,
      };

    const rankVal = r.rank || idx + 1;
    return {
      teamId: teamObj.id,
      team: teamObj,
      firstVotes: r.firstVotes || 0,
      secondVotes: r.secondVotes || 0,
      thirdVotes: r.thirdVotes || 0,
      totalVotes: (r.firstVotes || 0) + (r.secondVotes || 0) + (r.thirdVotes || 0),
      totalScore: r.totalScore !== undefined ? r.totalScore : 0,
      rank: rankVal,
      isTie: !!r.isTie,
      rankDisplay: r.rankDisplay || `${rankVal}위`,
    };
  });

  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  return {
    totalVoters: data.totalVoters !== undefined ? data.totalVoters : data.data?.totalVoters || 0,
    votingStatus: 'ACTIVE',
    lastUpdated: data.updatedAt || timeStr,
    lastUpdatedTimestamp: Date.now(),
    results: mappedResults,
  };
}
