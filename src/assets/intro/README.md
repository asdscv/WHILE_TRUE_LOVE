# 인트로(전환 전 화면) 폴더

| 파일 | 무엇 |
| --- | --- |
| `intro.mp4` | 첫 화면에 재생되는 영상 (1080×1620, 4.8초, 소리 없음). 받은 원본 그대로입니다. |
| `poster.webp` | 그 영상의 **첫 프레임**. 영상이 뜨기 전과 자동재생이 막혔을 때 대신 보입니다. |
| `splash.jpg` | 영상 이전에 쓰던 사진. 지금은 화면에 쓰이지 않는 보관용입니다. |
| `intro.gif` | 같은 영상의 GIF 판. 쓰지 않습니다 — 아래 "GIF 대신 mp4 를 쓰는 이유" 참고. |

`src/intro.js` 가 `intro.mp4` 와 `poster.webp` 를 직접 import 합니다.
(예전처럼 폴더에 이미지를 넣으면 자동으로 잡히는 방식이 아닙니다.)

첫 화면은 **건너뛸 수 없습니다.** 영상 조작도, 탭해서 넘기기도 막혀 있어
`config.intro.duration` 이 끝나야만 넘어갑니다. 그래서 이 숫자가 곧 하객이
청첩장을 보기까지 기다리는 시간입니다 — 영상을 바꿀 때 특히 신경 써서 맞추세요.

## 영상을 갈아끼울 때

세 가지를 함께 맞춰야 합니다.

1. `intro.mp4` 를 덮어씁니다.
2. 첫 프레임으로 `poster.webp` 를 다시 뽑습니다.
   ```sh
   ffmpeg -v error -y -i intro.mp4 -vf "select=eq(n\,0)" -vframes 1 first.png
   magick first.png -strip -resize 810x -quality 75 -define webp:method=6 poster.webp
   ```
3. `src/config.js` 의 `intro.duration` 을 **영상 길이 + 200ms** 로 고칩니다.
   길이는 이렇게 잽니다.
   ```sh
   ffprobe -v error -show_entries format=duration -of csv=p=0 intro.mp4
   ```
   영상 맨 끝 프레임이 0.2초 머문 뒤 페이드가 시작됩니다. 이 숫자가 영상보다
   짧으면 영상이 끝나기 전에 화면이 걷히고, 너무 길면 마지막 프레임이 오래 멈춰 있습니다.

`config.themeColor.intro` 는 영상 맨 윗줄 색(`#838383`)입니다. 영상이 바뀌면
같이 맞춰야 아이폰 상단 상태바와 영상 사이에 색 경계가 보이지 않습니다.

## 화면에 앉히는 방식

영상은 `object-fit: contain` 으로 **잘리지 않게** 넣습니다. 문구
"Love, in the light" 가 화면 폭을 가로질러 들어가 있어서, `cover` 로 꽉 채우면
세로로 긴 폰에서 좌우가 30% 넘게 잘려 문구 뒷부분과 사람 한 명이 통째로 날아갑니다.

대신 위아래에 여백이 생기는데, `.intro`·`.intro__card` 의 배경을 영상 맨 윗줄
(`#838383`)에서 맨 아랫줄(`#3e3e3e`)로 흐르는 그라데이션으로 깔아 두어 여백과
영상이 만나는 경계가 눈에 띄지 않습니다. 영상을 갈아끼우면 이 두 색도 다시 재세요.

```sh
magick first.png -crop 1080x16+0+0 +repage -resize 1x1! -format '#%[hex:p{0,0}]' info:   # 윗줄
magick first.png -gravity south -crop 1080x16+0+0 +repage -resize 1x1! -format '#%[hex:p{0,0}]' info:  # 아랫줄
```

## GIF 대신 mp4 를 쓰는 이유

같은 4.8초 영상을 GIF 로 뽑은 `intro.gif` 도 함께 두었지만 쓰지 않습니다.
모든 항목에서 mp4 가 낫습니다.

| | `intro.mp4` | `intro.gif` |
| --- | --- | --- |
| 용량 | **632KB** | 722KB |
| 크기 | **1080×1620** | 720×1080 |
| 프레임 | **30fps** | 20fps |
| 색 | **24비트** | 127색 (GIF 한계) |

GIF 가 유리한 점은 자동재생이 절대 막히지 않는다는 것 하나입니다(아이폰 저전력
모드에서는 muted 영상도 재생이 멈춥니다). 그 경우엔 `poster.webp`(첫 프레임)가
대신 보이도록 해 두었습니다.
