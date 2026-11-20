// Nội dung trang chủ (dữ liệu mẫu, sửa tại đây)

export const HERO_CONTENT = {
  eyebrow: 'Thiệp cưới online',
  titleBefore: 'Bước qua cánh cổng,',
  titleAfterBreak: 'bắt đầu',
  titleEm: 'mãi mãi',
  titleEnd: '.',
  lead: 'Tạo thiệp cưới online trong vài phút. Chọn mẫu, kể câu chuyện của hai bạn rồi gửi một đường link. Khách xác nhận tham dự, xem đường đi và gửi lời chúc ngay trên thiệp.',
  primaryCta: 'Bắt đầu tạo thiệp',
  secondaryCta: 'Xem mẫu thiệp',
} as const;

export const SAMPLE_INVITE = {
  kicker: 'Trân trọng kính mời',
  names: 'Lan Chi',
  and: '&',
  nameSecond: 'Minh Khoa',
  dateLead: 'Chủ nhật',
  date: '20.12.2026',
  time: '17:30',
  place: 'Hà Nội',
  tag: 'Thiệp mẫu',
} as const;

export const STATEMENT_CONTENT = {
  quote: 'Mỗi chuyện tình có một cánh cổng riêng. Tấm thiệp là nơi khách mời bước qua để đến với hai bạn.',
  body: 'Vows gói lời mời, lịch trình, bản đồ, album và lời chúc vào một đường link. Khách mở trên điện thoại là xem được, không cần tải ứng dụng.',
} as const;

export const STEPS_CONTENT = {
  title: 'Ba bước để gửi lời mời',
  items: [
    { title: 'Chọn mẫu thiệp', body: 'Tối giản, cổ điển hay hoa lá. Đổi màu, phông chữ và bố cục cho hợp với hai bạn.' },
    { title: 'Kể câu chuyện của hai bạn', body: 'Thêm ảnh cưới, lời mời, giờ làm lễ và đãi tiệc, cùng bản đồ đến địa điểm.' },
    { title: 'Gửi một đường link', body: 'Mỗi khách nhận thiệp có tên riêng. Gửi qua Zalo, Messenger hoặc tin nhắn.' },
  ],
} as const;

export type FeatureIcon = 'check' | 'pin' | 'qr' | 'photo' | 'music' | 'book';

export const FEATURES_CONTENT = {
  title: 'Trên tấm thiệp của bạn',
  intro: 'Những điều khách mời hay hỏi nhất, trả lời sẵn ngay trên thiệp.',
  items: [
    { icon: 'check', title: 'Xác nhận tham dự', body: 'Khách bấm “Sẽ đến”, bạn biết trước số khách để đặt bàn.' },
    { icon: 'pin', title: 'Chỉ đường', body: 'Bản đồ đến nơi làm lễ và nhà hàng, mở thẳng trong ứng dụng bản đồ.' },
    { icon: 'qr', title: 'Mừng cưới qua QR', body: 'Mã QR tài khoản cô dâu, chú rể cho người thân ở xa.' },
    { icon: 'photo', title: 'Album ảnh cưới', body: 'Bộ ảnh của hai bạn, vuốt xem mượt trên điện thoại.' },
    { icon: 'music', title: 'Nhạc nền', body: 'Bài hát của hai bạn phát khi khách mở thiệp.' },
    { icon: 'book', title: 'Sổ lưu bút', body: 'Lời chúc của khách được giữ lại thành kỷ niệm.' },
  ] as { icon: FeatureIcon; title: string; body: string }[],
} as const;

export const CTA_CONTENT = {
  titleBefore: 'Ngày của hai bạn bắt đầu từ',
  titleEm: 'một lời mời',
  titleEnd: '.',
  body: 'Tạo bản nháp ngay bây giờ, chỉnh dần đến ngày gửi. Thiệp được lưu tự động.',
  cta: 'Bắt đầu tạo thiệp',
} as const;
