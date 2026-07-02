# 인트로(첫 화면) 사진 폴더

이 폴더에 이미지 파일 **한 장**을 넣으면 첫 화면(스플래시) 배경으로 사용됩니다.
(비어 있으면 커버와 구분되는 임시 이미지가 사용됩니다.)

문구/전환 시간은 `src/config.js` 의 `intro` 에서 바꿉니다.

```js
intro: {
  enabled: true,
  duration: 3800,          // 자동 전환까지의 시간(ms)
  scriptText: "There's",   // 필기체 윗 문구
  title: 'A GREATEST DAY\nCOMING',
  caption: '',             // 비우면 "신랑 · 신부" 자동 표시
}
```
