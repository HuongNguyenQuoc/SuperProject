import { SiteFooter } from '../../components/layout/SiteFooter';
import { BlendZone, CtaSection, FeaturesSection, StatementSection, StepsSection } from './HomeSections';
import { HeroSection } from './HeroSection';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <BlendZone>
        <StatementSection />
        <StepsSection />
        <FeaturesSection />
      </BlendZone>
      <CtaSection />
      <SiteFooter />
    </div>
  );
}
