import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages(https://asdscv.github.io/WHILE_TRUE_LOVE/)에 배포하므로
// base 를 리포지토리 이름으로 지정합니다. 다른 곳(Vercel/Netlify/커스텀 도메인)에
// 배포하려면 아래 base 를 '/' 로 바꾸세요.
// https://vite.dev/config/
export default defineConfig({
  base: '/WHILE_TRUE_LOVE/',
  plugins: [react()],
})
