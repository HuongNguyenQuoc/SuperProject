import { Avatar, Menu, UnstyledButton } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { useAuth } from './AuthContext';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Chữ cái đầu của tên, viết hoa
  const initial = user.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <Menu position="bottom-end" shadow="md" width={220} radius="lg" offset={10}>
      <Menu.Target>
        <UnstyledButton aria-label="Menu tài khoản" style={{ display: 'flex', borderRadius: '50%' }}>
          <Avatar color="pink" radius="xl" size={40}>
            {initial}
          </Avatar>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user.name}</Menu.Label>
        <Menu.Item leftSection={<IconUser size={16} />} onClick={() => navigate(ROUTES.account)}>
          Tài khoản
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={() => void logout()}>
          Đăng xuất
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}