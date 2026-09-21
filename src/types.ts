export type TrackId = 'special' | 'main1' | 'main2';

export interface TrackInfo {
  id: TrackId;
  name: string; // "Special Track", "Main Track 1", "Main Track 2"
  title: string; // "간호 현장 혁신 비서", "환자 안전 & 환자경험(CX) 혁신", "EMR 인프라 & 진료·경영 혁신"
  subtitle?: string; // "현장에서 시작된 AI 혁신 사례"
  badge: string; // "SPECIAL TRACK", "MAIN TRACK 1", "MAIN TRACK 2"
  accent: {
    bg: string;
    border: string;
    text: string;
    chipActive: string;
    badgeBg: string;
  };
}

export interface Team {
  id: string;
  order: number;
  numberStr: string;
  presentationNumber: string;
  track: TrackId;
  trackTitle: string;
  title: string;
  subtitle: string;
  department: string;
  presenter: string;
  subPresenter?: string;
  image?: string;
  category?: string;
}

export type VoteRank = 1 | 2 | 3;

export interface VoteSelection {
  1: string | null;
  2: string | null;
  3: string | null;
}

export interface VotePayload {
  voterId: string;
  first: string;
  second: string;
  third: string;
}

export interface VoteReceipt {
  id: string;
  voterId: string;
  first: string;
  second: string;
  third: string;
  timestamp: number;
  firstTeam?: Team;
  secondTeam?: Team;
  thirdTeam?: Team;
}

export interface TeamScoreResult {
  teamId: string;
  team: Team;
  firstVotes: number;
  secondVotes: number;
  thirdVotes: number;
  totalVotes: number;
  totalScore: number;
  rank: number;
  isTie: boolean;
  rankDisplay: string;
}

export interface AdminStats {
  totalVoters: number;
  votingStatus: 'ACTIVE' | 'CLOSED';
  lastUpdated: string;
  lastUpdatedTimestamp: number;
  results: TeamScoreResult[];
}

export interface AppStatus {
  votingStatus: 'ACTIVE' | 'CLOSED';
  totalVoters: number;
  teams: Team[];
}
