import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { TemplatesPage } from './pages/templates/TemplatesPage';
import { TemplatePreviewPage } from './pages/template-preview/TemplatePreviewPage';
import { TemplateDemoPage } from './pages/template-demo/TemplateDemoPage';
import { HomePage } from './features/home/HomePage';
import { AuthProvider } from './features/auth/AuthContext';
import { AuthModal } from './features/auth/AuthModal';
import { AuthRoute, RequireAuth } from './features/auth/AuthGuards';
import { CreateInvitationPage } from './features/create/CreateInvitationPage';
import { ROUTES } from './config/site';

export default function App() {
  return (
    <AuthProvider>
      <AuthModal />
      <Routes>
        {/* Demo toàn trang: nằm ngoài SiteLayout để không có header/padding của site */}
        <Route path="/mau-thiep/:slug/demo" element={<TemplateDemoPage />} />

        {/* Trang chủ: đứng ngoài SiteLayout, dùng SiteHeader/SiteFooter riêng */}
        <Route path="/" element={<HomePage />} />

        {/* Đăng nhập/đăng ký là modal, hai đường dẫn này chỉ mở modal */}
        <Route path={ROUTES.login} element={<AuthRoute mode="login" />} />
        <Route path={ROUTES.register} element={<AuthRoute mode="register" />} />

        <Route element={<SiteLayout />}>
          <Route
            path={ROUTES.create}
            element={
              <RequireAuth>
                <CreateInvitationPage />
              </RequireAuth>
            }
          />
          <Route path="/mau-thiep" element={<TemplatesPage />} />
          <Route path="/mau-thiep/:slug" element={<TemplatePreviewPage />} />
          <Route path="*" element={<Navigate to="/mau-thiep" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}