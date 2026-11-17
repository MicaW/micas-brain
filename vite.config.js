import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps asset paths relative so the build also works from a sub-folder.
export default defineConfig({ plugins: [react()], base: './' });
