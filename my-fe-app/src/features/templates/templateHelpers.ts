import type { PaletteDto, SectionKey, TemplateDto } from '../../services/template.service';

// Nhãn tiếng Việt cho từng phần của thiệp (khớp SectionKey trong đặc tả)
export const SECTION_LABELS: Record<SectionKey, string> = {
  cover: 'Ảnh bìa',
  greeting: 'Lời chào',
  couple: 'Cô dâu & chú rể',
  love_story: 'Chuyện tình yêu',
  events: 'Thời gian & địa điểm',
  countdown: 'Đếm ngược',
  gallery: 'Thư viện ảnh',
  gifts: 'Mừng cưới',
  guest_notes: 'Lời nhắn',
};

// Bảng màu mặc định của mẫu. Không khớp thì lấy bảng đầu tiên.
export function getDefaultPalette(template: TemplateDto): PaletteDto {
  const key = template.manifest.defaults.palette_key;
  return template.manifest.palettes.find((p) => p.key === key) ?? template.manifest.palettes[0];
}