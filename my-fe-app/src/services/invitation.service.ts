import { request } from './http';
import type { SectionKey } from './template.service';

// Khớp với schema trong đặc tả (tag invitations). Trường không khai báo bắt buộc thì để optional.

export type RecipientSide = 'groom' | 'bride';
export type BirthOrder = 'eldest' | 'middle' | 'youngest';

export type ParentDto = { full_name?: string | null; is_deceased?: boolean };

export type PersonDto = {
  full_name?: string | null;
  display_name?: string | null;
  birth_order?: BirthOrder | null;
  bio?: string | null;
  father?: ParentDto | null;
  mother?: ParentDto | null;
  family_address?: string | null;
};

export type CoupleDto = { groom?: PersonDto | null; bride?: PersonDto | null };

export type MessagesDto = {
  greeting?: string | null;
  invitation_message?: string | null;
  guest_notes?: string | null;
};

export type LoveStoryItemDto = {
  title: string;
  description?: string | null;
  year?: number | null;
  month?: number | null;
  media_id?: string | null;
};

export type GiftDto = {
  recipient_side: RecipientSide;
  bank_bin: string;
  account_number: string;
  account_holder: string;
};

export type AppearanceDto = {
  palette_key?: string | null;
  font_key?: string | null;
  background_key?: string | null;
  sections: SectionKey[];
};

export type InvitationContentDto = {
  couple?: CoupleDto;
  messages?: MessagesDto;
  love_story?: LoveStoryItemDto[];
  gifts?: GiftDto[];
  appearance: AppearanceDto;
};

export type InvitationDto = {
  id: string;
  slug: string;
  title: string;
  // Spec không có enum cho status, nên UI dựa vào published_at thay vì status
  status: string;
  template_key: string;
  content_schema_version: number;
  revision: number;
  content: InvitationContentDto;
  cover_media_id: string | null;
  groom_photo_media_id: string | null;
  bride_photo_media_id: string | null;
  music_media_id: string | null;
  primary_event_date: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type InvitationCreateBody = {
  template_key: string;
  title?: string;
  slug?: string;
  content?: InvitationContentDto;
};

// JSON Merge Patch: chỉ gửi trường cần đổi. Mọi trường không nhận null, trừ media id.
export type InvitationUpdateBody = {
  title?: string;
  slug?: string;
  template_key?: string;
  content?: Partial<InvitationContentDto>;
  cover_media_id?: string | null;
  groom_photo_media_id?: string | null;
  bride_photo_media_id?: string | null;
  music_media_id?: string | null;
};

export type SlugAvailabilityDto = { slug: string; available: boolean; reason: string | null };

export type BankDto = { bin: string; short_name: string; name: string };

export const invitationService = {
  list: (signal?: AbortSignal) => request<InvitationDto[]>('/invitations', { signal }),

  create: (body: InvitationCreateBody, signal?: AbortSignal) =>
    request<InvitationDto>('/invitations', { method: 'POST', body, signal }),

  get: (id: string, signal?: AbortSignal) =>
    request<InvitationDto>(`/invitations/${id}`, { signal }),

  // etag lấy từ ETag của lần GET gần nhất (revision). Thiếu If-Match thì server trả 428.
  update: (id: string, body: InvitationUpdateBody, etag: string | null, signal?: AbortSignal) =>
    request<InvitationDto>(`/invitations/${id}`, {
      method: 'PATCH',
      body,
      headers: etag ? { 'If-Match': etag } : {},
      signal,
    }),

  remove: (id: string, signal?: AbortSignal) =>
    request<void>(`/invitations/${id}`, { method: 'DELETE', signal }),

  publish: (id: string, signal?: AbortSignal) =>
    request<InvitationDto>(`/invitations/${id}/publish`, { method: 'POST', signal }),

  unpublish: (id: string, signal?: AbortSignal) =>
    request<InvitationDto>(`/invitations/${id}/unpublish`, { method: 'POST', signal }),

  slugAvailability: (slug: string, signal?: AbortSignal) =>
    request<SlugAvailabilityDto>(`/invitations/slug-availability?slug=${encodeURIComponent(slug)}`, { signal }),

  // Danh sách ngân hàng: công khai
  banks: (signal?: AbortSignal) => request<BankDto[]>('/banks', { auth: false, signal }),
};