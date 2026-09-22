import { Team, TrackInfo, TrackId } from '../types';

export const TRACKS: Record<TrackId, TrackInfo> = {
  special: {
    id: 'special',
    name: 'Special Track',
    title: '간호부 발표 세션',
    subtitle: 'Nursing Special Session · 01 ~ 03',
    badge: 'Special Track',
    accent: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200/80',
      text: 'text-indigo-900',
      chipActive: 'bg-indigo-900 text-white',
      badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
  },
  main1: {
    id: 'main1',
    name: 'Main Track 1',
    title: '환자 안전 & 환자경험(CX) 혁신',
    subtitle: 'Part 2 · 04 ~ 06',
    badge: 'Main Track 1',
    accent: {
      bg: 'bg-sky-50/70',
      border: 'border-sky-200/80',
      text: 'text-sky-950',
      chipActive: 'bg-sky-900 text-white',
      badgeBg: 'bg-sky-100 text-sky-850 border-sky-200',
    },
  },
  main2: {
    id: 'main2',
    name: 'Main Track 2',
    title: 'EMR 인프라 & 진료·경영 핵심 혁신',
    subtitle: 'Part 3 · 07 ~ 11',
    badge: 'Main Track 2',
    accent: {
      bg: 'bg-slate-100/80',
      border: 'border-slate-300/80',
      text: 'text-slate-900',
      chipActive: 'bg-slate-900 text-white',
      badgeBg: 'bg-slate-200 text-slate-800 border-slate-300',
    },
  },
};

export const TRACKS_LIST: TrackInfo[] = [
  TRACKS.special,
  TRACKS.main1,
  TRACKS.main2,
];

