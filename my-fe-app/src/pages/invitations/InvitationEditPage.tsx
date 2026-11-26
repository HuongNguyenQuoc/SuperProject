import { Alert, Badge, Button, Container, Divider, Group, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import {
  formatDateTime,
  isPublished,
  normalizeSlugInput,
  saveErrorMessage,
} from '../../features/invitations/invitationHelpers';
import { useSlugAvailability } from '../../features/invitations/useSlugAvailability';
import { useInvitation } from '../../features/invitations/useInvitations';
import { EventsSection } from '../../features/invitations/EventsSection';
import { MediaSection } from '../../features/invitations/MediaSection';
import { AlbumsSection } from '../../features/invitations/AlbumsSection';
import { GiftsSection } from '../../features/invitations/GiftsSection';
import { getErrorMessage } from '../../services/http';
import {
  invitationService,
  type InvitationDto,
  type InvitationUpdateBody,
} from '../../services/invitation.service';

export function InvitationEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { invitation, etag, error, loading, reload } = useInvitation(id);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!invitation) {
    return (
      <Container size="sm" py="xl">
        {error ? (
          <Alert color="red" title="Không mở được thiệp">
            {getErrorMessage(error)}
          </Alert>
        ) : (
          <Skeleton h={320} radius="md" />
        )}
        {!loading && (
          <Button component={Link} to={ROUTES.invitations} variant="subtle" mt="md">
            Về danh sách thiệp
          </Button>
        )}
      </Container>
    );
  }

  const published = isPublished(invitation);

  const togglePublish = async () => {
    setBusy(true);
    setActionError(null);
    try {
      if (published) await invitationService.unpublish(invitation.id);
      else await invitationService.publish(invitation.id);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('Xóa thiệp này? Không khôi phục được.')) return;
    setBusy(true);
    setActionError(null);
    try {
      await invitationService.remove(invitation.id);
      navigate(ROUTES.invitations, { replace: true });
    } catch (err) {
      setActionError(getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Button component={Link} to={ROUTES.invitations} variant="subtle" leftSection={<IconArrowLeft size={16} />} mb="md">
        Thiệp của tôi
      </Button>

      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Title order={2}>{invitation.title || 'Thiệp chưa đặt tên'}</Title>
            <Group gap="xs" mt={4}>
              <Badge color={published ? 'green' : 'gray'} variant="light">
                {published ? 'Đã đăng' : 'Bản nháp'}
              </Badge>
              <Text fz="sm" c="dimmed">
                Cập nhật {formatDateTime(invitation.updated_at)}
              </Text>
            </Group>
          </div>
          <Button variant="outline" color={published ? 'gray' : 'pink'} radius="md" loading={busy} onClick={togglePublish}>
            {published ? 'Gỡ đăng' : 'Đăng thiệp'}
          </Button>
        </Group>

        {!!error && <Alert color="red">{getErrorMessage(error)}</Alert>}
        {actionError && <Alert color="red">{actionError}</Alert>}

        <EditForm invitation={invitation} etag={etag} onSaved={reload} />

        <Divider />

        <MediaSection invitation={invitation} etag={etag} onChanged={reload} />

        <Divider />

        <AlbumsSection invitation={invitation} />

        <Divider />

        <GiftsSection invitation={invitation} etag={etag} onChanged={reload} />

        <Divider />

        <EventsSection invitationId={invitation.id} etag={etag} onChanged={reload} />

        <Divider />

        <Group justify="space-between">
          <Text fz="sm" c="dimmed">
            Xóa thiệp sẽ không khôi phục được.
          </Text>
          <Button color="red" variant="subtle" onClick={remove} loading={busy}>
            Xóa thiệp
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

type EditFormProps = {
  invitation: InvitationDto;
  etag: string | null;
  onSaved: () => Promise<unknown>;
};

function EditForm({ invitation, etag, onSaved }: EditFormProps) {
  const [title, setTitle] = useState(invitation.title);
  const [slug, setSlug] = useState(invitation.slug);
  const [groom, setGroom] = useState(invitation.content.couple?.groom?.full_name ?? '');
  const [bride, setBride] = useState(invitation.content.couple?.bride?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const availability = useSlugAvailability(slug, invitation.slug);

  const slugError =
    availability.state === 'taken' || availability.state === 'invalid' || availability.state === 'error'
      ? availability.message
      : null;

  // Chỉ gửi các trường đã đổi (JSON Merge Patch)
  const buildPatch = (): InvitationUpdateBody => {
    const patch: InvitationUpdateBody = {};
    if (title.trim() !== invitation.title) patch.title = title.trim();
    if (slug !== invitation.slug) patch.slug = slug;

    const g = groom.trim();
    const b = bride.trim();
    const currentG = invitation.content.couple?.groom?.full_name ?? '';
    const currentB = invitation.content.couple?.bride?.full_name ?? '';
    if (g !== currentG || b !== currentB) {
      patch.content = { couple: { groom: { full_name: g || null }, bride: { full_name: b || null } } };
    }
    return patch;
  };

  const patch = buildPatch();
  const hasChanges = Object.keys(patch).length > 0;
  const titleEmpty = title.trim() === '';
  const canSave = hasChanges && !titleEmpty && availability.state === 'available' && !saving;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await invitationService.update(invitation.id, patch, etag);
      setSaved(true);
      await onSaved();
    } catch (err) {
      setSaveError(saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack gap="md">
        {saveError && <Alert color="red">{saveError}</Alert>}
        {saved && !hasChanges && <Alert color="green">Đã lưu.</Alert>}

        <TextInput
          label="Tên thiệp"
          maxLength={120}
          value={title}
          error={titleEmpty ? 'Nhập tên thiệp' : undefined}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />

        <TextInput
          label="Đường dẫn thiệp"
          maxLength={60}
          value={slug}
          error={slugError}
          description={slugError ? undefined : availability.message ?? undefined}
          onChange={(e) => setSlug(normalizeSlugInput(e.currentTarget.value))}
        />

        <TextInput label="Tên chú rể" maxLength={100} value={groom} onChange={(e) => setGroom(e.currentTarget.value)} />
        <TextInput label="Tên cô dâu" maxLength={100} value={bride} onChange={(e) => setBride(e.currentTarget.value)} />

        <Group justify="flex-end">
          <Button type="submit" color="pink" radius="md" loading={saving} disabled={!canSave}>
            Lưu thay đổi
          </Button>
        </Group>
      </Stack>
    </form>
  );
}