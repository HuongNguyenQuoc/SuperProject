import { Box, Stack, Text } from '@mantine/core';
import type { TemplateDto } from '../../services/template.service';
import { getDefaultPalette, SECTION_LABELS } from './templateHelpers';

// Bản xem trước chung, dựng từ bảng màu và các phần của mẫu.
// Khi nối key với giao diện thật của từng mẫu thì thay component này.
export function TemplatePreview({ template }: { template: TemplateDto }) {
  const p = getDefaultPalette(template);

  return (
    <Box h="100%" p="xl" style={{ background: p.background, color: p.text, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
      <Stack align="center" gap="xs" py="lg">
        <Text fz="xs" tt="uppercase" lts={3} c={p.secondary}>
          Trân trọng kính mời
        </Text>
        <Text fz={28} fw={600} ta="center" c={p.primary} style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.1 }}>
          {template.name}
        </Text>
        <Box w={48} h={1} bg={p.secondary} my="xs" />
      </Stack>

      <Stack gap="sm">
        {template.manifest.default_sections.map((section) => (
          <Box key={section} py={8} style={{ borderBottom: `1px solid ${p.secondary}` }}>
            <Text fz="sm" c={p.text}>
              {SECTION_LABELS[section]}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}