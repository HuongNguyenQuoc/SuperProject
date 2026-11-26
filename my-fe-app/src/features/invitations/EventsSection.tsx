import { Alert, Badge, Button, Card, Group, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  eventService,
  type EventCreateBody,
  type EventDto,
  type EventType,
  type HostSide,
} from '../../services/event.service';
import { getErrorMessage } from '../../services/http';
import { useEvents } from './useEvents';

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
  { value: 'engagement', label: 'Lễ ăn hỏi' },
  { value: 'family_ceremony', label: 'Lễ gia tiên' },
  { value: 'religious_ceremony', label: 'Lễ thành hôn' },
  { value: 'reception', label: 'Tiệc cưới' },
  { value: 'other', label: 'Khác' },
];

const HOST_SIDE_OPTIONS: { value: HostSide; label: string }[] = [
  { value: 'groom', label: 'Nhà trai' },
  { value: 'bride', label: 'Nhà gái' },
  { value: 'both', label: 'Hai họ' },
];

const EVENT_TYPE_LABEL = Object.fromEntries(EVENT_TYPE_OPTIONS.map((o) => [o.value, o.label])) as Record<EventType, string>;
const HOST_SIDE_LABEL = Object.fromEntries(HOST_SIDE_OPTIONS.map((o) => [o.value, o.label])) as Record<HostSide, string>;

// Múi giờ mặc định cho sự kiện trong nước
const TIMEZONE = 'Asia/Ho_Chi_Minh';

// yyyy-mm-dd -> dd/mm/yyyy
function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Chuỗi rỗng gửi lên thành null
function orNull(value: string): string | null {
  const v = value.trim();
  return v === '' ? null : v;
}

type EventsSectionProps = { invitationId: string; etag: string | null; onChanged?: () => Promise<unknown> };

