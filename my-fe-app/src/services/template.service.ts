import { request } from './http';

// Khớp với schema TemplateResponse / TemplateManifest trong đặc tả
export type SectionKey =
  | 'cover'
  | 'greeting'
  | 'couple'
  | 'love_story'
  | 'events'
  | 'countdown'
  | 'gallery'
  | 'gifts'
  | 'guest_notes';

export type PaletteDto = {
  key: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

export type ManifestOptionDto = { key: string; name: string };

export type TemplateManifestDto = {
  sections: SectionKey[];
  default_sections: SectionKey[];
  palettes: PaletteDto[];
  fonts: ManifestOptionDto[];
  backgrounds: ManifestOptionDto[];
  defaults: { palette_key: string; font_key: string; background_key: string };
  max_gallery_images: number;
};

export type TemplateDto = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  is_premium: boolean;
  manifest: TemplateManifestDto;
};

export const templateService = {
  // Công khai: không gửi token
  list: (params: { category?: string } = {}, signal?: AbortSignal) => {
    const qs = params.category ? `?category=${encodeURIComponent(params.category)}` : '';
    return request<TemplateDto[]>(`/templates${qs}`, { auth: false, signal });
  },

  get: (key: string, signal?: AbortSignal) =>
    request<TemplateDto>(`/templates/${encodeURIComponent(key)}`, { auth: false, signal }),
};