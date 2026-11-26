import { SiteFooter } from '../../components/layout/SiteFooter';
import { BlendZone, CtaSection, FeaturesSection, StatementSection, StepsSection } from '../../features/home/HomeSections';
import { HeroSection } from '../../features/home/HeroSection';
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
