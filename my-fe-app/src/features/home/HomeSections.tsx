import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HOME_MEDIA, ROUTES } from '../../config/site';
import { CTA_CONTENT, FEATURES_CONTENT, STATEMENT_CONTENT, STEPS_CONTENT } from './home.content';
import type { FeatureIcon } from './home.content';
import buttons from '../../styles/buttons.module.css';
import layout from '../../styles/layout.module.css';
import motion from '../../styles/motion.module.css';
import styles from './HomeSections.module.css';

const ICON_PROPS = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

const ICONS: Record<FeatureIcon, JSX.Element> = {
  check: (<svg {...ICON_PROPS}><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></svg>),
  pin: (<svg {...ICON_PROPS}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>),
  qr: (<svg {...ICON_PROPS}><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h2v2M20 14v6h-6v-2M17 17h1" /></svg>),
  photo: (<svg {...ICON_PROPS}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>),
  music: (<svg {...ICON_PROPS}><path d="M9 18V5l11-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="17" cy="16" r="3" /></svg>),
  book: (<svg {...ICON_PROPS}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M9 8h6M9 12h4" /></svg>),
};

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

// Lời dẫn: câu trích lớn và đoạn mô tả
export function StatementSection() {
  return (
    <section className={styles.statement} id="loi-moi">
      <div className={`${layout.wrap} ${styles.statementRow} ${motion.sdRise}`}>
        <p className={styles.quote}>{STATEMENT_CONTENT.quote}</p>
        <p className={styles.body}>{STATEMENT_CONTENT.body}</p>
      </div>
    </section>
  );
}

// Ba bước: ảnh cổng vòm bên trái, danh sách có đường kẻ bên phải
export function StepsSection() {
  return (
    <section className={styles.steps} id="cach-tao">
      <div className={`${layout.wrap} ${styles.stepsRow}`}>
        <div className={`${styles.stepsMedia} ${motion.sdUp}`}>
          <img
            className={`${styles.arch} ${styles.archGate}`}
            src={HOME_MEDIA.imageEnd}
            alt="Cổng vòm phủ hoa hồng dẫn vào khoảng sáng"
            loading="lazy"
            width={420}
            height={560}
          />
        </div>
        <div className={styles.stepsContent}>
          <h2 className={`${styles.sectionTitle} ${motion.sdRise}`}>{STEPS_CONTENT.title}</h2>
          <ol className={styles.stepList}>
            {STEPS_CONTENT.items.map((item, i) => (
              <li key={item.title} className={`${styles.step} ${motion.sdRise}`}>
                <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Tính năng: danh sách kiểu tạp chí, hai ảnh vòm lệch nhau
export function FeaturesSection() {
  return (
    <section className={styles.features} id="tinh-nang">
      <div className={`${layout.wrap} ${styles.featuresRow}`}>
        <div className={styles.featuresContent}>
          <h2 className={`${styles.sectionTitle} ${motion.sdRise}`}>{FEATURES_CONTENT.title}</h2>
          <p className={`${styles.featuresIntro} ${motion.sdRise}`}>{FEATURES_CONTENT.intro}</p>
          <ul className={styles.featureList}>
            {FEATURES_CONTENT.items.map((item) => (
              <li key={item.title} className={`${styles.feature} ${motion.sdRise}`}>
                {ICONS[item.icon]}
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.featuresMedia}>
          <img
            className={`${styles.arch} ${styles.archRoses} ${motion.sdUp}`}
            src={HOME_MEDIA.imageEnd}
            alt="Trụ hoa hồng leo bên cổng"
            loading="lazy"
            width={334}
            height={480}
          />
          <img
            className={`${styles.arch} ${styles.archLight} ${motion.sdDown}`}
            src={HOME_MEDIA.imageStart}
            alt="Giàn hoa rủ trong khoảng sáng sau cổng"
            loading="lazy"
            width={229}
            height={310}
          />
        </div>
      </div>
    </section>
  );
}

// Phần giữa: một lớp ảnh nhòe chạy xuyên lời dẫn, ba bước, tính năng
export function BlendZone({ children }: { children: ReactNode }) {
  return (
    <div className={styles.blendZone}>
      <div className={styles.softLayer} aria-hidden="true" />
      {children}
    </div>
  );
}

// Kêu gọi: khoảng sáng sau cổng, mờ dần hai đầu
export function CtaSection() {
  return (
    <section className={styles.cta} id="tao-thiep">
      <img className={`${styles.ctaImg} ${motion.ctaImg}`} src={HOME_MEDIA.imageStart} alt="" aria-hidden="true" loading="lazy" />
      <div className={`${styles.ctaBody} ${motion.sdRise}`}>
        <h2 className={styles.ctaTitle}>
          {CTA_CONTENT.titleBefore} <em>{CTA_CONTENT.titleEm}</em>
          {CTA_CONTENT.titleEnd}
        </h2>
        <p>{CTA_CONTENT.body}</p>
        <Link className={`${buttons.btn} ${buttons.primary}`} to={ROUTES.create}>
          {CTA_CONTENT.cta}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
