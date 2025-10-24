// In frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Tailwind and PostCSS are usually configured automatically or via postcss.config.js,
  // NOT through a direct @tailwindcss/vite import here.
});