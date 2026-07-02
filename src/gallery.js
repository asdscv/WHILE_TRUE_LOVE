// 갤러리 이미지 자동 로더
// -----------------------------------------------------------------
// src/assets/gallery/ 폴더에 이미지(jpg/jpeg/png/webp)를 넣으면 자동으로 모두
// 불러옵니다. 파일명 오름차순(예: 01.jpg, 02.jpg ...). 첫 사진은 표지 배경으로도 쓰입니다.
//
// 폴더가 비어 있는 동안에는 아래 "큐레이션된 임시 이미지"(우아한 웨딩/에디토리얼 톤,
// Unsplash)가 사용됩니다. 실제 사진을 넣으면 임시 이미지는 자동으로 사라집니다.

const modules = import.meta.glob(
  './assets/gallery/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' },
)

const localImages = Object.keys(modules)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((key) => modules[key])

// 톤이 일관된 큐레이션 임시 사진 (순서: 0=표지, 1=인사말, 2=포토밴드, 3=카운트다운, 그 외 갤러리)
const CURATED_IDS = [
  '1519741497674-611481863552', // 표지 — 커플 에디토리얼
  '1591604466107-ec97de577aff', // 인사말 — 커플
  '1596457221755-b96bc3a6df18', // 포토밴드 — 커플
  '1511795409834-ef04bbd61622', // 카운트다운 — 예식장 무드
  '1563808599481-34a342e44508', // 커플
  '1561848355-890d054dc55a', // 플로럴
  '1485700281629-290c5a704409', // 플로럴
  '1606800052052-a08af7148866', // 반지 디테일
  '1559982240-f760db87b822', // 플로럴
  '1519225421980-715cb0215aed', // 베뉴
  '1515934751635-c81c6bc9a2d8', // 디테일
  '1618237586696-d3690dad22e3', // 한옥
  '1505406165273-6631d6f7fc68', // 플로럴
  '1469371670807-013ccf25f16a', // 베뉴
  '1601721826401-c5e789be0be6', // 한옥
]
const u = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`
const placeholders = CURATED_IDS.map(u)

export const galleryImages = localImages.length > 0 ? localImages : placeholders
export const isPlaceholder = localImages.length === 0
