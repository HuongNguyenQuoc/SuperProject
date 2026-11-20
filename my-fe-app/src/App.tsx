import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';
import { TemplatesPage } from './pages/templates/TemplatesPage';
import { TemplatePreviewPage } from './pages/template-preview/TemplatePreviewPage';
import { TemplateDemoPage } from './pages/template-demo/TemplateDemoPage';
import { HomePage } from './features/home/HomePage';

export default function App() {
  return (
    <Routes>
      {/* Demo toàn trang: nằm ngoài SiteLayout để không có header/padding của site */}
      <Route path="/mau-thiep/:slug/demo" element={<TemplateDemoPage />} />

      {/* Trang chủ: đứng ngoài SiteLayout, dùng SiteHeader/SiteFooter riêng */}
      <Route path="/" element={<HomePage />} />

      <Route element={<SiteLayout />}>
        <Route path="/mau-thiep" element={<TemplatesPage />} />
        <Route path="/mau-thiep/:slug" element={<TemplatePreviewPage />} />
        <Route path="*" element={<Navigate to="/mau-thiep" replace />} />
      </Route>
    </Routes>
  );
}