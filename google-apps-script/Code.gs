/**
 * 은평 AX SUMMIT 2026 모바일 투표 시스템 - Google Apps Script Backend
 * 
 * [ 사용 방법 ]
 * 1. Google Sheets에서 [확장 프로그램] > [Apps Script] 클릭
 * 2. 기존 코드를 모두 삭제하고 이 파일(Code.gs)의 내용을 복사하여 붙여넣습니다.
 * 3. [배포] > [새 배포] 클릭
 * 4. 유형 선택: [웹 앱 (Web App)]
 * 5. 설정:
 *    - 설명: AX SUMMIT 2026 투표 API
 *    - 다음 사용자 권한으로 실행: [나 (Me)]
 *    - 액세스 권한이 있는 사용자: [모든 사용자 (Anyone)]  <-- 필수!
 * 6. [배포] 버튼 클릭 후 발급된 "웹 앱 URL (Web App URL)"을 복사합니다.
 * 7. Vercel 환경변수 또는 .env에 VITE_APPS_SCRIPT_URL 값으로 설정합니다.
 */

// 팀 후보 데이터
var TEAMS_DATA = [
  { id: 'team-01', number: '01', title: 'Implant Verification System', department: '수술간호B', presenter: '강서영 UM' },
  { id: 'team-02', number: '02', title: 'AI Wanted OFF App', department: '수술물류Unit', presenter: '곽수빈 UM' },
  { id: 'team-03', number: '03', title: '밥밥이', department: '특수간호팀', presenter: '최대원 선임' },
  { id: 'team-04', number: '04', title: 'EnTriage', department: '특수간호팀', presenter: '최대원 선임' },
  { id: 'team-05', number: '05', title: '스마트 널스 스케줄러', department: '간호부', presenter: '신윤주 JM' },
  { id: 'team-06', number: '06', title: '간호사 통합 관리 시스템', department: '간호부', presenter: '김예일 UM' },
  { id: 'team-07', number: '07', title: 'PolyCheck', department: '약제부', presenter: '김수연 책임' },
  { id: 'team-08', number: '08', title: 'HEAR', department: '고객행복팀', presenter: '진달래 과장' },
  { id: 'team-09', number: '09', title: '외래 환자 맞춤 안내 AI', department: '외래간호팀', presenter: '정주안 선임' },
  { id: 'team-10', number: '10', title: 'CCR Scope', department: '수술물류Unit', presenter: '김은지 선임' },
  { id: 'team-11', number: '11', title: 'AI 기반 채용 업무 자동화 프로그램', department: '인사팀', presenter: '김세은 대리' },
  { id: 'team-12', number: '12', title: 'Smart KDRG Navigator', department: '적정진료관리팀', presenter: '김소리 책임' },
  { id: 'team-13', number: '13', title: '치과 스마트 에이전트', department: '치과', presenter: '이상화 교수팀' },
  { id: 'team-14', number: '14', title: 'nU 진료 연동 시연', department: '내분비내과', presenter: '조형일 Dr' }
];

/**
 * Votes 시트를 가져오거나 없으면 신규 생성하고 헤더행을 초기화합니다.
 */
function getOrCreateVotesSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Votes');
  if (!sheet) {
    sheet = ss.insertSheet('Votes');
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp',
      'voterId',
      'thirdId',
      'thirdTitle',
      'secondId',
      'secondTitle',
      'firstId',
      'firstTitle'
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#0A2E6D').setFontColor('#FFFFFF');
  }
  return sheet;
}

