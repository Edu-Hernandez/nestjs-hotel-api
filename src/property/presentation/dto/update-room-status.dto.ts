import { IsEnum } from 'class-validator';
import { RoomOperationalStatus } from '../../domain/room-operational-status';

export class UpdateRoomStatusDto {
  @IsEnum(RoomOperationalStatus)
  operationalStatus!: RoomOperationalStatus;
}
