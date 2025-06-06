// vite.config.js
import { defineConfig } from 'vite'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // أضف هذا السطر أو تأكد من وجوده مع الامتدادات الصحيحة
    extensions: ['.mjs', '.js', '.jsx', '.json'] // أضف الامتدادات التي تستخدمها في مشروعك
  },
})