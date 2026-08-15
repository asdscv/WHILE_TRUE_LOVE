// 모바일 브라우저가 상태표시줄 영역에 칠하는 색(theme-color)을 바꿔준다.
// 그 영역은 브라우저 소유라 사진을 그릴 수 없고, 색만 맞춰 이어져 보이게 할 수 있다.
export function setThemeColor(color) {
  if (typeof document === 'undefined') return
  let meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = 'theme-color'
    document.head.appendChild(meta)
  }
  meta.content = color
}
