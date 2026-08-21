# 디자인 원본 보관함

사이트에 쓰이는 완성 시안 이미지의 **보관용 사본**입니다.
빌드에 포함되지 않습니다(`src/`·`public/` 밖이라 Vite 가 건드리지 않음).
나중에 문구를 고치거나 다시 뽑을 때 여기서 꺼내 쓰세요.

| 파일 | 어디에 쓰이나 | 실제 사용 파일 |
| --- | --- | --- |
| `01-intro-splash.jpg` (1023×1537) | 첫 화면(전환 전) 사진 | `src/assets/intro/splash.jpg` |
| `02-cover-header.webp` (941×1672, 9:16) | 표지 — 전환 후 첫 화면 | `src/assets/cover/cover.webp` |
| `03-footer.webp` (892×1764, 무손실) | 맨 아래 맺음말 | `src/assets/sections/footer.webp` |
| `04-favicon.png` (256×256) | 브라우저 탭·홈화면 아이콘 | `public/favicon.png`, `public/apple-touch-icon.png` |

## 교체하는 법

- **첫 화면 사진**: `src/assets/intro/` 에 이미지를 넣으면 자동 인식됩니다.
- **표지**: `src/assets/cover/` 의 파일을 갈아끼웁니다(폴더에 하나만 두세요).
  화면을 꽉 채우려면 **9:16 비율**로 만드는 것이 좋습니다. 그보다 가로로 넓으면
  폭에 맞춰 줄어들어 화면 아래쪽이 비고, 잘라내면 가장자리 글자가 사라집니다.
- **푸터**: `src/assets/sections/footer.webp` 를 갈아끼웁니다.
- **파비콘**: 정사각형 원본에서 `public/favicon.png`(256px)와
  `public/apple-touch-icon.png`(180px)를 만듭니다.

## 가공 이력 (원본과 다른 점)

- **표지**: 원본 PNG 를 webp q85 로 변환. 이 파일이 현재 남아 있는 최고 화질본입니다.
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
- **장식 가지**(`src/assets/sections/branch.webp`): 달력 시안에서 잘라내
  배경을 투명 처리한 것입니다. 원본 시안은 남아 있지 않습니다.

원본 PNG(`헤더.png`, `푸터.png`, `파비콘.png`)는 Downloads 에서 이미 삭제되어
여기 있는 것이 현재 확보 가능한 최고 화질입니다. 새로 만드시면 원본도 함께
이 폴더에 넣어 두세요.
