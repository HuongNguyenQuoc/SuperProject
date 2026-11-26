import { Link } from 'react-router-dom';
import { HOME_MEDIA, ROUTES } from '../../config/site';
import { SiteHeader } from '../../components/layout/SiteHeader';
import { HERO_CONTENT } from './home.content';

import { useHeroIntro } from './useHeroIntro';

import buttons from '../../styles/buttons.module.css';
import layout from '../../styles/layout.module.css';
import motion from '../../styles/motion.module.css';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const hero = useHeroIntro();

  return (
    <section
      id="top"
      className={`${styles.hero} ${motion.gate}`}
      data-stage={hero.stage}
      aria-label="Giới thiệu"
    >
      <div className={`${styles.media} ${motion.heroMedia}`} aria-hidden="true">
        <div className={styles.bg} />
        <video
          ref={hero.videoRef}
          className={`${styles.video} ${hero.videoOff ? styles.videoOff : ''}`}
          src={hero.src}
          poster={HOME_MEDIA.poster}
          muted
          playsInline
          preload="none"
          onTimeUpdate={hero.onTimeUpdate}
          onEnded={hero.onEnded}
          onError={hero.onError}
        />
      </div>
      <div className={styles.haze} aria-hidden="true" />
      <div className={styles.blend} aria-hidden="true" />

      <SiteHeader variant="overlay" />

      <div className={`${styles.copy} ${motion.heroCopy}`}>
        <div className={`${layout.wrap} ${styles.row}`}>
          <div className={styles.text}>
            <p className={`${styles.eyebrow} ${motion.ln} ${motion.l1}`}>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              {HERO_CONTENT.eyebrow}
            </p>
            <h1 className={`${styles.title} ${motion.ln} ${motion.l2}`}>
              {HERO_CONTENT.titleBefore}
              <br />
              {HERO_CONTENT.titleAfterBreak} <em>{HERO_CONTENT.titleEm}</em>
              {HERO_CONTENT.titleEnd}
            </h1>
            <p className={`${styles.lead} ${motion.ln} ${motion.l3}`}>{HERO_CONTENT.lead}</p>
            <div className={`${styles.cta} ${motion.ln} ${motion.l4}`}>
              <Link className={`${buttons.btn} ${buttons.primary}`} to={ROUTES.create}>
                {HERO_CONTENT.primaryCta}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link className={buttons.linkU} to={ROUTES.templates}>
                {HERO_CONTENT.secondaryCta}
              </Link>
            </div>
          </div>

          {/* <InviteCard /> */}
        </div>
      </div>

      <div className={`${styles.skip} ${motion.introUi}`}>
        <button className={styles.skipBtn} type="button" onClick={hero.skip}>
          Bỏ qua
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 6l6 6-6 6M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <div className={`${styles.progress} ${motion.introUi}`} aria-hidden="true">
        <span
          className={styles.progressBar}
          style={{ width: `${Math.max(0, Math.min(100, hero.progress * 100))}%` }}
        />
      </div>
      <div className={`${styles.replay} ${motion.ln} ${motion.l5}`}>
        <button className={buttons.textBtn} type="button" onClick={hero.replay}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Xem lại đoạn mở cổng
        </button>
      </div>
    </section>
  );
}
