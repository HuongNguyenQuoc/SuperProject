import type { ComponentType } from 'react';

// 'public': bọc PublicLayout (header + footer). 'none': trang tự có khung riêng hoặc toàn màn hình.
export type LayoutKind = 'public' | 'none';

export type AppRoute = {
  key: string;
  path: string;
  component: ComponentType;
  layout: LayoutKind;
  // true: chưa đăng nhập thì mở modal đăng nhập, xong quay lại đúng trang này
  auth?: boolean;
};