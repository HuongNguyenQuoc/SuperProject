import { APP_CONFIG } from '../config/app.config';

export type ApiErrorDetail = { field: string; code: string; message: string };

// Lỗi từ backend theo định dạng chung: { error: { code, message, details } }
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorDetail[];

  constructor(status: number, code: string, message: string, details: ApiErrorDetail[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  // false: không đính access token (đăng nhập, đăng ký, trang public)
  auth?: boolean;
};

export type ApiResult<T> = { data: T; etag: string | null };

// Access token chỉ giữ trong bộ nhớ, không lưu localStorage
let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

function url(path: string) {
  return `${APP_CONFIG.apiBaseUrl}${APP_CONFIG.apiPrefix}${path}`;
}

// Nhiều request cùng gặp 401 thì chỉ gọi refresh một lần
let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(url('/auth/refresh'), { method: 'POST', credentials: 'include' });
        if (!res.ok) return false;
        const body = (await res.json()) as { access_token: string };
        setAccessToken(body.access_token);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

const FALLBACK_MESSAGE = 'Có lỗi xảy ra, thử lại sau.';

// FastAPI trả 422 theo dạng { detail: [{ loc, msg, type }] }; các lỗi khác là { error: {...} }
type FastApiIssue = { loc?: (string | number)[]; msg?: string; type?: string };

async function readError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as {
      error?: { code?: string; message?: string; details?: ApiErrorDetail[] };
      detail?: unknown;
    };

    if (body.error) {
      return new ApiError(
        res.status,
        body.error.code ?? 'unknown_error',
        body.error.message ?? FALLBACK_MESSAGE,
        body.error.details ?? [],
      );
    }

    if (Array.isArray(body.detail)) {
      const details: ApiErrorDetail[] = (body.detail as FastApiIssue[]).map((issue) => ({
        field: (issue.loc ?? []).filter((part) => part !== 'body').join('.'),
        code: issue.type ?? 'invalid',
        message: issue.msg ?? '',
      }));
      const first = details[0];
      const message = first?.field ? `Dữ liệu chưa hợp lệ: ${first.field}.` : FALLBACK_MESSAGE;
      return new ApiError(res.status, 'validation_error', message, details);
    }

    return new ApiError(res.status, 'unknown_error', FALLBACK_MESSAGE);
  } catch {
    return new ApiError(res.status, 'unknown_error', FALLBACK_MESSAGE);
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
  retried = false,
): Promise<ApiResult<T>> {
  const { method = 'GET', body, headers = {}, signal, auth = true } = options;

  const finalHeaders: Record<string, string> = { ...headers };
  if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';
  if (auth && accessToken) finalHeaders['Authorization'] = `Bearer ${accessToken}`;

  const res = await fetch(url(path), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
    signal,
  });

  // Access token hết hạn: refresh rồi thử lại đúng một lần (không áp dụng cho chính /auth/)
  if (res.status === 401 && !retried && !path.startsWith('/auth/')) {
    const ok = await refreshSession();
    if (ok) return request<T>(path, options, true);
    onSessionExpired?.();
  }

  if (!res.ok) throw await readError(res);

  const etag = res.headers.get('ETag');
  if (res.status === 204) return { data: undefined as T, etag };
  return { data: (await res.json()) as T, etag };
}

// Chuỗi lỗi để hiển thị cho người dùng. Trả về null nếu không có lỗi.
export function getErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (err instanceof ApiError) return err.message;
  return 'Có lỗi xảy ra, thử lại sau.';
}