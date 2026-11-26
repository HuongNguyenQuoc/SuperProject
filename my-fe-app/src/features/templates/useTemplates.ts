import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { templateService, type TemplateDto } from '../../services/template.service';

// Khai báo ngoài hook để hàm không đổi giữa các lần render
const listTemplates = (signal: AbortSignal): Promise<TemplateDto[]> =>
  templateService.list({}, signal).then((r) => r.data);

const getTemplate = (signal: AbortSignal, key: string): Promise<TemplateDto> =>
  templateService.get(key, signal).then((r) => r.data);

// Danh sách mẫu. loading = true cả trước lần tải đầu tiên (lúc data còn null).
export function useTemplates() {
  const call = useCallApi(listTemplates);
  const { run } = call;

  useEffect(() => {
    void run();
  }, [run]);

  return {
    templates: call.data ?? [],
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
    reload: () => run(),
  };
}

// Chi tiết một mẫu theo key. key rỗng thì không gọi.
export function useTemplate(key: string) {
  const call = useCallApi(getTemplate);
  const { run } = call;

  useEffect(() => {
    if (key) void run(key);
  }, [key, run]);

  return {
    data: call.data,
    error: call.error,
    loading: call.loading || (call.data === null && call.error === null),
  };
}