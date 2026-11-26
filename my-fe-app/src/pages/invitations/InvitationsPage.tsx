import { Alert, Badge, Button, Card, Container, Group, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/site';
import { formatDateTime, isPublished } from '../../features/invitations/invitationHelpers';
import { useInvitationList } from '../../features/invitations/useInvitations';
import { getErrorMessage } from '../../services/http';

export function InvitationsPage() {
    const { invitations, error, loading, reload } = useInvitationList();

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Thiệp của tôi</Title>
                <Button component={Link} to={ROUTES.templates} color="pink" radius="md" leftSection={<IconPlus size={16} />}>
                    Tạo thiệp mới
                </Button>
            </Group>

            {error ? (
                <Alert color="red" title="Không tải được danh sách thiệp">
                    <Text fz="sm">{getErrorMessage(error)}</Text>
                    <Button mt="sm" size="xs" variant="light" onClick={() => void reload()}>
                        Thử lại
                    </Button>
                </Alert>
            ) : loading ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {Array.from({ length: 3 }, (_, i) => (
                        <Skeleton key={i} h={140} radius="md" />
                    ))}
                </SimpleGrid>
            ) : invitations.length === 0 ? (
                <Stack align="center" gap="sm" py="xl">
                    <Text c="dimmed">Bạn chưa có thiệp nào.</Text>
                    <Button component={Link} to={ROUTES.templates} variant="light" color="pink">
                        Chọn một mẫu để bắt đầu
                    </Button>
                </Stack>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    <Card
                        component={Link}
                        to={ROUTES.templates}
                        withBorder
                        radius="md"
                        padding="lg"
                        style={{ borderStyle: 'dashed', minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Stack align="center" gap={6}>
                            <IconPlus size={28} color="var(--mantine-color-pink-6)" />
                            <Text fw={600} c="pink.7">
                                Tạo thiệp mới
                            </Text>
                            <Text fz="sm" c="dimmed">
                                Chọn một mẫu để bắt đầu
                            </Text>
                        </Stack>
                    </Card>
                    {invitations.map((inv) => (
                        <Card key={inv.id} withBorder radius="md" padding="lg">
                            <Stack gap="sm" h="100%">
                                <Group justify="space-between" wrap="nowrap" align="flex-start">
                                    <Text fw={600} lineClamp={2}>
                                        {inv.title || 'Thiệp chưa đặt tên'}
                                    </Text>
                                    <Badge color={isPublished(inv) ? 'green' : 'gray'} variant="light">
                                        {isPublished(inv) ? 'Đã đăng' : 'Bản nháp'}
                                    </Badge>
                                </Group>
                                <Text fz="sm" c="dimmed" truncate>
                                    /{inv.slug}
                                </Text>
                                <Text fz="xs" c="dimmed">
                                    Cập nhật {formatDateTime(inv.updated_at)}
                                </Text>
                                <Button
                                    component={Link}
                                    to={`${ROUTES.invitations}/${inv.id}`}
                                    variant="outline"
                                    color="dark"
                                    radius="md"
                                    mt="auto"
                                >
                                    Chỉnh sửa
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}