import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

// Khung chung cho các trang bên trong (mẫu thiệp, chi tiết mẫu...)
export function SiteLayout() {
  return (
    <>
      <SiteHeader variant="page" />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}