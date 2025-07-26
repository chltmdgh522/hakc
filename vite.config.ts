// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
//
// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     host: true,
//     proxy: {
//       '/api': {
//         target: 'https://flow.madras.p-e.kr',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   },
//   esbuild: {
//     // TypeScript 오류를 무시하고 빌드 진행
//     ignoreAnnotations: true
//   },
//   build: {
//     // 빌드 시 TypeScript 검사 건너뛰기
//     rollupOptions: {
//       onwarn(warning, warn) {
//         // 모든 경고 무시
//         return;
//       }
//     }
//   }
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined, // 자동 청킹 사용
      },
      external: [], // 외부 의존성 없음
    },
    chunkSizeWarningLimit: 2000,
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  }
})