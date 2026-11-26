import { useEffect, useState } from 'react';
import { invitationService } from '../../services/invitation.service';
import { ApiError } from '../../services/http';
import { validateSlug } from './invitationHelpers';

export type SlugState = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error';
export type SlugStatus = { state: SlugState; message: string | null };

// Kiểm tra slug sau 400ms ngừng gõ.
// currentSlug: slug hiện tại của thiệp đang sửa, coi là hợp lệ.
export function useSlugAvailability(slug: string, currentSlug?: string): SlugStatus {
  const [status, setStatus] = useState<SlugStatus>({ state: 'idle', message: null });

  useEffect(() => {
    const value = slug.trim();

    if (!value) {
      setStatus({ state: 'idle', message: null });
      return;
    }
    if (value === currentSlug) {
      setStatus({ state: 'available', message: 'Đang dùng đường dẫn này' });
      return;
    }
    const problem = validateSlug(value);
    if (problem) {
      setStatus({ state: 'invalid', message: problem });
      return;
    }

    const controller = new AbortController();
    setStatus({ state: 'checking', message: 'Đang kiểm tra...' });

    const timer = window.setTimeout(() => {
      invitationService
        .slugAvailability(value, controller.signal)
        .then(({ data }) => {
          setStatus(
            data.available
              ? { state: 'available', message: 'Đường dẫn còn trống' }
              : { state: 'taken', message: data.reason ?? 'Đường dẫn này đã có người dùng' },
          );
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setStatus({
            state: 'error',
            message: err instanceof ApiError ? err.message : 'Không kiểm tra được đường dẫn',
          });
        });
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [slug, currentSlug]);

  return status;
}