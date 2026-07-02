// 표지(전환 후 첫 화면) 이미지 로더
// src/assets/cover/ 에 이미지를 넣으면 그 이미지를 표지로 사용합니다.
// (완성 시안 이미지를 그대로 전체화면으로 보여줍니다. 없으면 갤러리 첫 사진 사용.)
import { galleryImages } from './gallery'

const modules = import.meta.glob(
  './assets/cover/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const local = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((k) => modules[k])

export const coverImage = local[0] || galleryImages[0]
