import { Alert, Box, Button, Container, Group, Skeleton, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { TemplatePreview } from '../../features/templates/TemplatePreview';
import { useTemplate } from '../../features/templates/useTemplates';
import { ROUTES } from '../../config/site';
import { getErrorMessage } from '../../services/http';

export function TemplatePreviewPage() {
  const { key = '' } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { data: template, error, loading } = useTemplate(key);

  const createWithTemplate = () => {
    if (!template) return;
    requireAuth(() => navigate(ROUTES.create, { state: { templateKey: template.key } }));
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Button component={Link} to={ROUTES.templates} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
          Quay lại
        </Button>
        <Button color="pink" radius="md" onClick={createWithTemplate} disabled={!template}>
          Tạo thiệp
        </Button>
      </Group>

      {error ? (
        <Alert color="red" title="Không tìm thấy mẫu">
          {getErrorMessage(error)}
        </Alert>
      ) : loading || !template ? (
        <Skeleton h={560} maw={390} mx="auto" radius="lg" />
      ) : (
        <Stack align="center" gap="md">
          <Text fw={600} ta="center">
            {template.name} · {template.category}
          </Text>
          <Box
            mx="auto"
            maw={390}
            w="100%"
            h={700}
            style={{ borderRadius: 24, overflowY: 'auto', background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
          >
            <TemplatePreview template={template} />
          </Box>
        </Stack>
      )}
    </Container>
  );
}