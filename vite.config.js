import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative so the build also works from a sub-folder.
// The app builds into dist/training/; the BRAIN homepage (home/index.html) is copied to dist/ after the build.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: 'dist/training', emptyOutDir: true },
});
