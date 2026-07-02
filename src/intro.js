// 인트로 배경 이미지 로더
// src/assets/intro/ 에 이미지를 넣으면 그 사진을, 없으면 갤러리 첫 사진을 사용합니다.
import { galleryImages } from './gallery'

const modules = import.meta.glob(
  './assets/intro/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const local = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((k) => modules[k])

export const introImage = local[0] || galleryImages[0]
