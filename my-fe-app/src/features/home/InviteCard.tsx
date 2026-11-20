import { useState } from 'react';
import { RingsMark } from '../../components/brand/BrandLogo';
import { SAMPLE_INVITE } from './home.content';
import glass from '../../styles/glass.module.css';
import buttons from '../../styles/buttons.module.css';
import motion from '../../styles/motion.module.css';
import styles from './InviteCard.module.css';

// Thiệp mẫu đỉnh vòm. Nút "Sẽ đến / Tiếc quá" chỉ đổi trạng thái giao diện, chưa lưu.
export function InviteCard() {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);

  return (
    <aside className={`${glass.glass} ${styles.card} ${motion.rv} ${motion.d4}`} aria-label="Thiệp mẫu">
      <div className={styles.inner}>
        <RingsMark className={styles.mark} />
        <p className={styles.kicker}>{SAMPLE_INVITE.kicker}</p>
        <p className={styles.names}>
          {SAMPLE_INVITE.names}
          <br />
          <span>{SAMPLE_INVITE.and}</span> {SAMPLE_INVITE.nameSecond}
        </p>
        <p className={styles.date}>
          {SAMPLE_INVITE.dateLead} · <strong>{SAMPLE_INVITE.date}</strong> · {SAMPLE_INVITE.time}
        </p>
        <p className={styles.place}>{SAMPLE_INVITE.place}</p>
        <div className={styles.rsvp} role="group" aria-label="Trả lời thiệp">
          <button
            type="button"
            className={buttons.pill}
            aria-pressed={answer === 'yes'}
            onClick={() => setAnswer('yes')}
          >
            Sẽ đến
          </button>
          <button
            type="button"
            className={buttons.pill}
            aria-pressed={answer === 'no'}
            onClick={() => setAnswer('no')}
          >
            Tiếc quá
          </button>
        </div>
        <p className={styles.tag}>{SAMPLE_INVITE.tag}</p>
      </div>
    </aside>
  );
}
