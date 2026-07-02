import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 커스텀 도메인(https://aeshin-jiyong.life/)은 루트에서 서빙되므로 base 는 '/'.
// (다시 asdscv.github.io/WHILE_TRUE_LOVE/ 로 되돌리려면 base 를 '/WHILE_TRUE_LOVE/' 로.)
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
