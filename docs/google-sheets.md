# 성장진단 신청 → 구글 시트 연결

폼 제출이 구글 시트에 한 줄씩 쌓이도록 연결하는 방법입니다.
**구글 계정만 있으면 되고, 별도 비용이나 외부 서비스가 없습니다.**

동작 방식은 간단합니다. 사이트에서 폼이 제출되면 → Vercel의 API가
구글 Apps Script로 데이터를 보내고 → Apps Script가 시트에 한 줄을 추가합니다.
동시에 이메일 알림도 보내지므로, **시트에는 기록이 쌓이고 메일로는 즉시 알림**을 받습니다.

---

## 1단계. 시트 만들기

1. [sheets.new](https://sheets.new) 로 새 스프레드시트를 만듭니다.
2. 이름을 알아보기 쉽게 바꿉니다. 예: `그리온 성장진단 신청`
3. 첫 번째 시트 탭 이름을 **`신청`** 으로 바꿉니다.
   (다른 이름을 쓰려면 아래 스크립트의 `SHEET_NAME` 값도 같이 바꾸세요.)

## 2단계. Apps Script 붙여넣기

시트 상단 메뉴에서 **확장 프로그램 → Apps Script** 를 엽니다.
기본으로 들어 있는 코드를 **전부 지우고** 아래를 붙여넣습니다.

```javascript
// ── 설정 ──────────────────────────────────────────────
const SHEET_NAME = '신청';
// 아래 값을 길고 무작위한 문자열로 바꾸세요. (예: 비밀번호 생성기)
// Vercel 환경변수 SHEETS_WEBHOOK_TOKEN 에 똑같은 값을 넣어야 합니다.
const SECRET_TOKEN = '여기에-길고-무작위한-문자열을-넣으세요';
// ─────────────────────────────────────────────────────

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // 토큰이 다르면 무시합니다. (주소가 유출돼도 아무나 못 씀)
    if (SECRET_TOKEN && body.token !== SECRET_TOKEN) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // 시트가 비어 있으면 헤더를 먼저 만듭니다.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['신청일시'].concat(body.headers || []));
      sheet.getRange(1, 1, 1, sheet.getLastColumn())
           .setFontWeight('bold')
           .setBackground('#e5e8fe');
      sheet.setFrozenRows(1);
    }

    // 한국 시간으로 기록합니다.
    const when = Utilities.formatDate(
      new Date(body.submittedAt || Date.now()),
      'Asia/Seoul',
      'yyyy-MM-dd HH:mm:ss'
    );

    sheet.appendRow([when].concat(body.values || []));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

**`SECRET_TOKEN` 값을 반드시 바꾸세요.** 이게 있어야 주소가 유출돼도
남이 시트에 아무 데이터나 밀어 넣을 수 없습니다.

## 3단계. 웹 앱으로 배포

1. 우측 상단 **배포 → 새 배포** 클릭
2. 톱니바퀴(유형 선택) → **웹 앱** 선택
3. 설정:
   - **설명**: `그리온 진단 폼 수신` (아무거나)
   - **다음 사용자로 실행**: **나**
   - **액세스 권한이 있는 사용자**: **모든 사용자**
4. **배포** 클릭 → 권한 승인 요청이 뜨면 허용합니다.
   (「이 앱은 확인되지 않았습니다」 경고가 나오면 **고급 → (안전하지 않음) 이동**
   을 눌러 진행하세요. 본인이 방금 만든 스크립트라 정상입니다.)
5. 마지막에 나오는 **웹 앱 URL** 을 복사합니다.
   `https://script.google.com/macros/s/AKfyc.../exec` 형태입니다.

> 나중에 스크립트를 수정하면 **배포 → 배포 관리 → 편집(연필) → 버전: 새 버전 → 배포**
> 를 해야 반영됩니다. 새로 "새 배포"를 하면 URL이 바뀌니 주의하세요.

## 4단계. Vercel에 환경변수 넣기

Vercel → `grion-company` 프로젝트 → **Settings → Environment Variables**

| 변수 | 값 |
| --- | --- |
| `SHEETS_WEBHOOK_URL` | 3단계에서 복사한 웹 앱 URL |
| `SHEETS_WEBHOOK_TOKEN` | 2단계에서 정한 `SECRET_TOKEN` 과 **똑같은** 값 |

입력 후 **Deployments → 최신 배포 → ⋯ → Redeploy** 해야 반영됩니다.

## 5단계. 테스트

배포된 사이트에서 폼을 실제로 한 번 끝까지 제출해보세요.
시트에 헤더와 함께 한 줄이 추가되면 성공입니다.

안 들어오면 Vercel → 해당 배포 → **Logs** 에서 `[api/diagnosis]` 로 시작하는
줄을 확인하세요. 원인이 그대로 찍힙니다.

---

## 이메일 알림도 같이 받으려면 (선택)

시트만으로도 충분하지만, 신청이 들어온 걸 바로 알고 싶다면
[resend.com](https://resend.com) 무료 가입 후 아래 두 개를 추가하세요.

| 변수 | 값 |
| --- | --- |
| `RESEND_API_KEY` | Resend에서 발급받은 키 |
| `DIAGNOSIS_NOTIFY_EMAIL` | 알림 받을 이메일 주소 |

**둘 중 하나만 설정해도 폼은 정상 작동합니다.** 시트와 이메일은 서로 독립적으로
시도되고, 하나라도 성공하면 신청자에게는 완료 화면이 보입니다.
둘 다 실패한 경우에만 에러가 표시되며, 그때도 입력값 전체가 Vercel 로그에
남으므로 신청이 완전히 사라지지는 않습니다.

---

## 시트에 쌓이는 항목

| 열 | 내용 |
| --- | --- |
| 신청일시 | 한국 시간 |
| 대표자 또는 담당자명 · 업체명 · 업종 · 지역 · 연락처 · 현재 가장 큰 고민 | 1단계 필수 입력 |
| 현재 월평균 매출 · 목표 월매출 · 현재 주요 마케팅 채널 · 월 광고비 · 주요 고객 획득 경로 · 문의 또는 방문량 · 재방문·재구매 관련 상황 | 2단계 선택 입력 |
| 객단가 (계산기 입력) · 계산기가 표시한 확인 지점 | 히어로 계산기에서 넘어온 값 |

신청자가 계산기를 사용했다면 그 숫자와 병목 구간이 함께 넘어옵니다.
직접 적은 내용이 있으면 그쪽이 우선합니다.

> 열 순서는 코드(`app/api/diagnosis/route.ts` 의 `FIELD_LABELS`)와 맞춰져 있습니다.
> 항목을 추가할 때는 **중간에 끼워 넣지 말고 맨 뒤에 추가**하세요.
> 중간에 넣으면 기존 행의 열이 어긋납니다.
