export const RoomOperationalStatus = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  CLEANING: 'CLEANING',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
} as const;

export type RoomOperationalStatus =
  (typeof RoomOperationalStatus)[keyof typeof RoomOperationalStatus];

export function isRoomOperationalStatus(
  value: string,
): value is RoomOperationalStatus {
  return Object.values(RoomOperationalStatus).includes(
    value as RoomOperationalStatus,
  );
}
