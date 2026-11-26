import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { invitationService, type InvitationDto } from '../../services/invitation.service';
import type { ApiResult } from '../../services/http';

// Khai báo ngoài hook để hàm không đổi giữa các lần render
const fetchList = (signal: AbortSignal): Promise<InvitationDto[]> =>
  invitationService.list(signal).then((r) => r.data);

const fetchOne = (signal: AbortSignal, id: string): Promise<ApiResult<InvitationDto>> =>
  invitationService.get(id, signal);

// Danh sách thiệp của người dùng
export function useInvitationList() {
  const call = useCallApi(fetchList);
  const { run } = call;

  useEffect(() => {
    void run();
  }, [run]);

  return {
    invitations: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
    reload: () => run(),
  };
}

// Một thiệp kèm etag (revision) để PATCH với If-Match
export function useInvitation(id: string) {
  const call = useCallApi(fetchOne);
  const { run } = call;

  useEffect(() => {
    if (id) void run(id);
  }, [id, run]);

  const result = call.data;
  return {
    invitation: result?.data ?? null,
    etag: result?.etag ?? null,
    error: call.error,
    loading: call.loading || (result === null && call.error === null),
    reload: () => run(id),
  };
}