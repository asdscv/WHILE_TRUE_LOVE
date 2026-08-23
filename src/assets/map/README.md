# 약도 이미지

`오시는 길` 섹션에 들어가는 약도입니다.
이 폴더의 `map.webp` 를 `src/components/Location.jsx` 가 직접 import 합니다.

바꾸려면 같은 이름으로 덮어쓰거나, 파일명을 바꿨다면 Location.jsx 의 import 도 함께 고치세요.
**비율이 달라지면 Location.jsx 의 `width`·`height` 도 같이 고쳐야 합니다** — 로딩 전에
자리를 잡아 두는 값이라 어긋나면 그림이 뜰 때 아래 내용이 밀립니다.

현재 파일은 원본(977×868 PNG, `design/05-map-original.png`)을 크기 그대로 변환한 것입니다.

`-level` 은 약도 바탕(254)을 순백으로 끌어올리는 처리입니다. 이 그림은
`mix-blend-mode: multiply` 로 종이 위에 깔리는데, 바탕이 순백이 아니면 그만큼
종이색을 어둡게 눌러 약도 자리에 옅은 네모가 떠 보입니다.

```sh
magick 원본.png -strip -level '0%,99.6%' -quality 88 -define webp:method=6 map.webp
```
