# 디자인 원본 보관함

사이트에 쓰이는 완성 시안 이미지의 **보관용 사본**입니다.
빌드에 포함되지 않습니다(`src/`·`public/` 밖이라 Vite 가 건드리지 않음).
나중에 문구를 고치거나 다시 뽑을 때 여기서 꺼내 쓰세요.

**`*-original.png` 은 `.gitignore` 에 걸어 두어 저장소에는 올라가지 않습니다**
(표지 원본만 42MB 라 히스토리가 무거워집니다). 이 폴더에 파일로는 남아 있지만
클론한 다른 곳에는 없으니, 필요하면 원본을 다시 받아 같은 이름으로 넣으세요.
아래 "가공 이력" 의 명령만 있으면 실제 사용 파일은 언제든 다시 뽑을 수 있습니다.

| 파일 | 어디에 쓰이나 | 실제 사용 파일 |
| --- | --- | --- |
| `01-intro-splash.jpg` (1023×1537) | 첫 화면(전환 전) 사진 | `src/assets/intro/splash.jpg` |
| `02-cover-header-original.png` (5464×8192, 2:3) | 표지 **원본** — 받은 그대로 | (빌드에 안 쓰임) |
| `02-cover-header.webp` (1200×1799, 2:3) | 표지 — 전환 후 첫 화면 | `src/assets/cover/cover.webp` |
| `03-footer.webp` (892×1764, 무손실) | 맨 아래 맺음말 | `src/assets/sections/footer.webp` |
| `04-favicon.png` (256×256) | 브라우저 탭·홈화면 아이콘 | `public/favicon.png`, `public/apple-touch-icon.png` |
| `05-map-original.png` (977×868) | 약도 **원본** — 받은 그대로 | `src/assets/map/map.webp` |

## 교체하는 법

- **첫 화면 사진**: `src/assets/intro/` 에 이미지를 넣으면 자동 인식됩니다.
- **표지**: `src/assets/cover/` 의 파일을 갈아끼웁니다(폴더에 하나만 두세요).
  화면을 꽉 채우려면 **9:16 비율**로 만드는 것이 좋습니다. 그보다 가로로 넓으면
  폭에 맞춰 줄어들어 화면 아래쪽이 비고, 잘라내면 가장자리 글자가 사라집니다.
- **약도**: `src/assets/map/map.webp` 를 갈아끼웁니다. 비율이 달라지면
  `src/components/Location.jsx` 의 `width`·`height` 도 같이 고쳐야 합니다
  (자리를 미리 잡아 두는 값이라 어긋나면 로딩 중에 레이아웃이 튑니다).
- **푸터**: `src/assets/sections/footer.webp` 를 갈아끼웁니다.
- **파비콘**: 정사각형 원본에서 `public/favicon.png`(256px)와
  `public/apple-touch-icon.png`(180px)를 만듭니다.

## 가공 이력 (원본과 다른 점)

- **표지**: 원본 PNG(`02-cover-header-original.png`, 5464×8192)를 폭 1200px 으로 줄여
  webp q85 로 변환한 것입니다(266KB). 프레임 폭이 최대 500px 이라 1200px 이면 2.4배로
  충분하고, 첫 화면에 바로 뜨는 이미지라 용량을 이 선에서 잡았습니다.

  ```sh
  magick 02-cover-header-original.png -resize 1200x \
    -strip -quality 85 -define webp:method=6 ../src/assets/cover/cover.webp
  ```

  2026-08-23 에 9:16(941×1672) 크롭에서 2:3 원본 비율로 교체했습니다. 세로가 짧아진
  만큼 첫 화면을 꽉 채우지는 않고 아래 여백에 다음 섹션이 살짝 보입니다.
  이전 9:16 파일은 `git show 708eb65:design/02-cover-header.webp` 로 꺼낼 수 있습니다.
- **푸터**: 여기 있는 `03-footer.webp` 는 받은 원본 PNG(892×1764)를 **무손실 webp 로만**
  바꾼 마스터입니다(픽셀 동일, 1.8MB → 1.3MB). 지색이 `#f6f3ec` 라 사이트 지색과 이미
  같아 색 보정은 하지 않았습니다.
  실제 사용 파일은 위에 여백 85px 을 덧대고 220px 에 걸쳐 지색으로 페이드해서 뽑습니다.
  소나무 가지가 위쪽 프레임에 맞닿아 잘린 자국을 빛에 바래는 것처럼 눕히는 처리입니다.
  (가지 **끝**은 프레임 안에 온전히 들어와 있어 페이드가 닿지 않습니다.)
  더 흐리게/덜 흐리게 하려면 아래 두 숫자만 함께 키우거나 줄이면 됩니다.

  ```sh
  magick 03-footer.webp \
    -background '#f6f3ec' -gravity north -splice 0x85 \
    \( -size 892x220 gradient:'#f6f3ec'-none \) -gravity north -composite \
    -strip -quality 86 -define webp:method=6 ../src/assets/sections/footer.webp
  ```

- **파비콘**: 원본(1254×1254)에서 반지 주변 여백을 잘라내(900×900) 확대한 뒤
  256px 로 줄이고 128색으로 양자화했습니다.
- **약도**: 2026-08-23 에 손그림 약도(1296×677)에서 선 약도(977×868)로 바꿨습니다.
  원본 크기 그대로 쓰되(표시 폭이 최대 452px 이라 2.2배) 바탕을 순백으로 끌어올립니다 —
  `mix-blend-mode: multiply` 로 종이 위에 깔리는 그림이라 바탕이 순백이 아니면
  그만큼 종이색을 눌러 약도 자리에 옅은 네모가 떠 보입니다.
  새 원본은 바탕이 이미 254 라 `-level` 은 한 칸만 밀어 올리면 됩니다.

  ```sh
  magick 05-map-original.png -strip -level '0%,99.6%' \
    -quality 88 -define webp:method=6 ../src/assets/map/map.webp
  ```

  이전 손그림 약도에는 "오시는 길" 제목과 이름·주소가 그림 안에 들어 있었지만
  새 약도에는 없습니다. 이름·주소는 `Location.jsx` 가 텍스트로 따로 보여줍니다.
  이전 파일은 `git show 708eb65:src/assets/map/map.webp` 로 꺼낼 수 있습니다.
- **장식 가지**(`src/assets/sections/branch.webp`): 달력 시안에서 잘라내
  배경을 투명 처리한 것입니다. 원본 시안은 남아 있지 않습니다.

푸터·파비콘의 원본 PNG(`푸터.png`, `파비콘.png`)는 Downloads 에서 이미 삭제되어
여기 있는 것이 현재 확보 가능한 최고 화질입니다. 표지·약도는 원본 PNG 를 확보해
`02-cover-header-original.png`(42MB)·`05-map-original.png` 로 넣어 두었습니다.
새로 만드시면 원본도 함께 이 폴더에 `*-original.png` 이름으로 넣어 두세요.
