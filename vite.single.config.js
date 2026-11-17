import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained HTML file (scripts, styles and fonts inlined) for sharing a preview.
// Uses in-memory routing, so it works inside a sandboxed frame.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: { 'import.meta.env.VITE_ROUTER': JSON.stringify('memory') },
  build: { outDir: 'dist-single', assetsInlineLimit: 100000000 },
});
