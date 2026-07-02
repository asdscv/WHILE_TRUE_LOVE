# WHILE_TRUE_LOVE 💍

모바일 청첩장 (React + Vite). 백인제가옥 · 2026.10.18.

**배포 주소:** https://asdscv.github.io/WHILE_TRUE_LOVE/

---

## 빠른 시작

```bash
npm install       # 최초 1회
npm run dev       # 로컬 개발 서버 (http://localhost:5173)
npm run build     # 배포용 빌드 → dist/
npm run preview   # 빌드 결과 미리보기
```

## ✏️ 내가 수정할 곳

거의 모든 내용은 **`src/config.js` 한 파일**에서 바꿉니다.

| 하고 싶은 것 | 어디서 |
| --- | --- |
| 신랑신부·부모님 이름, 연락처 | `src/config.js` → `groom`, `bride` |
| 예식 일시·장소·지도 | `src/config.js` → `wedding` |
| 인사말 문구 | `src/config.js` → `greeting` |
| 축의금 계좌번호 | `src/config.js` → `account` |
| **사진 추가** | `src/assets/gallery/` 폴더에 이미지 넣기 (자동 인식, 수십 장 OK) |
| **배경음악 변경** | `public/bgm/` 에 mp3 넣고 `config.bgm.file` 수정 |
| 방명록/RSVP 실제 저장 | `docs/supabase-setup.md` 참고 후 `config.supabase` 에 url·anonKey 입력 |
| 공유 미리보기 이미지 | `public/og.jpg` 로 이미지 저장 |

## 💌 계좌 있는 링크 / 없는 링크 (두 버전)

계좌 포함 여부는 **URL 로 구분**합니다. (하객에게 보이는 버튼 없이 링크만 다르게 공유)

- 계좌 **없는** 링크 (기본): `https://asdscv.github.io/WHILE_TRUE_LOVE/`
- 계좌 **있는** 링크: `https://asdscv.github.io/WHILE_TRUE_LOVE/?account=on`

가까운 친지에게는 `?account=on` 링크를, 그 외에는 기본 링크를 공유하면 됩니다.
기본 노출 여부는 `config.account.defaultVisible` 로 조정할 수 있습니다.

> 개발 중에는 화면 하단의 **미리보기 토글**로 두 버전을 딸깍 전환해 확인할 수 있습니다.
> (이 토글은 배포본에는 나타나지 않습니다.)

## 📷 사진

`src/assets/gallery/` 에 이미지를 넣기만 하면 갤러리에 자동 반영됩니다.
순서는 파일명 오름차순(`01.jpg`, `02.jpg` …), 첫 사진은 메인 배경으로도 쓰입니다.
폴더가 비어 있으면 임시 이미지가 표시됩니다.

## 🎵 배경음악

`public/bgm/` 에 mp3 를 넣고 `config.bgm.file` 을 파일명으로 맞추세요.
페이지 진입 시 재생되며(브라우저 정책상 첫 터치 후 소리 시작), 우측 상단 ♪ 버튼으로 제어합니다.

## 🚀 배포 (GitHub Pages)

`main` 브랜치에 푸시하면 `.github/workflows/deploy.yml` 이 자동으로 빌드·배포합니다.
최초 1회, 리포지토리 **Settings → Pages → Source 를 "GitHub Actions"** 로 설정하세요.

## 폴더 구조

```
src/
  config.js            # ⭐ 모든 내용 설정
  gallery.js           # 사진 자동 로더
  App.jsx              # 섹션 조립
  components/          # 각 섹션 컴포넌트
  lib/                 # 저장소·URL 유틸
docs/
  supabase-setup.md          # 방명록/RSVP 영속화(Supabase) 설정법
```
