import { Alert, Button, Chip, Container, Group, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import { TemplateCard } from '../../features/templates/TemplateCard';
import { TemplateModal } from '../../features/templates/TemplateModal';
import { useTemplates } from '../../features/templates/useTemplates';
import { getErrorMessage } from '../../services/http';
import type { TemplateDto } from '../../services/template.service';

const ALL = '__all__';

export function TemplatesPage() {
  const { templates, error, loading, reload } = useTemplates();
  const [category, setCategory] = useState(ALL);
  // Giữ mẫu đang chọn tách khỏi trạng thái mở, để nội dung modal không biến mất lúc đang đóng
  const [active, setActive] = useState<TemplateDto | null>(null);
  const [opened, setOpened] = useState(false);

  const categories = useMemo(() => Array.from(new Set(templates.map((t) => t.category))), [templates]);
  const visible = category === ALL ? templates : templates.filter((t) => t.category === category);

  const openTemplate = (t: TemplateDto) => {
    setActive(t);
    setOpened(true);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap={4} align="center" mb="xl">
        <Title order={2} ta="center">
          Mẫu thiệp mời đám cưới
        </Title>
        <Text c="dimmed" ta="center">
          Tạo miễn phí · Thử 3 ngày · Đẹp mới thanh toán
        </Text>
        <Text c="dimmed" fz="sm" ta="center">
          Bạn có thể đổi mẫu bất cứ lúc nào khi chỉnh sửa
        </Text>
      </Stack>

      {categories.length > 1 && (
        <Chip.Group value={category} onChange={(value) => setCategory(String(value))}>
          <Group justify="center" gap="xs" mb="lg">
            <Chip value={ALL} variant="outline">
              Tất cả
            </Chip>
            {categories.map((c) => (
              <Chip key={c} value={c} variant="outline">
                {c}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      )}

      {error ? (
        <Alert color="red" title="Không tải được danh sách mẫu">
          <Text fz="sm">{getErrorMessage(error)}</Text>
          <Button mt="sm" size="xs" variant="light" onClick={() => void reload()}>
            Thử lại
          </Button>
        </Alert>
      ) : loading ? (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing="lg">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} h={320} radius="md" />
          ))}
        </SimpleGrid>
      ) : visible.length === 0 ? (
        <Text c="dimmed" ta="center">
          Chưa có mẫu nào.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing="lg">
          {visible.map((t) => (
            <TemplateCard key={t.id} template={t} onOpen={() => openTemplate(t)} />
          ))}
        </SimpleGrid>
      )}

      <TemplateModal opened={opened} template={active} onClose={() => setOpened(false)} />
    </Container>
  );
}