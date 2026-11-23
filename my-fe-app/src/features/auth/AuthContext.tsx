import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type SocialProvider = 'google' | 'facebook';
export type AuthMode = 'login' | 'register';

export type AuthUser = {
  name: string;
  email: string;
  provider: 'email' | SocialProvider;
};

type AuthContextValue = {
  user: AuthUser | null;
  authMode: AuthMode | null;
  openAuth: (mode?: AuthMode, onSuccess?: () => void) => void;
  switchAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  requireAuth: (action: () => void) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Bản giả lập: chưa có backend, trạng thái chỉ giữ trong bộ nhớ (tải lại trang là mất).
// Khi có Supabase hoặc Firebase, thay phần thân các hàm bằng lời gọi thật.
const fakeDelay = () => new Promise((resolve) => setTimeout(resolve, 400));

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  // Hành động cần làm sau khi đăng nhập xong, ví dụ đi tới trang tạo thiệp
  const afterAuthRef = useRef<(() => void) | null>(null);

  const openAuth = useCallback((mode: AuthMode = 'login', onSuccess?: () => void) => {
    afterAuthRef.current = onSuccess ?? null;
    setAuthMode(mode);
  }, []);

  // Đổi qua lại giữa đăng nhập và đăng ký, không xóa hành động đang chờ
  const switchAuth = useCallback((mode: AuthMode) => setAuthMode(mode), []);

  const closeAuth = useCallback(() => {
    afterAuthRef.current = null;
    setAuthMode(null);
  }, []);

  const finishAuth = useCallback(() => {
    const next = afterAuthRef.current;
    afterAuthRef.current = null;
    setAuthMode(null);
    next?.();
  }, []);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (user) action();
      else openAuth('login', action);
    },
    [user, openAuth],
  );

  const login = useCallback(
    async (email: string, _password: string) => {
      await fakeDelay();
      setUser({ name: email.split('@')[0], email, provider: 'email' });
      finishAuth();
    },
    [finishAuth],
  );

  const loginWithSocial = useCallback(
    async (provider: SocialProvider) => {
      await fakeDelay();
      setUser({ name: 'Khách mới', email: `demo@${provider}.local`, provider });
      finishAuth();
    },
    [finishAuth],
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      await fakeDelay();
      setUser({ name, email, provider: 'email' });
      finishAuth();
    },
    [finishAuth],
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, authMode, openAuth, switchAuth, closeAuth, requireAuth, login, loginWithSocial, register, logout }),
    [user, authMode, openAuth, switchAuth, closeAuth, requireAuth, login, loginWithSocial, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}