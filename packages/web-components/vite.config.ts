import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: 'src/inputs/mir-masked-input.ts',
      formats: ['es', 'cjs'],
    },
    outDir: './dist',
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    target: 'es2021',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ]
});