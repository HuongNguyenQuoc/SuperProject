import { Link } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { BRAND_NAME, FOOTER_NAV, ROUTES } from '../../config/site';
import layout from '../../styles/layout.module.css';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${layout.wrap} ${styles.inner}`}>
        <div className={styles.row}>
          <div className={styles.brandCol}>
            <Link to={ROUTES.home} className={styles.brandLink} aria-label="Về trang chủ">
              <BrandLogo tone="rose" />
            </Link>
            <p className={styles.tagline}>Thiệp cưới online cho những đôi yêu nhau theo cách của riêng mình.</p>
          </div>

          <div className={styles.navs}>
            {FOOTER_NAV.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className={styles.head}>{group.title}</p>
                {group.links.map((link) =>
                  link.to.includes('#') ? (
                    <a key={link.label} href={link.to}>{link.label}</a>
                  ) : (
                    <Link key={link.label} to={link.to}>{link.label}</Link>
                  ),
                )}
              </nav>
            ))}
          </div>
        </div>
        <p className={styles.copy}>© 2026 {BRAND_NAME}.</p>
      </div>
    </footer>
  );
}
