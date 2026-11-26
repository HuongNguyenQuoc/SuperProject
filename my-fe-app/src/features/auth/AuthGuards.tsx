import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { APP_CONFIG } from '../../config/app.config';
import { useAuth, type AuthMode } from './AuthContext';

// Mở modal theo chế độ, rồi chuyển về trang chưa đăng nhập
export function AuthRoute({ mode }: { mode: AuthMode }) {
  const { openAuth } = useAuth();

  useEffect(() => {
    openAuth(mode);
  }, [mode, openAuth]);

  return <Navigate to={APP_CONFIG.unAuthenticatedEntryPath} replace />;
}

export function LoginRoute() {
  return <AuthRoute mode="login" />;
}

export function RegisterRoute() {
  return <AuthRoute mode="register" />;
}

// Trang cần đăng nhập: đợi khôi phục phiên xong, chưa có user thì mở modal và quay lại đúng trang này
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, checking, requireAuth } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checking && !user) requireAuth(() => navigate(pathname));
  }, [user, checking, requireAuth, navigate, pathname]);

  if (checking) return null;
  if (!user) return <Navigate to={APP_CONFIG.unAuthenticatedEntryPath} replace />;
  return <>{children}</>;
}