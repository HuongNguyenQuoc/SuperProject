import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from './AuthContext';
import { SocialButtons } from './SocialButtons';
import buttons from '../../styles/buttons.module.css';
import styles from './auth.module.css';

type Props = { onSwitch: () => void };

export function LoginForm({ onSwitch }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // login() tự đóng modal khi xong
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await login(email, password);
  };

  return (
    <div className={styles.body}>
      <h2 className={styles.title}>Đăng nhập</h2>
      <p className={styles.subtitle}>Chào mừng bạn quay lại.</p>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Mật khẩu</span>
          <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className={`${buttons.btn} ${buttons.primary} ${styles.submit}`} disabled={submitting}>
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className={styles.divider}>hoặc</div>
      <SocialButtons />

      <p className={styles.switch}>
        Chưa có tài khoản?{' '}
        <button type="button" className={styles.linkBtn} onClick={onSwitch}>Đăng ký</button>
      </p>
    </div>
  );
}