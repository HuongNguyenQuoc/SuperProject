import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { useAuth, type AuthMode } from './AuthContext';

// /dang-nhap và /dang-ky: mở modal rồi quay về trang chủ
export function AuthRoute({ mode }: { mode: AuthMode }) {
  const { openAuth } = useAuth();

  useEffect(() => {
    openAuth(mode);
  }, [mode, openAuth]);

  return <Navigate to={ROUTES.home} replace />;
}

// Trang cần đăng nhập: chưa có user thì mở modal, đăng nhập xong quay lại đúng trang này
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, requireAuth } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) requireAuth(() => navigate(pathname));
  }, [user, requireAuth, navigate, pathname]);

  if (!user) return <Navigate to={ROUTES.home} replace />;
  return <>{children}</>;
}