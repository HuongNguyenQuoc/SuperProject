import { request } from './http';

// Khớp với AlbumCreate, AlbumUpdate, AlbumResponse trong đặc tả (tag media > albums)
export type AlbumDto = {
  id: string;
  title: string;
  position: number;
  media_count: number;
  created_at: string;
};

export type AlbumUpdateBody = { title?: string; position?: number };

export const albumService = {
  list: (invitationId: string, signal?: AbortSignal) =>
    request<AlbumDto[]>(`/invitations/${invitationId}/albums`, { signal }),

  create: (invitationId: string, title: string, signal?: AbortSignal) =>
    request<AlbumDto>(`/invitations/${invitationId}/albums`, { method: 'POST', body: { title }, signal }),

  update: (invitationId: string, albumId: string, body: AlbumUpdateBody, signal?: AbortSignal) =>
    request<AlbumDto>(`/invitations/${invitationId}/albums/${albumId}`, { method: 'PATCH', body, signal }),

  remove: (invitationId: string, albumId: string, signal?: AbortSignal) =>
    request<void>(`/invitations/${invitationId}/albums/${albumId}`, { method: 'DELETE', signal }),
};