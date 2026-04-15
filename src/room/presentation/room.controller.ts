import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
import { ListRoomsUseCase } from '../application/use-cases/list-rooms.use-case';
import { UpdateRoomStatusUseCase } from '../application/use-cases/update-room-status.use-case';
import { UpdateRoomUseCase } from '../application/use-cases/update-room.use-case';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { presentRoom } from './room.presenter';

@Controller('properties/:propertyId/rooms')
export class RoomController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly listRooms: ListRoomsUseCase,
    private readonly updateRoomStatus: UpdateRoomStatusUseCase,
    private readonly updateRoom: UpdateRoomUseCase,
  ) {}

  @Get()
  async list(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const items = await this.listRooms.execute(propertyId);
    return items.map(presentRoom);
  }

  @Post()
  async add(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateRoomDto,
  ) {
    const room = await this.createRoom.execute({
      propertyId,
      roomTypeId: dto.roomTypeId,
      number: dto.number,
      floor: dto.floor,
      notes: dto.notes,
    });
    return presentRoom(room);
  }

  @Patch(':roomId/status')
  async patchRoomStatus(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() dto: UpdateRoomStatusDto,
  ) {
    const room = await this.updateRoomStatus.execute({
      propertyId,
      roomId,
      operationalStatus: dto.operationalStatus,
    });
    return presentRoom(room);
  }

  @Patch(':roomId')
  async patchRoom(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() dto: UpdateRoomDto,
  ) {
    const room = await this.updateRoom.execute({
      propertyId,
      roomId,
      roomTypeId: dto.roomTypeId,
      number: dto.number,
      floor: dto.floor,
      notes: dto.notes,
    });
    return presentRoom(room);
  }
}
