import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoomBlockUseCase } from '../application/use-cases/create-room-block.use-case';
import { DeleteRoomBlockUseCase } from '../application/use-cases/delete-room-block.use-case';
import { ListRoomBlocksUseCase } from '../application/use-cases/list-room-blocks.use-case';
import { UpdateRoomBlockUseCase } from '../application/use-cases/update-room-block.use-case';
import { CreateRoomBlockDto } from './dto/create-room-block.dto';
import { UpdateRoomBlockDto } from './dto/update-room-block.dto';
import { presentRoomBlock } from './room-block.presenter';

@Controller('properties/:propertyId/rooms/:roomId/blocks')
export class RoomBlockController {
  constructor(
    private readonly createRoomBlock: CreateRoomBlockUseCase,
    private readonly listRoomBlocks: ListRoomBlocksUseCase,
    private readonly updateRoomBlock: UpdateRoomBlockUseCase,
    private readonly deleteRoomBlock: DeleteRoomBlockUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() dto: CreateRoomBlockDto,
  ) {
    const block = await this.createRoomBlock.execute({
      propertyId,
      roomId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason ?? null,
    });
    return presentRoomBlock(block);
  }

  @Get()
  async list(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
  ) {
    const items = await this.listRoomBlocks.execute(propertyId, roomId);
    return items.map(presentRoomBlock);
  }

  @Patch(':blockId')
  async patch(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
    @Body() dto: UpdateRoomBlockDto,
  ) {
    const block = await this.updateRoomBlock.execute({
      propertyId,
      roomId,
      blockId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
    });
    return presentRoomBlock(block);
  }

  @Delete(':blockId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Param('blockId', ParseUUIDPipe) blockId: string,
  ) {
    await this.deleteRoomBlock.execute(propertyId, roomId, blockId);
  }
}
