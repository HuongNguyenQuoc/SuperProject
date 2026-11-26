import { HomePage } from '../features/home/HomePage';
import { LoginRoute, RegisterRoute } from '../features/auth/AuthGuards';
import { CreateInvitationPage } from '../features/create/CreateInvitationPage';
import { TemplatesPage } from '../features/templates/TemplatesPage';
import { TemplatePreviewPage } from '../features/templates/TemplatePreviewPage';
import { TemplateDemoPage } from '../features/templates/TemplateDemoPage';
import { AccountPage } from '../features/account/AccountPage';
import { ROUTES } from '../config/site';
import type { AppRoute } from './types';

// Khai báo toàn bộ route ở đây. Thêm trang mới: thêm một dòng vào danh sách.
export const routes: AppRoute[] = [
  // ----- Không bọc layout -----
  { key: 'home', path: ROUTES.home, component: HomePage, layout: 'none' },
  { key: 'login', path: ROUTES.login, component: LoginRoute, layout: 'none' },
  { key: 'register', path: ROUTES.register, component: RegisterRoute, layout: 'none' },
  { key: 'templateDemo', path: `${ROUTES.templates}/:slug/demo`, component: TemplateDemoPage, layout: 'none' },
  { key: 'account', path: ROUTES.account, component: AccountPage, layout: 'public', auth: true },
  // ----- Bọc PublicLayout (header + footer) -----
  { key: 'templates', path: ROUTES.templates, component: TemplatesPage, layout: 'public' },
  { key: 'templateDetail', path: `${ROUTES.templates}/:slug`, component: TemplatePreviewPage, layout: 'public' },
  { key: 'create', path: ROUTES.create, component: CreateInvitationPage, layout: 'public', auth: true },
];