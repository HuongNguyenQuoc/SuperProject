import { Badge, Box, Button, ColorSwatch, Grid, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowRight, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { useAuth } from '../auth/AuthContext';
import type { TemplateDto } from '../../services/template.service';
import { TemplatePreview } from './TemplatePreview';
import { SECTION_LABELS } from './templateHelpers';

type Props = { opened: boolean; template: TemplateDto | null; onClose: () => void };

export function TemplateModal({ opened, template, onClose }: Props) {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const isMobile = useMediaQuery('(max-width: 48em)');

  if (!template) return null;

  const font = template.manifest.fonts.find((f) => f.key === template.manifest.defaults.font_key);

  // Đóng modal trước rồi mới mở đăng nhập (nếu cần), tránh hai modal chồng nhau
  const createWithTemplate = () => {
    onClose();
    requireAuth(() => navigate(ROUTES.create, { state: { templateKey: template.key } }));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="60rem"
      radius="lg"
      centered
      fullScreen={isMobile}
      padding="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Box
            mx="auto"
            maw={320}
            h={560}
            style={{
              overflowY: 'auto',
              borderRadius: 16,
              border: '1px solid var(--mantine-color-default-border)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              background: '#fff',
            }}
          >
            <TemplatePreview template={template} />
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md" h="100%">
            <div>
              <Title order={2}>{template.name}</Title>
              {template.description && (
                <Text c="dimmed" mt={4}>
                  {template.description}
                </Text>
              )}
            </div>

            <Group gap="xs">
              <Badge variant="outline" color="gray" radius="sm">
                {template.category}
              </Badge>
              {template.is_premium && (
                <Badge color="grape" radius="sm">
                  Premium
                </Badge>
              )}
            </Group>

            <div>
              <Text fw={600} mb="xs">
                Bảng màu
              </Text>
              <Group gap="xs">
                {template.manifest.palettes.map((pl) => (
                  <ColorSwatch key={pl.key} color={pl.primary} size={24} aria-label={pl.name} />
                ))}
              </Group>
            </div>

            <div>
              <Text fw={600} mb="xs">
                Các phần trong thiệp
              </Text>
              <Text fz="sm" c="dimmed">
                {template.manifest.default_sections.map((s) => SECTION_LABELS[s]).join(' · ')}
              </Text>
              {font && (
                <Text fz="sm" c="dimmed" mt={4}>
                  Font: {font.name}
                </Text>
              )}
            </div>

            <Text fz="xs" c="dimmed" mt="auto">
              Bạn có thể đổi mẫu bất cứ lúc nào khi chỉnh sửa
            </Text>

            <Group grow>
              <Button color="pink" radius="md" leftSection={<IconPlus size={16} />} onClick={createWithTemplate}>
                Tạo thiệp
              </Button>
              <Button
                variant="outline"
                color="dark"
                radius="md"
                rightSection={<IconArrowRight size={16} />}
                onClick={() => {
                  onClose();
                  navigate(`${ROUTES.templates}/${template.key}`);
                }}
              >
                Xem chi tiết
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}