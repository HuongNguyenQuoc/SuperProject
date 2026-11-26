import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
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

// Trang cần đăng nhập. Chưa đăng nhập thì ở lại đúng trang này và hiện nút đăng nhập,
// không chuyển về trang chủ. Sau khi đăng nhập xong, user có giá trị và trang tự hiện nội dung.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, checking, openAuth } = useAuth();

  // Đang khôi phục phiên lúc tải trang: chưa biết có đăng nhập hay không
  if (checking) return null;

  if (!user) {
    return (
      <Container size="xs" py={80}>
        <Stack align="center" gap="md" ta="center">
          <Title order={2}>Cần đăng nhập</Title>
          <Text c="dimmed">Đăng nhập để tạo thiệp và xem các thiệp của bạn.</Text>
          <Group mt="sm">
            <Button color="pink" radius="md" onClick={() => openAuth('login')}>
              Đăng nhập
            </Button>
            <Button variant="outline" color="dark" radius="md" onClick={() => openAuth('register')}>
              Tạo tài khoản
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return <>{children}</>;
}