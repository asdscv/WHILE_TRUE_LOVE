// 인트로 배경 이미지 로더
// src/assets/intro/ 에 이미지를 넣으면 그 사진을, 없으면 커버와 구분되는
// 큐레이션 임시 이미지(잔잔한 웨딩 무드)를 사용합니다.

const modules = import.meta.glob(
  './assets/intro/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const local = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((k) => modules[k])

const fallback =
  'https://images.unsplash.com/photo-1550784718-990c6de52adf?w=1200&q=80&auto=format&fit=crop'

export const introImage = local[0] || fallback
