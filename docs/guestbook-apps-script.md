# 방명록 · RSVP 백엔드 설정 (Google Apps Script)

방명록/참석여부를 **하객들과 실제로 공유**하려면 무료 백엔드가 필요합니다.
가장 간단한 방법은 Google 스프레드시트 + Apps Script 웹앱입니다. (서버 비용 0원)

설정하지 않아도 페이지는 정상 동작하며, 이 경우 데이터는 **접속한 기기(브라우저)에만**
저장됩니다(미리보기용).

## 1) 스프레드시트 만들기

1. [sheets.new](https://sheets.new) 로 새 스프레드시트 생성
2. 시트 2개 준비: `guestbook`, `rsvp` (탭 이름을 정확히)

## 2) Apps Script 코드 붙여넣기

스프레드시트 상단 메뉴 **확장 프로그램 → Apps Script** 열고 아래 코드로 교체:

```javascript
const SHEET = SpreadsheetApp.getActiveSpreadsheet()

function doGet(e) {
  if (e.parameter.action === 'list') {
    const sh = SHEET.getSheetByName('guestbook')
    const rows = sh.getDataRange().getValues().slice(1) // 헤더 제외
    const items = rows
      .map(r => ({ id: String(r[0]), name: r[1], message: r[2], ts: Number(r[4]) }))
      .reverse()
    return json({ items })
  }
  return json({ ok: true })
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents)
  if (body.action === 'guestbook') {
    SHEET.getSheetByName('guestbook').appendRow([
      body.id, body.name, body.message, body.password || '', body.ts,
    ])
  } else if (body.action === 'rsvp') {
    SHEET.getSheetByName('rsvp').appendRow([
      body.ts, body.side, body.name, body.attend, body.count, body.meal, body.phone || '',
    ])
  } else if (body.action === 'delete') {
    const sh = SHEET.getSheetByName('guestbook')
    const data = sh.getDataRange().getValues()
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][0]) === String(body.id) && String(data[i][3]) === String(body.password)) {
        sh.deleteRow(i + 1)
        break
      }
    }
  }
  return json({ ok: true })
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
```

## 3) 웹앱으로 배포

1. 우측 상단 **배포 → 새 배포**
2. 유형: **웹 앱**
3. 실행 계정: **나**, 액세스 권한: **모든 사용자**
4. 배포 후 나오는 **웹 앱 URL** (`https://script.google.com/macros/s/XXXX/exec`) 복사

## 4) config 에 붙여넣기

`src/config.js`:

```js
guestbook: { enabled: true, endpoint: 'https://script.google.com/macros/s/XXXX/exec' },
rsvp: { enabled: true, endpoint: '' }, // 비우면 위 guestbook endpoint 를 함께 사용
```

커밋/푸시하면 자동 배포됩니다. 이제 방명록/RSVP가 스프레드시트에 쌓입니다.
