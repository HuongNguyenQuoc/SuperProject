import { request } from './http';

// Khớp với EventCreate / EventUpdate / EventResponse trong đặc tả (tag events)
export type EventType = 'engagement' | 'family_ceremony' | 'religious_ceremony' | 'reception' | 'other';
export type HostSide = 'groom' | 'bride' | 'both';

export type EventDto = {
  id: string;
  event_type: EventType;
  host_side: HostSide;
  event_name: string | null;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  timezone: string;
  venue_name: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  maps_url: string | null;
  created_at: string;
  updated_at: string;
  position: number;
  display_name: string;
};

export type EventCreateBody = {
  event_type: EventType;
  host_side: HostSide;
  event_name?: string | null;
  event_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  timezone?: string;
  venue_name?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  maps_url?: string | null;
};

// JSON Merge Patch: trường không gửi thì giữ nguyên, gửi null thì xóa giá trị.
// event_type, host_side, timezone không nhận null.
export type EventUpdateBody = Partial<EventCreateBody>;

// Server trả 428 nếu thiếu If-Match, nên mọi thao tác đều gửi revision (etag) hiện tại của thiệp
const ifMatch = (etag: string | null): Record<string, string> => (etag ? { 'If-Match': etag } : {});

export const eventService = {
  list: (invitationId: string, signal?: AbortSignal) =>
    request<EventDto[]>(`/invitations/${invitationId}/events`, { signal }),

  create: (invitationId: string, body: EventCreateBody, etag: string | null, signal?: AbortSignal) =>
    request<EventDto>(`/invitations/${invitationId}/events`, {
      method: 'POST',
      body,
      headers: ifMatch(etag),
      signal,
    }),

  update: (invitationId: string, eventId: string, body: EventUpdateBody, etag: string | null, signal?: AbortSignal) =>
    request<EventDto>(`/invitations/${invitationId}/events/${eventId}`, {
      method: 'PATCH',
      body,
      headers: ifMatch(etag),
      signal,
    }),

  remove: (invitationId: string, eventId: string, etag: string | null, signal?: AbortSignal) =>
    request<void>(`/invitations/${invitationId}/events/${eventId}`, {
      method: 'DELETE',
      headers: ifMatch(etag),
      signal,
    }),
};