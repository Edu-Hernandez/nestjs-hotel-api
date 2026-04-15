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
import { ListRoomTypesUseCase } from '../application/use-cases/list-room-types.use-case';
import { UpdateRoomTypeUseCase } from '../application/use-cases/update-room-type.use-case';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { presentRoomType } from './room-type.presenter';

@Controller('properties/:propertyId/room-types')
export class RoomTypeController {
  constructor(
    private readonly addRoomType: AddRoomTypeUseCase,
    private readonly listRoomTypes: ListRoomTypesUseCase,
    private readonly updateRoomType: UpdateRoomTypeUseCase,
  ) {}

  @Get()
  async list(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const items = await this.listRoomTypes.execute(propertyId);
    return items.map(presentRoomType);
  }

  @Post()
  async add(
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

  @Patch(':roomTypeId')
  async patch(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomTypeId', ParseUUIDPipe) roomTypeId: string,
    @Body() dto: UpdateRoomTypeDto,
  ) {
    const roomType = await this.updateRoomType.execute({
      propertyId,
      roomTypeId,
      name: dto.name,
      description: dto.description,
      maxAdults: dto.maxAdults,
      maxChildren: dto.maxChildren,
      sortOrder: dto.sortOrder,
    });
    return presentRoomType(roomType);
  }
}
