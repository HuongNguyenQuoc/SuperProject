import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { authService, type LoginBody, type RegisterBody, type UserDto } from '../../services/auth.service';
import { setAccessToken, setSessionExpiredHandler } from '../../services/http';

export type AuthMode = 'login' | 'register';
export type AuthUser = { id: string; name: string; email: string };

function toUser(dto: UserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.full_name.trim() || dto.email.split('@')[0],
  };
}

type AuthContextValue = {
  user: AuthUser | null;
  // true khi đang khôi phục phiên lúc tải trang: chưa biết có đăng nhập hay không
  checking: boolean;
  authMode: AuthMode | null;
  openAuth: (mode?: AuthMode, onSuccess?: () => void) => void;
  switchAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  requireAuth: (action: () => void) => void;
  login: (body: LoginBody) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  // Hành động cần làm sau khi đăng nhập xong, ví dụ đi tới trang tạo thiệp
  const afterAuthRef = useRef<(() => void) | null>(null);
  const restoredRef = useRef(false);

  // Khôi phục phiên khi tải lại trang: đổi refresh cookie lấy access token, rồi lấy thông tin tài khoản
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    (async () => {
      try {
        const ok = await authService.refresh();
        if (ok) {
          const { data } = await authService.me();
          setUser(toUser(data));
        }
      } catch {
        setAccessToken(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  // Khi phiên hết hạn hẳn (refresh cũng thất bại), đưa về trạng thái chưa đăng nhập
  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));
    return () => setSessionExpiredHandler(null);
  }, []);

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

  // Backend đã trả sẵn user trong response, không cần gọi /me thêm
  const login = useCallback(
    async (body: LoginBody) => {
      const { data } = await authService.login(body);
      setAccessToken(data.access_token);
      setUser(toUser(data.user));
      finishAuth();
    },
    [finishAuth],
  );

  const register = useCallback(
    async (body: RegisterBody) => {
      const { data } = await authService.register(body);
      setAccessToken(data.access_token);
      setUser(toUser(data.user));
      finishAuth();
    },
    [finishAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Dù máy chủ lỗi vẫn đăng xuất phía máy này
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      checking,
      authMode,
      openAuth,
      switchAuth,
      closeAuth,
      requireAuth,
      login,
      register,
      logout,
    }),
    [user, checking, authMode, openAuth, switchAuth, closeAuth, requireAuth, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong AuthProvider');
  return ctx;
}