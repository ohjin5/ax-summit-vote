# 은평 AX SUMMIT 2026 모바일 투표 시스템

가톨릭대학교 은평성모병원 **은평 AX SUMMIT 2026**을 위한 실시간 모바일 투표 시스템입니다.
Google Apps Script Web App과 Google Sheets를 데이터 연동 백엔드로 사용합니다.

---

## 🌟 시스템 연동 구조

```text
스마트폰 사용자 (Client) 
  → Vercel 배포 웹 (AX SUMMIT 2026) 
  → Google Apps Script Web App (Code.gs) 
  → Google Sheets ('Votes' 시트)
```

- **실시간 저장**: 사용자가 3위 → 2위 → 1위 선택 후 제출하면 Google Apps Script를 통해 `Votes` 시트에 영구 기록됩니다.
- **중복 투표 방지**: 브라우저 고유 `voterId` 및 Apps Script 백엔드 중복 검증, `LockService` 동시성 처리 적용.
- **실시간 관리자 집계**: 1위 5점, 2위 3점, 3위 1점 가중치 자동 계산, 내림차순 정렬 및 동점자("공동 N위") 자동 처리.

---

## 📄 Google Apps Script & Google Sheets 설정 가이드

### 1. Google Spreadsheet 준비
1. [Google Sheets](https://sheets.google.com)에서 새 스프레드시트를 생성합니다.
2. 하단 시트 탭 이름을 `Votes`로 설정합니다. (대소문자 구문)
3. **1행 (Header)**에 다음 항목을 차례대로 작성합니다:
   ```text
   A1: timestamp | B1: voterId | C1: thirdId | D1: thirdTitle | E1: secondId | F1: secondTitle | G1: firstId | H1: firstTitle
   ```

### 2. Google Apps Script 등록
1. Google Sheet 상단 메뉴에서 **[확장 프로그램] > [Apps Script]**를 클릭합니다.
2. 기존 편집기 내용을 모두 삭제합니다.
3. 본 저장소의 `Code.gs` (또는 `google-apps-script/Code.gs`) 파일 전체 내용을 복사하여 붙여넣습니다.
4. 상단 💾 **저장** 버튼을 누릅니다.

### 3. Apps Script 웹 앱(Web App) 배포
1. 우측 상단 **[배포] > [새 배포]**를 클릭합니다.
2. 톱니바퀴 아이콘 ⚙️을 누르고 **[웹 앱 (Web App)]**을 선택합니다.
3. 설정값을 입력합니다:
   - **설명**: `AX SUMMIT 2026 투표 API`
   - **다음 사용자 권한으로 실행**: `나 (Me)`
   - **액세스 권한이 있는 사용자**: `모든 사용자 (Anyone)` ⚠️ **필수 선택**
4. **[배포]** 버튼을 클릭하고 접근 권한 승인 창이 뜨면 계정 승인을 완료합니다.
5. 발급된 **웹 앱 URL (Web App URL)**을 복사합니다.
   - 예시: `https://script.google.com/macros/s/AKfycbx.../exec`

---

### 4. Vercel 환경변수 (Environment Variables) 설정

Vercel 대시보드 > 프로젝트 > **Settings > Environment Variables**에서 아래 항목을 등록합니다.

| 환경변수 이름 | 설정값 | 비고 |
|---|---|---|
| `VITE_APPS_SCRIPT_URL` | 3단계에서 복사한 Apps Script 웹 앱 URL | 예: `https://script.google.com/macros/s/.../exec` |
| `ADMIN_PASSWORD` | 관리자 페이지 접속 비밀번호 | 예: `admin2026` |

---

### 5. 배포 및 테스트
1. GitHub 저장소를 Vercel에 연동하여 배포합니다.
2. 모바일 웹에서 투표 제출을 진행합니다.
3. 연결된 Google Sheets의 `Votes` 시트에 신규 데이터 행이 즉시 기록되는지 확인합니다.
4. 관리자 페이지(`?admin=true` 또는 관리자 버튼)에서 실시간 자동 집계 결과를 확인합니다.

---

## 🛠️ 개발 및 로컬 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 빌드 테스트
npm run build
```
