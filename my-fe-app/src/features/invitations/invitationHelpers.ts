import { ApiError } from '../../services/http';
import type { InvitationDto } from '../../services/invitation.service';

export const SLUG_MIN = 3;
export const SLUG_MAX = 60;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Bỏ dấu tiếng Việt, đưa về chữ thường, mọi ký tự lạ thành dấu gạch ngang.
// Giữ nguyên dấu gạch ngang ở cuối để người dùng gõ tiếp được.
export function normalizeSlugInput(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .slice(0, SLUG_MAX);
}

// Dùng cho gợi ý từ tiêu đề: bỏ luôn gạch ngang đầu và cuối
export function slugify(value: string): string {
  return normalizeSlugInput(value).replace(/-+$/, '');
}

// Trả về thông báo lỗi tiếng Việt, hoặc null nếu slug hợp lệ về định dạng
export function validateSlug(value: string): string | null {
  if (value.length < SLUG_MIN) return `Đường dẫn cần ít nhất ${SLUG_MIN} ký tự`;
  if (value.length > SLUG_MAX) return `Đường dẫn tối đa ${SLUG_MAX} ký tự`;
  if (!SLUG_PATTERN.test(value)) return 'Chỉ dùng chữ thường không dấu, số và dấu gạch ngang';
  return null;
}

// Thiệp đã đăng khi có published_at
export function isPublished(invitation: Pick<InvitationDto, 'published_at'>): boolean {
  return invitation.published_at !== null;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
}

// Thông báo khi lưu thất bại. 409/412: revision cũ. 428: thiếu If-Match.
export function saveErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 409 || err.status === 412) {
      return 'Thiệp vừa được sửa ở nơi khác. Tải lại trang rồi sửa lại.';
    }
    if (err.status === 428) return 'Thiếu phiên bản để lưu. Tải lại trang rồi thử lại.';
    return err.message;
  }
  return 'Không lưu được, thử lại sau.';
}