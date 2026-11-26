import { AspectRatio, Badge, Box, Card, Text } from '@mantine/core';
import type { TemplateDto } from '../../services/template.service';
import { getDefaultPalette } from './templateHelpers';

type Props = { template: TemplateDto; onOpen: () => void };

export function TemplateCard({ template, onOpen }: Props) {
  const p = getDefaultPalette(template);

  return (
    <Card
      padding={0}
      radius="md"
      shadow="sm"
      withBorder
      role="button"
      tabIndex={0}
      aria-label={`Xem mẫu ${template.name}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
    >
      {template.is_premium && (
        <Badge color="grape" size="sm" style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          Premium
        </Badge>
      )}

      <AspectRatio ratio={9 / 16}>
        {template.thumbnail_url ? (
          <img
            src={template.thumbnail_url}
            alt={template.name}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            style={{
              background: `linear-gradient(160deg, ${p.background}, ${p.primary})`,
              color: p.text,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <Text fz="xs" tt="uppercase" lts={3}>
              Thiệp cưới
            </Text>
            <Text fz="xl" fw={600} ta="center" mt="md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {template.name}
            </Text>
          </Box>
        )}
      </AspectRatio>
    </Card>
  );
}