import { BRAND_NAME } from '../../config/site';
import styles from './BrandLogo.module.css';

type Props = { tone?: 'ink' | 'rose' };

// Logo: hai vòng nhẫn lồng nhau + tên thương hiệu
export function RingsMark({ className }: { className?: string }) {
  return (
    <svg className={className} width="34" height="22" viewBox="0 0 34 22" fill="none" aria-hidden="true">
      <circle cx="12" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="22" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function BrandLogo({ tone = 'ink' }: Props) {
  return (
    <span className={`${styles.brand} ${tone === 'rose' ? styles.rose : ''}`}>
      <RingsMark className={styles.mark} />
      <span className={styles.name}>{BRAND_NAME}</span>
    </span>
  );
}
