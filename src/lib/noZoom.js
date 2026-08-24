// 사진 확대(핀치 줌) 차단
// -----------------------------------------------------------------
// 청첩장은 사진을 깔린 크기 그대로 보여주는 게 맞다고 보고, 손가락으로 키우는
// 동작을 전부 막는다. 막는 곳이 세 군데로 나뉘어 있어서 함께 봐야 한다.
//   1) index.html 뷰포트 meta 의 user-scalable=no — 안드로이드 크롬 등이 여기서 걸린다.
//   2) src/index.css 의 touch-action: manipulation — 두 번 탭해서 키우는 동작을 끈다.
//   3) 이 파일 — iOS 사파리는 1)을 접근성 이유로 일부러 무시하기 때문에,
//      웹킷 전용 gesture 이벤트를 직접 취소해야 두 손가락 확대가 멈춘다.
// 데스크톱 브라우저 확대(⌘+ / Ctrl+휠)는 건드리지 않는다 — 마우스로 보는 사람의
// 시력 보정까지 뺏을 이유는 없고, 요청도 손가락 핀치 쪽이었다.

export function lockZoom() {
  // 웹킷 전용 이벤트. 두 손가락이 닿는 순간 gesturestart 가 뜨고,
  // 여기서 막으면 뒤따르는 확대가 시작조차 하지 않는다.
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
    document.addEventListener(type, (e) => e.preventDefault(), {
      passive: false,
    })
  }

  // gesture 이벤트가 없는 브라우저용 보험.
  // 손가락이 둘 이상일 때만 막아서 한 손가락 스크롤은 그대로 둔다.
  document.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length > 1) e.preventDefault()
    },
    { passive: false },
  )
}
