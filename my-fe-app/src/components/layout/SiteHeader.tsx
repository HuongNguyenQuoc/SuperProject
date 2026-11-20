import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { MAIN_NAV, ROUTES } from '../../config/site';
import glass from '../../styles/glass.module.css';
import buttons from '../../styles/buttons.module.css';
import layout from '../../styles/layout.module.css';
import styles from './SiteHeader.module.css';

type Props = {
  // overlay: nằm đè lên hero (trang chủ). page: nằm trên cùng, dính khi cuộn (các trang khác).
  variant?: 'overlay' | 'page';
};

// Mỗi liên kết: có dấu # thì dùng thẻ a thường để cuộn tới mục, còn lại dùng Link của router
function NavItem({ to, className, children, onClick }: { to: string; className: string; children: ReactNode; onClick?: () => void }) {
  if (to.includes('#')) {
    return <a className={className} href={to} onClick={onClick}>{children}</a>;
  }
  return <Link className={className} to={to} onClick={onClick}>{children}</Link>;
}

export function SiteHeader({ variant = 'overlay' }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Đóng menu điện thoại khi nhấn Esc hoặc bấm ra ngoài
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !toggleRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${variant === 'overlay' ? styles.overlay : styles.page}`}>
      <div className={`${layout.wrap} ${styles.inner}`}>
        <nav className={`${glass.glass} ${styles.nav}`} aria-label="Điều hướng chính">
          <Link to={ROUTES.home} className={styles.brand} aria-label="Về trang chủ">
            <BrandLogo />
          </Link>

          <div className={styles.links}>
            {MAIN_NAV.map((item) => (
              <NavItem key={item.label} to={item.to} className={styles.navLink}>
                {item.label}
              </NavItem>
            ))}
          </div>

          <div className={styles.actions}>
            <NavItem to={ROUTES.login} className={`${styles.navLink} ${styles.login}`}>
              Đăng nhập
            </NavItem>
            <NavItem to={ROUTES.create} className={`${buttons.btn} ${buttons.primary} ${buttons.sm}`}>
              Tạo thiệp
            </NavItem>
            <button
              ref={toggleRef}
              type="button"
              className={styles.menuBtn}
              aria-label={open ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div ref={menuRef} id="mobile-menu" className={styles.mobileMenu}>
            {MAIN_NAV.map((item) => (
              <NavItem key={item.label} to={item.to} className={styles.mobileLink} onClick={close}>
                {item.label}
              </NavItem>
            ))}
            <NavItem to={ROUTES.login} className={styles.mobileLink} onClick={close}>
              Đăng nhập
            </NavItem>
          </div>
        )}
      </div>
    </header>
  );
}
