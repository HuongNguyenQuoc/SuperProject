import { Alert, Button, Card, FileButton, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import {
  invitationService,
  type InvitationDto,
  type InvitationUpdateBody,
} from '../../services/invitation.service';
import { getErrorMessage } from '../../services/http';
import { mediaService, uploadMedia, type MediaDto } from '../../services/media.service';
import { useMedia } from './useMedia';

type SlotField = 'cover_media_id' | 'groom_photo_media_id' | 'bride_photo_media_id' | 'music_media_id';
type Slot = { field: SlotField; label: string; accept: string; audio?: boolean };

// Các ô ảnh và nhạc cố định của thiệp. Ảnh thư viện nằm ở mục Album ảnh.
const SLOTS: Slot[] = [
  { field: 'cover_media_id', label: 'Ảnh bìa', accept: 'image/*' },
  { field: 'groom_photo_media_id', label: 'Ảnh chú rể', accept: 'image/*' },
  { field: 'bride_photo_media_id', label: 'Ảnh cô dâu', accept: 'image/*' },
  { field: 'music_media_id', label: 'Nhạc nền', accept: 'audio/*', audio: true },
];

type Props = {
  invitation: InvitationDto;
  etag: string | null;
  onChanged: () => Promise<unknown>;
};

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return getErrorMessage(err) ?? 'Có lỗi xảy ra, thử lại sau.';
}

export function MediaSection({ invitation, etag, onChanged }: Props) {
  const { media, error, loading, reload } = useMedia(invitation.id);
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const byId = new Map<string, MediaDto>(media.map((m) => [m.id, m]));

  // Gắn media mới vào ô, xóa media cũ trong ô (nếu có)
  const setSlot = async (slot: Slot, file: File) => {
    setBusy(slot.field);
    setActionError(null);
    try {
      const uploaded = await uploadMedia(invitation.id, file);
      const previous = invitation[slot.field];
      const patch = { [slot.field]: uploaded.id } as InvitationUpdateBody;
      await invitationService.update(invitation.id, patch, etag);
      if (previous) await mediaService.remove(invitation.id, previous).catch(() => undefined);
      await Promise.all([onChanged(), reload()]);
    } catch (err) {
      setActionError(messageOf(err));
    } finally {
      setBusy(null);
    }
  };

  const clearSlot = async (slot: Slot) => {
    if (!window.confirm(`Xóa ${slot.label.toLowerCase()}?`)) return;
    const current = invitation[slot.field];
    setBusy(slot.field);
    setActionError(null);
    try {
      const patch = { [slot.field]: null } as InvitationUpdateBody;
      await invitationService.update(invitation.id, patch, etag);
      if (current) await mediaService.remove(invitation.id, current).catch(() => undefined);
      await Promise.all([onChanged(), reload()]);
    } catch (err) {
      setActionError(messageOf(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <Stack gap="md">
      <Title order={3}>Ảnh và nhạc</Title>

      {!!error && <Alert color="red">{getErrorMessage(error)}</Alert>}
      {actionError && <Alert color="red">{actionError}</Alert>}
      {loading && media.length === 0 && <Text c="dimmed" fz="sm">Đang tải...</Text>}

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {SLOTS.map((slot) => {
          const current = byId.get(invitation[slot.field] ?? '');

          return (
            <Card key={slot.field} withBorder radius="md" padding="md">
              <Stack gap="sm">
                <Text fw={600}>{slot.label}</Text>

                {current ? (
                  slot.audio ? (
                    <audio controls src={current.url} style={{ width: '100%' }} />
                  ) : (
                    <img
                      src={current.url}
                      alt={slot.label}
                      style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 8 }}
                    />
                  )
                ) : (
                  <Text fz="sm" c="dimmed">
                    Chưa có
                  </Text>
                )}

                <Group gap="xs">
                  <FileButton accept={slot.accept} onChange={(file) => file && void setSlot(slot, file)}>
                    {(props) => (
                      <Button
                        {...props}
                        size="xs"
                        variant="light"
                        color="pink"
                        loading={busy === slot.field}
                        disabled={busy !== null && busy !== slot.field}
                      >
                        {current ? 'Đổi' : 'Tải lên'}
                      </Button>
                    )}
                  </FileButton>
                  {current && (
                    <Button
                      size="xs"
                      variant="subtle"
                      color="red"
                      disabled={busy !== null}
                      onClick={() => void clearSlot(slot)}
                    >
                      Xóa
                    </Button>
                  )}
                </Group>
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}