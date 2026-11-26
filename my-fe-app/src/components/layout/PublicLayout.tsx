import { Outlet } from 'react-router-dom';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

// Khung chung cho các trang có header và footer của site
export function PublicLayout() {
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