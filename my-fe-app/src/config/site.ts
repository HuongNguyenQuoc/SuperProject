// Cấu hình chung của site. Đổi tên thương hiệu ở đây (đang để "Vows" tạm, đổi thành "Chung Đôi" khi chốt).
export const BRAND_NAME = "Vows";

export const ROUTES = {
  home: "/",
  templates: "/mau-thiep",
  pricing: "/bang-gia",
  guide: "/cam-nang",
  login: "/dang-nhap",
  register: "/dang-ky",
  create: "/tao-thiep",
  howTo: "/huong-dan",
  account: '/tai-khoan',
  contact: "/lien-he",
} as const;

export const MAIN_NAV = [
  { label: "Mẫu thiệp", to: ROUTES.templates },
  { label: "Tính năng", to: "/#tinh-nang" },
  { label: "Cách tạo", to: "/#cach-tao" },
  { label: "Bảng giá", to: ROUTES.pricing },
  { label: "Cẩm nang cưới", to: ROUTES.guide },
] as const;

export const FOOTER_NAV = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Mẫu thiệp", to: ROUTES.templates },
      { label: "Tính năng", to: "/#tinh-nang" },
      { label: "Bảng giá", to: ROUTES.pricing },
    ],
  },
  {
    title: "Hỗ trợ",
    links: [
      { label: "Cẩm nang cưới", to: ROUTES.guide },
      { label: "Hướng dẫn", to: ROUTES.howTo },
      { label: "Liên hệ", to: ROUTES.contact },
    ],
  },
] as const;

// Ảnh và video của trang chủ (đặt trong public/media)
export const HOME_MEDIA = {
  videoDesktop: "/media/hero-rose-1080p.mp4",
  videoMobile: "/media/hero-rose-720p.mp4",
  poster: "/media/hero-rose-start.jpg",
  imageEnd: "/media/hero-rose-end.jpg",
  imageStart: "/media/hero-rose-start.jpg",
} as const;

// Thời điểm (giây) chữ hiện ra sau video mở đầu dài 8 giây
export const HERO_REVEAL_AT = 8;
