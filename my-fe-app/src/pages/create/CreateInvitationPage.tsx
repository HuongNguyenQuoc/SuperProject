import { Alert, Button, Container, Skeleton, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { useTemplate } from '../../features/templates/useTemplates';
import {
  normalizeSlugInput,
  slugify,
} from '../../features/invitations/invitationHelpers';
import { useSlugAvailability } from '../../features/invitations/useSlugAvailability';
import { getErrorMessage } from '../../services/http';
import {
  invitationService,
  type InvitationContentDto,
  type InvitationCreateBody,
} from '../../services/invitation.service';
import type { TemplateManifestDto } from '../../services/template.service';

type LocationState = { templateKey?: string } | null;

export function CreateInvitationPage() {
  const { state } = useLocation();
  const templateKey = (state as LocationState)?.templateKey ?? '';

  if (!templateKey) {
    return (
      <Container size="sm" py="xl">
        <Alert color="yellow" title="Chưa chọn mẫu">
          Hãy chọn một mẫu thiệp trước khi tạo thiệp.
        </Alert>
        <Button component={Link} to={ROUTES.templates} mt="md" variant="light" color="pink">
          Xem mẫu thiệp
        </Button>
      </Container>
    );
  }

  return <CreateForm templateKey={templateKey} />;
}

// Lấy palette, font, nền và các phần mặc định của mẫu làm appearance ban đầu
function buildContent(manifest: TemplateManifestDto, groom: string, bride: string): InvitationContentDto {
  const g = groom.trim();
  const b = bride.trim();
  const couple = g || b ? { groom: { full_name: g || null }, bride: { full_name: b || null } } : undefined;

  return {
    appearance: {
      palette_key: manifest.defaults.palette_key,
      font_key: manifest.defaults.font_key,
      background_key: manifest.defaults.background_key,
      sections: manifest.default_sections,
    },
    ...(couple ? { couple } : {}),
  };
}

function CreateForm({ templateKey }: { templateKey: string }) {
  const navigate = useNavigate();
  const { data: template, error: templateError, loading: templateLoading } = useTemplate(templateKey);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  // Khi người dùng đã tự sửa đường dẫn thì không tự đổi theo tiêu đề nữa
  const [slugTouched, setSlugTouched] = useState(false);
  const [groom, setGroom] = useState('');
  const [bride, setBride] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availability = useSlugAvailability(slug);

  const onTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const slugError =
    availability.state === 'taken' || availability.state === 'invalid' || availability.state === 'error'
      ? availability.message
      : null;
  const slugHint = slugError ? undefined : availability.message ?? 'Khách sẽ mở thiệp qua đường dẫn này';

  const canSubmit = !!template && availability.state === 'available' && !submitting;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!template || availability.state !== 'available') return;

    const body: InvitationCreateBody = {
      template_key: template.key,
      slug: slugify(slug),
      content: buildContent(template.manifest, groom, bride),
    };
    if (title.trim()) body.title = title.trim();

    setSubmitting(true);
    setSubmitError(null);
    try {
      const { data } = await invitationService.create(body);
      navigate(`${ROUTES.invitations}/${data.id}`, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={2}>Tạo thiệp mới</Title>
          {templateLoading ? (
            <Skeleton h={20} w={200} mt="xs" />
          ) : template ? (
            <Text c="dimmed" mt={4}>
              Mẫu: {template.name}
            </Text>
          ) : null}
        </div>

        {!!templateError && <Alert color="red">{getErrorMessage(templateError)}</Alert>}
        {submitError && <Alert color="red">{submitError}</Alert>}

        <form onSubmit={onSubmit}>
          <Stack gap="md">
            <TextInput
              label="Tên thiệp"
              description="Chỉ để bạn nhận biết, khách không thấy"
              placeholder="Ví dụ: Đám cưới Lan & Minh"
              maxLength={120}
              value={title}
              onChange={(e) => onTitleChange(e.currentTarget.value)}
            />

            <TextInput
              label="Đường dẫn thiệp"
              required
              placeholder="lan-minh"
              maxLength={60}
              value={slug}
              error={slugError}
              description={slugHint}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(normalizeSlugInput(e.currentTarget.value));
              }}
            />

            <TextInput
              label="Tên chú rể"
              maxLength={100}
              value={groom}
              onChange={(e) => setGroom(e.currentTarget.value)}
            />

            <TextInput
              label="Tên cô dâu"
              maxLength={100}
              value={bride}
              onChange={(e) => setBride(e.currentTarget.value)}
            />

            <Button.Group>
              <Button component={Link} to={ROUTES.templates} variant="subtle" color="gray">
                Hủy
              </Button>
              <Button type="submit" color="pink" loading={submitting} disabled={!canSubmit} style={{ flex: 1 }}>
                Tạo thiệp
              </Button>
            </Button.Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}