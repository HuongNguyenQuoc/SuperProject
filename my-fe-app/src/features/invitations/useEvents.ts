import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { eventService, type EventDto } from '../../services/event.service';

// Khai báo ngoài hook để hàm không đổi giữa các lần render
const fetchEvents = (signal: AbortSignal, invitationId: string): Promise<EventDto[]> =>
  eventService.list(invitationId, signal).then((r) => r.data);

// Danh sách sự kiện của một thiệp, đã sắp xếp theo thứ tự hiển thị
export function useEvents(invitationId: string) {
  const call = useCallApi(fetchEvents);
  const { run } = call;

  useEffect(() => {
    if (invitationId) void run(invitationId);
  }, [invitationId, run]);

  return {
    events: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
    reload: () => run(invitationId),
  };
}