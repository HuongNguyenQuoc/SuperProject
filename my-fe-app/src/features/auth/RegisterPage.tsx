import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { AuthCard } from './AuthCard';
import { SocialButtons } from './SocialButtons';
import { useAuth } from './AuthContext';
import buttons from '../../styles/buttons.module.css';
import styles from './auth.module.css';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const mismatch = confirm.length > 0 && confirm !== password;
  const done = () => navigate(ROUTES.home, { replace: true });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mismatch) return;
    setSubmitting(true);
    await register(name, email, password);
    setSubmitting(false);
    done();
  };

  return (
    <AuthCard title="Đăng ký" subtitle="Tạo tài khoản để lưu và chỉnh thiệp của hai bạn.">
      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.field}>
          <span>Tên hiển thị</span>
          <input type="text" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Mật khẩu</span>
          <input type="password" required minLength={6} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Nhập lại mật khẩu</span>
          <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {mismatch && <p className={styles.error}>Mật khẩu nhập lại chưa khớp.</p>}
        <button type="submit" className={`${buttons.btn} ${buttons.primary} ${styles.submit}`} disabled={submitting || mismatch}>
          {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
        </button>
      </form>

      <div className={styles.divider}>hoặc</div>
      <SocialButtons onDone={done} />

      <p className={styles.switch}>
        Đã có tài khoản? <Link to={ROUTES.login}>Đăng nhập</Link>
      </p>
    </AuthCard>
  );
}