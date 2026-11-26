import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { albumService, type AlbumDto } from '../../services/album.service';

const fetchAlbums = (signal: AbortSignal, invitationId: string): Promise<AlbumDto[]> =>
  albumService.list(invitationId, signal).then((r) => r.data);

// Danh sách album của một thiệp
export function useAlbums(invitationId: string) {
  const call = useCallApi(fetchAlbums);
  const { run } = call;

  useEffect(() => {
    if (invitationId) void run(invitationId);
  }, [invitationId, run]);

  return {
    albums: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
    reload: () => run(invitationId),
  };
}