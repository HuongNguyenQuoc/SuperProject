import { ROUTES } from './site';

// Lấy từ .env.development hoặc .env.production. Thiếu thì báo lỗi ngay, không đoán URL.
const apiBaseUrl = import.meta.env.VITE_API_URL;
if (typeof apiBaseUrl !== 'string') {
  throw new Error('Thiếu VITE_API_URL: kiểm tra .env.development và .env.production');
}

export const APP_CONFIG = {
  authenticatedEntryPath: ROUTES.create,
  unAuthenticatedEntryPath: ROUTES.home,
  apiBaseUrl,
  apiPrefix: '',
} as const;