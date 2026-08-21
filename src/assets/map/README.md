# 약도 이미지

`오시는 길` 섹션에 들어가는 손그림 약도입니다.
이 폴더의 `map.webp` 를 `src/components/Location.jsx` 가 직접 import 합니다.

바꾸려면 같은 이름으로 덮어쓰거나, 파일명을 바꿨다면 Location.jsx 의 import 도 함께 고치세요.
원본(1296×677 PNG, 519KB)을 아래와 같이 줄였습니다.

```sh
magick 원본.png -strip -quality 88 -define webp:method=6 map.webp
```