export const PRESENTATION_TEAMS: Team[] = [
  // ─── SPECIAL TRACK: 간호부 발표 세션 (01 ~ 03) ───
  {
    id: 'team-01',
    order: 1,
    displayNumber: '01',
    numberStr: '01',
    presentationNumber: '01',
    track: 'special',
    trackTitle: '간호부 발표 세션',
    title: '수술 & 근무 혁신',
    subtitle: '수술실 임플란트 선납서 OCR 코드 검수 + 모바일 근무신청·정원관리 통합 앱',
    department: '수술간호B · 수술물류Unit',
    presenter: '강서영 UM · 곽수빈 UM',
    category: '간호부 발표 세션',
    image: '/images/photo1.png',
    images: ['/images/photo1.png', '/images/photo2.png'],
    subPrograms: [
      {
        title: 'Implant Verification System',
        subtitle: '수술실 임플란트 선납서 OCR 코드 검수',
        department: '수술간호B',
        presenter: '강서영 UM',
      },
      {
        title: 'AI Wanted OFF App',
        subtitle: '모바일 근무신청·정원관리 통합 앱',
        department: '수술물류Unit',
        presenter: '곽수빈 UM',
      },
    ],
  },
  {
    id: 'team-02',
    order: 2,
    displayNumber: '02',
    numberStr: '02',
    presentationNumber: '02',
    track: 'special',
    trackTitle: '간호부 발표 세션',
    title: '스마트 케어 & 응급 임상',
    subtitle: '직원 식당 주간 식단·칼로리 챗봇 + 응급실 문진 음성인식(STT) 임상기록 자동화',
    department: '특수간호팀',
    presenter: '최대원 선임',
    category: '간호부 발표 세션',
    image: '/images/photo3.png',
    images: ['/images/photo3.png', '/images/photo4.png'],
    subPrograms: [
      {
        title: '밥밥이',
        subtitle: '직원 식당 주간 식단·칼로리·원산지 조회 모바일 챗봇',
        department: '특수간호팀',
        presenter: '최대원 선임',
      },
      {
        title: 'EnTriage',
        subtitle: '응급실 문진 음성인식(STT) 기반 SOAP 임상기록 자동화',
        department: '특수간호팀',
        presenter: '최대원 선임',
      },
    ],
  },
  {
    id: 'team-03',
    order: 3,
    displayNumber: '03',
    numberStr: '03',
    presentationNumber: '03',
    track: 'special',
    trackTitle: '간호부 발표 세션',
    title: '간호 관리 및 스케줄 통합',
    subtitle: '3교대 간호사 근무표 자동 생성 + 간호사 통합 관리 멀티에이전트',
    department: '간호부',
    presenter: '신윤주 JM · 김예일 UM',
    category: '간호부 발표 세션',
    image: '/images/photo5.png',
    images: ['/images/photo5.png', '/images/photo6.png'],
    subPrograms: [
      {
        title: '스마트 널스 스케줄러',
        subtitle: '3교대 간호사 근무표 자동 생성',
        department: '간호부',
        presenter: '신윤주 JM',
      },
      {
        title: '간호사 통합 관리 시스템',
        subtitle: '인사정보·교육이수 현황·근무스케줄 분석이 가능한 멀티에이전트',
        department: '간호부',
        presenter: '김예일 UM',
      },
    ],
  },

  // ─── MAIN TRACK 1: 환자 안전 & 환자경험(CX) 혁신 (04 ~ 06) ───
  {
    id: 'team-04',
    originalId: 'team-07',
    order: 4,
    displayNumber: '04',
    numberStr: '04',
    presentationNumber: '04',
    track: 'main1',
    trackTitle: '환자 안전 & 환자경험(CX) 혁신',
    title: 'PolyCheck',
    subtitle: '다제약물 안전성 검토·맞춤 복약안내',
    department: '약제부',
    presenter: '김수연 책임',
    category: '환자 안전 & CX 혁신',
    image: '/images/photo7.png',
    images: ['/images/photo7.png'],
  },
  {
    id: 'team-05',
    originalId: 'team-08',
    order: 5,
    displayNumber: '05',
    numberStr: '05',
    presentationNumber: '05',
    track: 'main1',
    trackTitle: '환자 안전 & 환자경험(CX) 혁신',
    title: 'HEAR',
    subtitle: '환자경험평가·VOC 분석 및 피드백 자동화',
    department: '고객행복팀',
    presenter: '진달래 과장',
    category: '환자 안전 & CX 혁신',
    image: '/images/photo8.png',
    images: ['/images/photo8.png'],
  },
  {
    id: 'team-06',
    originalId: 'team-09',
    order: 6,
    displayNumber: '06',
    numberStr: '06',
    presentationNumber: '06',
    track: 'main1',
    trackTitle: '환자 안전 & 환자경험(CX) 혁신',
    title: '외래 환자 맞춤 안내 AI',
    subtitle: '검사·처치 동선과 환자 맞춤 안내 제공',
    department: '외래간호팀',
    presenter: '정주안 선임',
    category: '환자 안전 & CX 혁신',
    image: '/images/photo9.png',
    images: ['/images/photo9.png'],
  },

  // ─── MAIN TRACK 2: EMR 인프라 & 진료·경영 핵심 혁신 (07 ~ 11) ───
  {
    id: 'team-07',
    originalId: 'team-10',
    order: 7,
    displayNumber: '07',
    numberStr: '07',
    presentationNumber: '07',
    track: 'main2',
    trackTitle: 'EMR 인프라 & 진료·경영 핵심 혁신',
    title: 'CCR Scope',
    subtitle: '의료소모품 적정재고 분석 및 비용 절감',
    department: '수술물류Unit',
    presenter: '김은지 선임',
    category: 'EMR 인프라 & 진료·경영',
    image: '/images/photo10.png',
    images: ['/images/photo10.png'],
  },
  {
    id: 'team-08',
    originalId: 'team-11',
    order: 8,
    displayNumber: '08',
    numberStr: '08',
    presentationNumber: '08',
    track: 'main2',
    trackTitle: 'EMR 인프라 & 진료·경영 핵심 혁신',
    title: 'AI 기반 채용 업무 자동화 프로그램',
    subtitle: '채용 일정·공고·메신저 업무 자동화',
    department: '인사팀',
    presenter: '김세은 대리',
    category: 'EMR 인프라 & 진료·경영',
    image: '/images/photo11.png',
    images: ['/images/photo11.png'],
  },
  {
    id: 'team-09',
    originalId: 'team-12',
    order: 9,
    displayNumber: '09',
    numberStr: '09',
    presentationNumber: '09',
    track: 'main2',
    trackTitle: 'EMR 인프라 & 진료·경영 핵심 혁신',
    title: 'Smart KDRG Navigator',
    subtitle: 'EMR 기반 중증도 분석 및 KDRG 코딩 지원',
    department: '적정진료관리팀',
    presenter: '김소리 책임',
    category: 'EMR 인프라 & 진료·경영',
    image: '/images/photo12.png',
    images: ['/images/photo12.png'],
  },
  {
    id: 'team-10',
    originalId: 'team-13',
    order: 10,
    displayNumber: '10',
    numberStr: '10',
    presentationNumber: '10',
    track: 'main2',
    trackTitle: 'EMR 인프라 & 진료·경영 핵심 혁신',
    title: '치과 스마트 에이전트',
    subtitle: 'AI 기반 차트 리뷰 및 스마트 진료 지원',
    department: '치과',
    presenter: '이상화 교수팀',
    category: 'EMR 인프라 & 진료·경영',
    image: '/images/photo13.png',
    images: ['/images/photo13.png'],
  },
  {
    id: 'team-11',
    originalId: 'team-14',
    order: 11,
    displayNumber: '11',
    numberStr: '11',
    presentationNumber: '11',
    track: 'main2',
    trackTitle: 'EMR 인프라 & 진료·경영 핵심 혁신',
    title: 'nU 진료 연동 시연',
    subtitle: '환자정보 요약·마취 전 확인·KDRG 추천',
    department: '내분비내과',
    presenter: '조형일 Dr',
    category: 'EMR 인프라 & 진료·경영',
    image: '/images/photo14.png',
    images: ['/images/photo14.png'],
  },
];

const teamsMap = new Map<string, Team>();
for (const t of PRESENTATION_TEAMS) {
  teamsMap.set(t.id, t);
  teamsMap.set(t.displayNumber, t);
  teamsMap.set(String(t.order), t);
  if (t.originalId) {
    teamsMap.set(t.originalId, t);
  }
}
export const TEAMS_BY_ID = teamsMap;
export const TEAMS = PRESENTATION_TEAMS;

// Group teams by track
export function getTeamsByTrack(): Record<TrackId, Team[]> {
  const grouped: Record<TrackId, Team[]> = {
    special: [],
    main1: [],
    main2: [],
  };

  for (const team of PRESENTATION_TEAMS) {
    if (grouped[team.track]) {
      grouped[team.track].push(team);
    }
  }

  return grouped;
}
