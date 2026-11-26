import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { mediaService, type MediaDto } from '../../services/media.service';

// Khai báo ngoài hook để hàm không đổi giữa các lần render
const fetchMedia = (signal: AbortSignal, invitationId: string): Promise<MediaDto[]> =>
  mediaService.list(invitationId, signal).then((r) => r.data);

// Toàn bộ ảnh và nhạc của một thiệp
export function useMedia(invitationId: string) {
  const call = useCallApi(fetchMedia);
  const { run } = call;

  useEffect(() => {
    if (invitationId) void run(invitationId);
  }, [invitationId, run]);

  return {
    media: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
    reload: () => run(invitationId),
  };
}