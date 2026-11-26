import { useEffect } from 'react';
import { useCallApi } from '../../hooks/useCallApi';
import { templateService, type TemplateDto } from '../../services/templates/template.service';

// Khai báo ngoài hook để hàm không đổi giữa các lần render
const listTemplates = (signal: AbortSignal, category?: string): Promise<TemplateDto[]> =>
  templateService.list({ category }, signal).then((r) => r.data);

const getTemplate = (signal: AbortSignal, key: string): Promise<TemplateDto> =>
  templateService.get(key, signal).then((r) => r.data);

// Danh sách mẫu. Đổi category thì tự tải lại.
export function useTemplates(category?: string) {
  const call = useCallApi(listTemplates);
  const { run } = call;

  useEffect(() => {
    void run(category);
  }, [category, run]);

  return { templates: call.data ?? [], error: call.error, loading: call.loading, reload: () => run(category) };
}

// Chi tiết một mẫu theo key. key rỗng thì không gọi.
export function useTemplate(key: string | undefined) {
  const call = useCallApi(getTemplate);
  const { run } = call;

  useEffect(() => {
    if (key) void run(key);
  }, [key, run]);

  return call;
}