import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: '/login',  
    // 👇 this ensures routing works on page reloads
    historyApiFallback: true
  }
});
