import reactPlugin from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
// import pages from 'vite-plugin-pages'
import tsconfigPaths from 'vite-tsconfig-paths'
import macrosPlugin from 'vite-plugin-babel-macros'

export default defineConfig({
  plugins: [
    reactPlugin(),
    // pages(),
    tsconfigPaths(),
    macrosPlugin(),
    // linaria({
    //   include: ['**/*.t|j{s,sx}'],
    //   babelOptions: {
    //     presets: ['@babel/preset-typescript', '@babel/preset-react'],
    //   },
    // }),
  ],
  // test: {
  //   root: './',
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./config/setupTests.ts'],
  //   passWithNoTests: true,
  // },
  resolve: {
    alias: {
      // xoid: '@xoid/development',
      // '@xoid/react': '@xoid/development'
    },
  },
})
