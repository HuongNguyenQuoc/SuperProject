import { useState } from 'react';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import { useAuth, type SocialProvider } from './AuthContext';
import styles from './auth.module.css';

// Nút đăng nhập mạng xã hội. Chưa nối SDK thật: sẽ gắn Google/Facebook khi có backend.
export function SocialButtons() {
  const { loginWithSocial } = useAuth();
  const [busy, setBusy] = useState<SocialProvider | null>(null);

  const handle = async (provider: SocialProvider) => {
    setBusy(provider);
    await loginWithSocial(provider);
    setBusy(null);
  };

  return (
    <div className={styles.social}>
      <button type="button" className={styles.socialBtn} disabled={busy !== null} onClick={() => handle('google')}>
        <IconBrandGoogle size={20} />
        Tiếp tục với Google
      </button>
      <button type="button" className={styles.socialBtn} disabled={busy !== null} onClick={() => handle('facebook')}>
        <IconBrandFacebook size={20} />
        Tiếp tục với Facebook
      </button>
    </div>
  );
}