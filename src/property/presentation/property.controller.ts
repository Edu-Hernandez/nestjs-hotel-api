import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AddRoomTypeUseCase } from '../application/use-cases/add-room-type.use-case';
import { CreatePropertyUseCase } from '../application/use-cases/create-property.use-case';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
import { GetPropertyByIdUseCase } from '../application/use-cases/get-property-by-id.use-case';
import { ListPropertiesUseCase } from '../application/use-cases/list-properties.use-case';
import { ListRoomTypesUseCase } from '../application/use-cases/list-room-types.use-case';
import { ListRoomsUseCase } from '../application/use-cases/list-rooms.use-case';
import { UpdateRoomStatusUseCase } from '../application/use-cases/update-room-status.use-case';
import { CreatePropertyDto } from './dto/create-property.dto';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import {
  presentProperty,
  presentRoom,
  presentRoomType,
} from './property.presenter';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly listProperties: ListPropertiesUseCase,
    private readonly getPropertyById: GetPropertyByIdUseCase,
    private readonly addRoomType: AddRoomTypeUseCase,
    private readonly listRoomTypes: ListRoomTypesUseCase,
    private readonly createRoom: CreateRoomUseCase,
    private readonly listRooms: ListRoomsUseCase,
    private readonly updateRoomStatus: UpdateRoomStatusUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePropertyDto) {
    const property = await this.createProperty.execute({
      name: dto.name,
      legalName: dto.legalName,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      timezone: dto.timezone,
    });
    return presentProperty(property);
  }

  @Get()
  async list() {
    const items = await this.listProperties.execute();
    return items.map(presentProperty);
  }

  @Get(':propertyId/room-types')
  async listTypes(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const items = await this.listRoomTypes.execute(propertyId);
    return items.map(presentRoomType);
  }

  @Get(':propertyId/rooms')
  async listRoomsByProperty(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
  ) {
    const items = await this.listRooms.execute(propertyId);
    return items.map(presentRoom);
  }

  @Get(':propertyId')
  async getOne(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const property = await this.getPropertyById.execute(propertyId);
    return presentProperty(property);
  }

  @Post(':propertyId/room-types')
  async addType(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateRoomTypeDto,
  ) {
    const roomType = await this.addRoomType.execute({
      propertyId,
      name: dto.name,
      description: dto.description,
      maxAdults: dto.maxAdults,
      maxChildren: dto.maxChildren,
      sortOrder: dto.sortOrder,
    });
    return presentRoomType(roomType);
  }

  @Post(':propertyId/rooms')
  async addRoom(
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

  @Patch(':propertyId/rooms/:roomId/status')
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
}
