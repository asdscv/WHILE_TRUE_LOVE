// 인트로(전환 전 화면) 에셋
// -----------------------------------------------------------------
// 지금 첫 화면은 사진이 아니라 짧은 영상입니다. 아래 두 파일을 직접 물고 갑니다.
//
//   intro.mp4    실제로 보이는 영상 (1080×1620, 4.8초, 소리 없음)
//   poster.webp  그 영상의 첫 프레임. 영상이 뜨기 전 잠깐과, 자동재생이 막혔을 때
//                (아이폰 저전력 모드 등) 대신 보이는 판입니다. 첫 프레임 그대로라
//                영상이 시작되는 순간에도 화면이 튀지 않습니다.
//
// 영상을 갈아끼울 때는 poster 도 새 영상의 첫 프레임으로 다시 뽑고,
// config.intro.duration(= 영상 길이 + 200ms)도 함께 고쳐야 합니다.
// 뽑는 명령은 src/assets/intro/README.md 에 적어 두었습니다.
//
// splash.jpg 는 영상 이전에 쓰던 사진입니다. 지금은 화면에 쓰이지 않지만
// 보관용으로 같은 폴더에 남겨 두었습니다(빌드에도 포함되지 않습니다).

import introVideo from './assets/intro/intro.mp4'
import introPoster from './assets/intro/poster.webp'

export { introVideo, introPoster }
