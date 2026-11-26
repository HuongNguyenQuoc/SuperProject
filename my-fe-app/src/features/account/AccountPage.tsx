import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Skeleton } from '@mantine/core';
import { useCallApi } from '../../hooks/useCallApi';
import { authService, type UserDto } from '../../services/auth.service';
import { getErrorMessage } from '../../services/http';
import styles from './AccountPage.module.css';

// Khai báo ngoài component để hàm không đổi mỗi lần render
const fetchMe = (signal: AbortSignal): Promise<UserDto> => authService.me(signal).then((r) => r.data);

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export function AccountPage() {
  const profile = useCallApi(fetchMe);

  useEffect(() => {
    void profile.run();
  }, [profile.run]);

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Tài khoản</h1>

      {profile.loading && !profile.data && <Skeleton height={180} radius="xl" />}
      {getErrorMessage(profile.error) && <p className={styles.error}>{getErrorMessage(profile.error)}</p>}

      {profile.data && (
        <section className={styles.card}>
          <Row label="Họ và tên" value={profile.data.full_name} />
          <Row label="Email" value={profile.data.email} />
          <Row label="Ngày tham gia" value={new Date(profile.data.created_at).toLocaleDateString('vi-VN')} />
        </section>
      )}
    </div>
  );
}