export function EventsSection({ invitationId, etag, onChanged }: EventsSectionProps) {
  const { events, error, loading, reload: reloadEvents } = useEvents(invitationId);
  // Sau mỗi thay đổi sự kiện, tải lại cả thiệp để lấy revision (ETag) mới
  const reload = async () => {
    await reloadEvents();
    await onChanged?.();
  };
  // Đang mở form: null là đóng, 'new' là thêm mới, còn lại là đối tượng sự kiện đang sửa
  const [formMode, setFormMode] = useState<'new' | EventDto | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const remove = async (event: EventDto) => {
    if (!window.confirm(`Xóa "${event.display_name}"?`)) return;
    setActionError(null);
    try {
      await eventService.remove(invitationId, event.id, etag);
      if (formMode !== 'new' && formMode?.id === event.id) setFormMode(null);
      await reload();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const closeForm = () => setFormMode(null);

  const saved = async () => {
    setFormMode(null);
    await reload();
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>Sự kiện</Title>
        {formMode === null && (
          <Button variant="light" color="pink" radius="md" onClick={() => setFormMode('new')}>
            Thêm sự kiện
          </Button>
        )}
      </Group>

      {!!error && <Alert color="red">{getErrorMessage(error)}</Alert>}
      {actionError && <Alert color="red">{actionError}</Alert>}

      {!loading && events.length === 0 && formMode === null && (
        <Text c="dimmed" fz="sm">
          Chưa có sự kiện nào.
        </Text>
      )}

      <Stack gap="sm">
        {events.map((ev) => {
          const time = ev.start_time && ev.end_time ? `${ev.start_time}–${ev.end_time}` : ev.start_time;
          const meta = [formatDate(ev.event_date), time, ev.venue_name].filter(Boolean).join(' · ');
          const isEditing = typeof formMode === 'object' && formMode !== null && formMode.id === ev.id;

          return (
            <Card key={ev.id} withBorder radius="md" padding="md">
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <div>
                  <Text fw={600}>{ev.display_name}</Text>
                  <Group gap="xs" mt={4}>
                    <Badge variant="light" color="gray">
                      {EVENT_TYPE_LABEL[ev.event_type]}
                    </Badge>
                    <Badge variant="light" color="gray">
                      {HOST_SIDE_LABEL[ev.host_side]}
                    </Badge>
                  </Group>
                  {meta && (
                    <Text fz="sm" c="dimmed" mt={4}>
                      {meta}
                    </Text>
                  )}
                </div>
                <Group gap={4} wrap="nowrap">
                  <Button
                    size="xs"
                    variant="subtle"
                    color="dark"
                    disabled={isEditing}
                    onClick={() => setFormMode(ev)}
                  >
                    Sửa
                  </Button>
                  <Button size="xs" variant="subtle" color="red" onClick={() => void remove(ev)}>
                    Xóa
                  </Button>
                </Group>
              </Group>
            </Card>
          );
        })}
      </Stack>

      {formMode !== null && (
        <EventForm
          key={formMode === 'new' ? 'new' : formMode.id}
          invitationId={invitationId}
          etag={etag}
          initial={formMode === 'new' ? undefined : formMode}
          onCancel={closeForm}
          onSaved={saved}
        />
      )}
    </Stack>
  );
}

type EventFormProps = {
  invitationId: string;
  etag: string | null;
  initial?: EventDto;
  onCancel: () => void;
  onSaved: () => Promise<void>;
};

function EventForm({ invitationId, etag, initial, onCancel, onSaved }: EventFormProps) {
  const isEdit = initial !== undefined;

  const [eventType, setEventType] = useState<EventType | null>(initial?.event_type ?? 'reception');
  const [hostSide, setHostSide] = useState<HostSide | null>(initial?.host_side ?? 'both');
  const [eventName, setEventName] = useState(initial?.event_name ?? '');
  const [eventDate, setEventDate] = useState(initial?.event_date ?? '');
  const [startTime, setStartTime] = useState(initial?.start_time ?? '');
  const [endTime, setEndTime] = useState(initial?.end_time ?? '');
  const [venue, setVenue] = useState(initial?.venue_name ?? '');
  const [address, setAddress] = useState(initial?.address ?? '');
  const [mapsUrl, setMapsUrl] = useState(initial?.maps_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapsInvalid = mapsUrl.trim() !== '' && !/^https?:\/\//i.test(mapsUrl.trim());
  const canSave = !!eventType && !!hostSide && !mapsInvalid && !saving;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!eventType || !hostSide) return;

    // Khi sửa, gửi đủ các trường: ô trống sẽ thành null và xóa giá trị cũ
    const body: EventCreateBody = {
      event_type: eventType,
      host_side: hostSide,
      event_name: orNull(eventName),
      event_date: orNull(eventDate),
      start_time: orNull(startTime),
      end_time: orNull(endTime),
      timezone: TIMEZONE,
      venue_name: orNull(venue),
      address: orNull(address),
      maps_url: orNull(mapsUrl),
    };

    setSaving(true);
    setError(null);
    try {
      if (initial) {
        await eventService.update(invitationId, initial.id, body, etag);
      } else {
        await eventService.create(invitationId, body, etag);
      }
      await onSaved();
    } catch (err) {
      setError(getErrorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Card withBorder radius="md" padding="lg">
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <Title order={4}>{isEdit ? 'Sửa sự kiện' : 'Sự kiện mới'}</Title>

          {error && <Alert color="red">{error}</Alert>}

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Select
              label="Loại"
              data={EVENT_TYPE_OPTIONS}
              value={eventType}
              onChange={(v) => setEventType(v as EventType | null)}
              allowDeselect={false}
            />
            <Select
              label="Bên tổ chức"
              data={HOST_SIDE_OPTIONS}
              value={hostSide}
              onChange={(v) => setHostSide(v as HostSide | null)}
              allowDeselect={false}
            />
          </SimpleGrid>

          <TextInput
            label="Tên sự kiện (không bắt buộc)"
            description="Để trống sẽ dùng tên mặc định theo loại và bên tổ chức"
            maxLength={120}
            value={eventName}
            onChange={(e) => setEventName(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput label="Ngày" type="date" value={eventDate} onChange={(e) => setEventDate(e.currentTarget.value)} />
            <TextInput label="Giờ bắt đầu" type="time" value={startTime} onChange={(e) => setStartTime(e.currentTarget.value)} />
            <TextInput label="Giờ kết thúc" type="time" value={endTime} onChange={(e) => setEndTime(e.currentTarget.value)} />
          </SimpleGrid>

          <TextInput label="Tên địa điểm" maxLength={200} value={venue} onChange={(e) => setVenue(e.currentTarget.value)} />
          <TextInput label="Địa chỉ" maxLength={500} value={address} onChange={(e) => setAddress(e.currentTarget.value)} />
          <TextInput
            label="Link bản đồ (không bắt buộc)"
            placeholder="https://..."
            maxLength={2048}
            value={mapsUrl}
            error={mapsInvalid ? 'Link phải bắt đầu bằng http:// hoặc https://' : undefined}
            onChange={(e) => setMapsUrl(e.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" color="pink" loading={saving} disabled={!canSave}>
              {isEdit ? 'Lưu sự kiện' : 'Thêm sự kiện'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}