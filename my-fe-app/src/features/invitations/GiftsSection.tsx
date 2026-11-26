import { Alert, Button, Card, Group, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { getErrorMessage } from '../../services/http';
import {
  invitationService,
  type GiftDto,
  type InvitationDto,
  type RecipientSide,
} from '../../services/invitation.service';
import { saveErrorMessage } from './invitationHelpers';
import { useBanks } from './useBanks';

// Đặc tả cho phép tối đa 4 mục mừng cưới
const MAX_GIFTS = 4;

const SIDE_OPTIONS: { value: RecipientSide; label: string }[] = [
  { value: 'groom', label: 'Nhà trai' },
  { value: 'bride', label: 'Nhà gái' },
];

const emptyGift = (): GiftDto => ({
  recipient_side: 'groom',
  bank_bin: '',
  account_number: '',
  account_holder: '',
});

// Trả về lỗi của một mục, hoặc null nếu hợp lệ
function giftProblem(g: GiftDto): string | null {
  if (!/^[0-9]{6}$/.test(g.bank_bin)) return 'Chọn ngân hàng';
  if (!/^[0-9]{6,19}$/.test(g.account_number)) return 'Số tài khoản chỉ gồm 6 đến 19 chữ số';
  if (!g.account_holder.trim()) return 'Nhập tên chủ tài khoản';
  return null;
}

type Props = {
  invitation: InvitationDto;
  etag: string | null;
  onChanged: () => Promise<unknown>;
};

export function GiftsSection({ invitation, etag, onChanged }: Props) {
  const { banks, error: banksError, loading: banksLoading } = useBanks();
  const saved0 = invitation.content.gifts ?? [];
  const [gifts, setGifts] = useState<GiftDto[]>(saved0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const bankOptions = banks.map((b) => ({ value: b.bin, label: `${b.short_name} · ${b.name}` }));
  const problems = gifts.map(giftProblem);
  const valid = problems.every((p) => p === null);
  const dirty = JSON.stringify(gifts) !== JSON.stringify(saved0);

  const updateGift = (index: number, patch: Partial<GiftDto>) => {
    setDone(false);
    setGifts((gs) => gs.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const removeGift = (index: number) => {
    setDone(false);
    setGifts((gs) => gs.filter((_, i) => i !== index));
  };

  const addGift = () => {
    setDone(false);
    setGifts((gs) => [...gs, emptyGift()]);
  };

  const save = async () => {
    setSaving(true);
    setSaveError(null);
    setDone(false);
    try {
      // Mảng gifts được gửi nguyên khối: merge patch thay thế toàn bộ danh sách
      await invitationService.update(invitation.id, { content: { gifts } }, etag);
      setDone(true);
      await onChanged();
    } catch (err) {
      setSaveError(saveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Mừng cưới</Title>
        <Button
          variant="light"
          color="pink"
          radius="md"
          onClick={addGift}
          disabled={gifts.length >= MAX_GIFTS}
        >
          Thêm tài khoản
        </Button>
      </Group>

      {!!banksError && <Alert color="red">{getErrorMessage(banksError)}</Alert>}
      {saveError && <Alert color="red">{saveError}</Alert>}
      {done && !dirty && <Alert color="green">Đã lưu.</Alert>}

      {gifts.length === 0 && (
        <Text c="dimmed" fz="sm">
          Chưa có tài khoản mừng cưới nào.
        </Text>
      )}

      <Stack gap="sm">
        {gifts.map((g, i) => (
          <Card key={i} withBorder radius="md" padding="md">
            <Stack gap="sm">
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Select
                  label="Bên nhận"
                  data={SIDE_OPTIONS}
                  value={g.recipient_side}
                  onChange={(v) => updateGift(i, { recipient_side: (v as RecipientSide) ?? 'groom' })}
                  allowDeselect={false}
                />
                <Select
                  label="Ngân hàng"
                  placeholder={banksLoading ? 'Đang tải...' : 'Tìm ngân hàng'}
                  data={bankOptions}
                  value={g.bank_bin || null}
                  onChange={(v) => updateGift(i, { bank_bin: v ?? '' })}
                  searchable
                  nothingFoundMessage="Không tìm thấy"
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput
                  label="Số tài khoản"
                  inputMode="numeric"
                  maxLength={19}
                  value={g.account_number}
                  onChange={(e) => updateGift(i, { account_number: e.currentTarget.value.replace(/\D/g, '') })}
                />
                <TextInput
                  label="Chủ tài khoản"
                  maxLength={100}
                  value={g.account_holder}
                  onChange={(e) => updateGift(i, { account_holder: e.currentTarget.value })}
                />
              </SimpleGrid>

              {problems[i] && (
                <Text fz="sm" c="red">
                  {problems[i]}
                </Text>
              )}

              <Group justify="flex-end">
                <Button size="xs" variant="subtle" color="red" onClick={() => removeGift(i)}>
                  Xóa
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>

      <Group justify="flex-end">
        <Button
          color="pink"
          radius="md"
          loading={saving}
          disabled={!dirty || !valid || saving}
          onClick={() => void save()}
        >
          Lưu mừng cưới
        </Button>
      </Group>
    </Stack>
  );
}