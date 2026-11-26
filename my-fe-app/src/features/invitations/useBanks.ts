import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { invitationService, type BankDto } from '../../services/invitation.service';

const fetchBanks = (signal: AbortSignal): Promise<BankDto[]> =>
  invitationService.banks(signal).then((r) => r.data);

// Danh sách ngân hàng công khai, dùng cho phần mừng cưới
export function useBanks() {
  const call = useCallApi(fetchBanks);
  const { run } = call;

  useEffect(() => {
    void run();
  }, [run]);

  return {
    banks: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
  };
}