import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Chỉ dùng khi chạy npm run dev. Production không có proxy, gọi thẳng VITE_API_URL.
const API_TARGET = "https://api-staging.ketduyen.me";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Khớp đúng các nhóm endpoint của API. (/|$) để /media không bị bắt nhầm bởi /me
      "^/(auth|me|templates|invitations|public|banks|health)(/|$)": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});