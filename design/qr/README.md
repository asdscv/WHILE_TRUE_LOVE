# QR 코드

| 파일 | 담긴 주소 | 용도 |
| --- | --- | --- |
| `invite-account-on.svg` / `.png` | `https://aeshin-jiyong.life/?account=on` | 초대용 링크(계좌·참석여부 포함). svg 는 인쇄물, png(1200×1200)는 카톡·이미지 공유용 |
| `meal-yudamheon.svg` / `.png` | `https://map.naver.com/p/entry/place/1936370536` | 식사 장소(유담헌) 네이버지도 링크. `design/print/meal-notice.html` 에 인라인으로 들어가 있습니다 |

- 오류정정 레벨 H(30%) — 인쇄 후 일부가 가려지거나 닳아도 인식됩니다.
- 단축 URL·QR 생성 서비스를 거치지 않고 주소를 QR 안에 직접 인코딩했습니다.
  중간에 끼는 서비스가 없으므로 만료되지 않고, 주소가 살아 있는 한 계속 동작합니다.
- 네이버 지도는 "검색결과" 링크(`/p/search/...`)보다 "장소 고유" 링크(`/p/entry/place/{id}`)가
  훨씬 짧아 QR 모듈이 성겨지고 인쇄 후 스캔이 더 잘 됩니다. 새로 QR 을 만들 때도 이 형식을 씁니다.

## 다시 만들려면

```sh
npx -y qrcode -e H -q 4 -t svg -o design/qr/invite-account-on.svg 'https://aeshin-jiyong.life/?account=on'
npx -y qrcode -e H -q 4 -w 1200 -t png -o design/qr/invite-account-on.png 'https://aeshin-jiyong.life/?account=on'

npx -y qrcode -e H -q 4 -t svg -o design/qr/meal-yudamheon.svg 'https://map.naver.com/p/entry/place/1936370536'
npx -y qrcode -e H -q 4 -w 1200 -t png -o design/qr/meal-yudamheon.png 'https://map.naver.com/p/entry/place/1936370536'
```

## 주의

- QR 위에 로고를 얹거나 색을 흐리게 바꾸면 인식률이 떨어집니다. 넣더라도 가운데 15% 이내로.
- 흰 여백(quiet zone)을 잘라내지 마세요. 인쇄 시 최소 2cm × 2cm 이상 권장.
