import { request, refreshSession } from './http';

// Khớp với app/modules/auth/schemas.py
export type UserDto = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserDto;
};

export type RegisterBody = { email: string; password: string; full_name: string };
export type LoginBody = { email: string; password: string };

export const authService = {
  register: (body: RegisterBody) =>
    request<AuthTokenResponse>('/auth/register', { method: 'POST', body, auth: false }),

  login: (body: LoginBody) =>
    request<AuthTokenResponse>('/auth/login', { method: 'POST', body, auth: false }),

  logout: () => request<void>('/auth/logout', { method: 'POST', auth: false }),

  // Đổi refresh cookie lấy access token mới (dùng khi tải lại trang)
  refresh: refreshSession,

  me: (signal?: AbortSignal) => request<UserDto>('/me', { signal }),
};