/**
 * POST 요청 처리 (투표 제출)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // 동시성 제어: 최대 10초 대기
    lock.waitLock(10000);
  } catch (err) {
    return createJsonResponse({
      success: false,
      error: '동시 투표 요청이 많습니다. 잠시 후 다시 시도해주세요.'
    });
  }

  try {
    var contents = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = {};
    try {
      data = JSON.parse(contents);
    } catch (parseErr) {
      data = e.parameter || {};
    }

    var voterId = data.voterId;
    var firstId = data.firstId || data.first;
    var secondId = data.secondId || data.second;
    var thirdId = data.thirdId || data.third;

    // 1. 필수 선택값 검사
    if (!voterId || typeof voterId !== 'string' || voterId.trim() === '') {
      return createJsonResponse({ success: false, error: '유효하지 않은 투표자 식별자(voterId)입니다.' });
    }

    if (!firstId || !secondId || !thirdId) {
      return createJsonResponse({ success: false, error: '1위, 2위, 3위 발표를 모두 선택해야 합니다.' });
    }

    // 2. 1, 2, 3위 중복 선택 검증
    if (firstId === secondId || secondId === thirdId || firstId === thirdId) {
      return createJsonResponse({ success: false, error: '1위, 2위, 3위 후보는 서로 다른 발표이어야 합니다.' });
    }

    // 3. 존재 후보 검증
    var firstTeam = findTeamById(firstId);
    var secondTeam = findTeamById(secondId);
    var thirdTeam = findTeamById(thirdId);

    if (!firstTeam || !secondTeam || !thirdTeam) {
      return createJsonResponse({ success: false, error: '선택한 후보 중 유효하지 않은 발표가 포함되어 있습니다.' });
    }

    var sheet = getOrCreateVotesSheet();
    var lastRow = sheet.getLastRow();

    // 4. voterId 중복 투표 검사
    if (lastRow > 1) {
      var voterIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (var i = 0; i < voterIds.length; i++) {
        if (String(voterIds[i][0]).trim() === String(voterId).trim()) {
          return createJsonResponse({
            success: false,
            error: '이미 투표에 참여하셨습니다. (1인 1회 투표만 가능)'
          });
        }
      }
    }

    // 5. 타임스탬프 및 행 추가
    var now = new Date();
    var timestampStr = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    sheet.appendRow([
      timestampStr,
      voterId,
      thirdTeam.id,
      thirdTeam.title,
      secondTeam.id,
      secondTeam.title,
      firstTeam.id,
      firstTeam.title
    ]);

    return createJsonResponse({
      success: true,
      message: '투표가 성공적으로 저장되었습니다.',
      data: {
        receipt: {
          id: 'vote-' + Math.random().toString(36).substring(2, 9),
          voterId: voterId,
          first: firstTeam.id,
          second: secondTeam.id,
          third: thirdTeam.id,
          timestamp: now.getTime(),
          firstTeam: firstTeam,
          secondTeam: secondTeam,
          thirdTeam: thirdTeam
        }
      }
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: '투표 저장 중 오류가 발생했습니다: ' + err.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET 요청 처리 (투표 제출 Fallback 및 결과 집계)
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

  // GET 방식 투표 제출 지원 (CORS 이슈 대응용)
  if (action === 'submitVote' || (e && e.parameter && e.parameter.voterId)) {
    return doPost(e);
  }

  // 투표 결과 집계 (Admin)
  try {
    var sheet = getOrCreateVotesSheet();
    var lastRow = sheet.getLastRow();
    var totalVoters = lastRow > 1 ? lastRow - 1 : 0;

    // 팀별 통계 초기화
    var scoreMap = {};
    for (var i = 0; i < TEAMS_DATA.length; i++) {
      var t = TEAMS_DATA[i];
      scoreMap[t.id] = {
        teamId: t.id,
        team: t,
        firstVotes: 0,
        secondVotes: 0,
        thirdVotes: 0,
        totalVotes: 0,
        totalScore: 0
      };
    }

    if (lastRow > 1) {
      var dataValues = sheet.getRange(2, 1, lastRow - 1, 8).getValues();
      for (var r = 0; r < dataValues.length; r++) {
        var row = dataValues[r];
        var thirdId = row[2];
        var secondId = row[4];
        var firstId = row[6];

        if (scoreMap[firstId]) {
          scoreMap[firstId].firstVotes += 1;
          scoreMap[firstId].totalVotes += 1;
          scoreMap[firstId].totalScore += 5;
        }

        if (scoreMap[secondId]) {
          scoreMap[secondId].secondVotes += 1;
          scoreMap[secondId].totalVotes += 1;
          scoreMap[secondId].totalScore += 3;
        }

        if (scoreMap[thirdId]) {
          scoreMap[thirdId].thirdVotes += 1;
          scoreMap[thirdId].totalVotes += 1;
          scoreMap[thirdId].totalScore += 1;
        }
      }
    }

    // 점수 집계 배열 생성 및 정렬 (총점 > 1위수 > 2위수 > 3위수 순)
    var resultsList = [];
    for (var k in scoreMap) {
      resultsList.push(scoreMap[k]);
    }

    resultsList.sort(function(a, b) {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.firstVotes !== a.firstVotes) return b.firstVotes - a.firstVotes;
      if (b.secondVotes !== a.secondVotes) return b.secondVotes - a.secondVotes;
      if (b.thirdVotes !== a.thirdVotes) return b.thirdVotes - a.thirdVotes;
      var numA = String((a.team && (a.team.number || a.team.id)) || '');
      var numB = String((b.team && (b.team.number || b.team.id)) || '');
      return numA.localeCompare(numB);
    });

    // 순위 할당 (총점, 1위표, 2위표, 3위표가 모두 동일한 경우에만 공동순위)
    var rankedResults = [];
    for (var idx = 0; idx < resultsList.length; idx++) {
      var item = resultsList[idx];
      var rank = idx + 1;
      var isTie = false;

      if (idx > 0) {
        var prev = resultsList[idx - 1];
        if (
          item.totalScore === prev.totalScore &&
          item.firstVotes === prev.firstVotes &&
          item.secondVotes === prev.secondVotes &&
          item.thirdVotes === prev.thirdVotes
        ) {
          rank = rankedResults[idx - 1].rank;
          isTie = true;
          rankedResults[idx - 1].isTie = true;
          rankedResults[idx - 1].rankDisplay = '공동 ' + rank + '위';
        }
      }

      item.rank = rank;
      item.isTie = isTie;
      item.rankDisplay = isTie ? ('공동 ' + rank + '위') : (rank + '위');

      rankedResults.push(item);
    }

    var now = new Date();
    var lastUpdatedStr = Utilities.formatDate(now, 'Asia/Seoul', 'HH:mm:ss');

    return createJsonResponse({
      success: true,
      data: {
        totalVoters: totalVoters,
        votingStatus: 'ACTIVE',
        lastUpdated: lastUpdatedStr,
        lastUpdatedTimestamp: now.getTime(),
        results: rankedResults
      }
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: '투표 결과 집계 중 오류가 발생했습니다: ' + err.toString()
    });
  }
}

function findTeamById(id) {
  for (var i = 0; i < TEAMS_DATA.length; i++) {
    if (TEAMS_DATA[i].id === id) return TEAMS_DATA[i];
  }
  return null;
}

function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
