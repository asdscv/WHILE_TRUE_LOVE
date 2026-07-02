// 인트로 배경 이미지 로더
// src/assets/intro/ 에 이미지를 넣으면 그 사진을 인트로 배경으로 사용합니다.
// 폴더가 비어 있으면 커버(갤러리 첫 사진)와 "확실히 구분되는" 임시 이미지를 씁니다.
// (인트로 사진이 바뀌는지 한눈에 확인하기 좋도록 커버와 다른 이미지로 둡니다.)

const modules = import.meta.glob(
  './assets/intro/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const local = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((k) => modules[k])

// 커버와 겹치지 않는 별도 임시 이미지 (세로형)
const fallback = 'https://picsum.photos/seed/wtl-intro/900/1400'

export const introImage = local[0] || fallback
