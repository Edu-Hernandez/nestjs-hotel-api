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
  Query,
} from '@nestjs/common';
import { CreateGuestUseCase } from '../application/use-cases/create-guest.use-case';
import { DeleteGuestUseCase } from '../application/use-cases/delete-guest.use-case';
import { GetGuestByIdUseCase } from '../application/use-cases/get-guest-by-id.use-case';
import { SearchGuestsUseCase } from '../application/use-cases/search-guests.use-case';
import { UpdateGuestUseCase } from '../application/use-cases/update-guest.use-case';
import { CreateGuestDto } from './dto/create-guest.dto';
import { SearchGuestsQueryDto } from './dto/search-guests-query.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { presentGuest } from './guest.presenter';

@Controller('guests')
export class GuestController {
  constructor(
    private readonly createGuest: CreateGuestUseCase,
    private readonly getGuestById: GetGuestByIdUseCase,
    private readonly searchGuests: SearchGuestsUseCase,
    private readonly updateGuest: UpdateGuestUseCase,
    private readonly deleteGuest: DeleteGuestUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateGuestDto) {
    const guest = await this.createGuest.execute({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      nationality: dto.nationality,
      birthDate: dto.birthDate
        ? new Date(`${dto.birthDate}T12:00:00.000Z`)
        : null,
      notes: dto.notes,
    });
    return presentGuest(guest);
  }

  @Get('search')
  async search(@Query() query: SearchGuestsQueryDto) {
    const items = await this.searchGuests.execute({
      email: query.email,
      documentNumber: query.documentNumber,
      documentType: query.documentType,
    });
    return items.map(presentGuest);
  }

  @Patch(':id')
  async patch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuestDto,
  ) {
    const guest = await this.updateGuest.execute({
      guestId: id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      nationality: dto.nationality,
      birthDate:
        dto.birthDate !== undefined
          ? new Date(`${dto.birthDate}T12:00:00.000Z`)
          : undefined,
      notes: dto.notes,
    });
    return presentGuest(guest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.deleteGuest.execute(id);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    const guest = await this.getGuestById.execute(id);
    return presentGuest(guest);
  }
}
