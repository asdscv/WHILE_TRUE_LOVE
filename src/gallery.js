// 갤러리 이미지 자동 로더
// -----------------------------------------------------------------
// src/assets/gallery/ 폴더에 이미지 파일(jpg/jpeg/png/webp)을 넣으면
// 여기서 자동으로 모두 불러옵니다. 파일명 오름차순으로 정렬됩니다.
// (예: 01.jpg, 02.jpg ... 순서를 정하고 싶으면 파일명 앞에 번호를 붙이세요.)
//
// 폴더가 비어 있는 동안에는 임시(placeholder) 이미지가 사용됩니다.

import { config } from './config'

const modules = import.meta.glob(
  './assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const localImages = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => modules[key])

// 임시 이미지 (실제 사진이 없을 때만 사용). 인터넷 연결 시 랜덤 사진을 보여줍니다.
const placeholders = Array.from(
  { length: config.gallery.placeholderCount ?? 12 },
  (_, i) => `https://picsum.photos/seed/wtl-${i + 1}/600/800`,
)

export const galleryImages = localImages.length > 0 ? localImages : placeholders
export const isPlaceholder = localImages.length === 0
