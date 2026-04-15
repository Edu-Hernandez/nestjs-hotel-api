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
import { AddReservationGuestUseCase } from '../application/use-cases/add-reservation-guest.use-case';
import { AssignReservationRoomUseCase } from '../application/use-cases/assign-reservation-room.use-case';
import { CancelReservationUseCase } from '../application/use-cases/cancel-reservation.use-case';
import { CheckInReservationUseCase } from '../application/use-cases/check-in-reservation.use-case';
import { CheckOutReservationUseCase } from '../application/use-cases/check-out-reservation.use-case';
import { CreateReservationUseCase } from '../application/use-cases/create-reservation.use-case';
import { GetReservationDetailUseCase } from '../application/use-cases/get-reservation-detail.use-case';
import { ListReservationsUseCase } from '../application/use-cases/list-reservations.use-case';
import { ReopenReservationUseCase } from '../application/use-cases/reopen-reservation.use-case';
import { RemoveReservationGuestUseCase } from '../application/use-cases/remove-reservation-guest.use-case';
import { RemoveReservationRoomUseCase } from '../application/use-cases/remove-reservation-room.use-case';
import { UpdateReservationGuestUseCase } from '../application/use-cases/update-reservation-guest.use-case';
import { UpdateReservationRoomUseCase } from '../application/use-cases/update-reservation-room.use-case';
import { UpdateReservationStatusUseCase } from '../application/use-cases/update-reservation-status.use-case';
import { UpdateReservationUseCase } from '../application/use-cases/update-reservation.use-case';
import { AddReservationGuestDto } from './dto/add-reservation-guest.dto';
import { AssignReservationRoomDto } from './dto/assign-reservation-room.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ListReservationsQueryDto } from './dto/list-reservations-query.dto';
import { UpdateReservationGuestDto } from './dto/update-reservation-guest.dto';
import { UpdateReservationRoomDto } from './dto/update-reservation-room.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  presentReservation,
  presentReservationDetail,
} from './reservation.presenter';

@Controller('properties/:propertyId/reservations')
export class ReservationController {
  constructor(
    private readonly createReservation: CreateReservationUseCase,
    private readonly listReservations: ListReservationsUseCase,
    private readonly getReservationDetail: GetReservationDetailUseCase,
    private readonly addReservationGuest: AddReservationGuestUseCase,
    private readonly assignReservationRoom: AssignReservationRoomUseCase,
    private readonly updateReservation: UpdateReservationUseCase,
    private readonly updateReservationStatus: UpdateReservationStatusUseCase,
    private readonly checkInReservation: CheckInReservationUseCase,
    private readonly checkOutReservation: CheckOutReservationUseCase,
    private readonly cancelReservation: CancelReservationUseCase,
    private readonly reopenReservation: ReopenReservationUseCase,
    private readonly removeReservationGuest: RemoveReservationGuestUseCase,
    private readonly updateReservationGuest: UpdateReservationGuestUseCase,
    private readonly removeReservationRoom: RemoveReservationRoomUseCase,
    private readonly updateReservationRoom: UpdateReservationRoomUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateReservationDto,
  ) {
    const reservation = await this.createReservation.execute({
      propertyId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      channel: dto.channel,
      adults: dto.adults,
      children: dto.children,
      currency: dto.currency,
      totalEstimated: dto.totalEstimated ?? null,
      specialRequests: dto.specialRequests ?? null,
      internalNotes: dto.internalNotes ?? null,
    });
    return presentReservation(reservation);
  }

  @Get()
  async list(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() query: ListReservationsQueryDto,
  ) {
    const items = await this.listReservations.execute({
      propertyId,
      status: query.status,
      checkInFrom: query.checkInFrom,
      checkInTo: query.checkInTo,
    });
    return items.map(presentReservation);
  }

  @Post(':reservationId/reopen')
  async reopen(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const reservation = await this.reopenReservation.execute(
      propertyId,
      reservationId,
    );
    return presentReservation(reservation);
  }

  @Post(':reservationId/check-in')
  async checkIn(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const reservation = await this.checkInReservation.execute(
      propertyId,
      reservationId,
    );
    return presentReservation(reservation);
  }

  @Post(':reservationId/check-out')
  async checkOut(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const reservation = await this.checkOutReservation.execute(
      propertyId,
      reservationId,
    );
    return presentReservation(reservation);
  }

  @Post(':reservationId/cancel')
  async cancel(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: CancelReservationDto,
  ) {
    const reservation = await this.cancelReservation.execute({
      propertyId,
      reservationId,
      cancellationReason: dto.cancellationReason ?? null,
    });
    return presentReservation(reservation);
  }

  @Patch(':reservationId/status')
  async patchStatus(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: UpdateReservationStatusDto,
  ) {
    const reservation = await this.updateReservationStatus.execute({
      propertyId,
      reservationId,
      status: dto.status,
    });
    return presentReservation(reservation);
  }

  @Patch(':reservationId')
  async patchReservation(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: UpdateReservationDto,
  ) {
    const reservation = await this.updateReservation.execute({
      propertyId,
      reservationId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      channel: dto.channel,
      adults: dto.adults,
      children: dto.children,
      currency: dto.currency,
      totalEstimated: dto.totalEstimated ?? undefined,
      specialRequests: dto.specialRequests ?? undefined,
      internalNotes: dto.internalNotes ?? undefined,
    });
    return presentReservation(reservation);
  }

  @Delete(':reservationId/guests/:guestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeGuest(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('guestId', ParseUUIDPipe) guestId: string,
  ) {
    await this.removeReservationGuest.execute(
      propertyId,
      reservationId,
      guestId,
    );
  }

  @Patch(':reservationId/guests/:guestId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchGuest(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('guestId', ParseUUIDPipe) guestId: string,
    @Body() dto: UpdateReservationGuestDto,
  ) {
    await this.updateReservationGuest.execute({
      propertyId,
      reservationId,
      guestId,
      isPrimary: dto.isPrimary,
    });
  }

  @Delete(':reservationId/rooms/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRoomAssignment(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
  ) {
    await this.removeReservationRoom.execute(
      propertyId,
      reservationId,
      assignmentId,
    );
  }

  @Patch(':reservationId/rooms/:assignmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async patchRoomAssignment(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @Body() dto: UpdateReservationRoomDto,
  ) {
    await this.updateReservationRoom.execute({
      propertyId,
      reservationId,
      assignmentId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      nightlyRate: dto.nightlyRate ?? null,
      lineTotal: dto.lineTotal ?? null,
      lineCurrency: dto.lineCurrency ?? null,
    });
  }

  @Get(':reservationId')
  async getOne(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const detail = await this.getReservationDetail.execute(
      propertyId,
      reservationId,
    );
    return presentReservationDetail(detail);
  }

  @Post(':reservationId/guests')
  @HttpCode(HttpStatus.CREATED)
  async addGuest(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: AddReservationGuestDto,
  ) {
    return this.addReservationGuest.execute({
      propertyId,
      reservationId,
      guestId: dto.guestId,
      isPrimary: dto.isPrimary,
    });
  }

  @Post(':reservationId/rooms')
  @HttpCode(HttpStatus.CREATED)
  async assignRoom(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: AssignReservationRoomDto,
  ) {
    return this.assignReservationRoom.execute({
      propertyId,
      reservationId,
      roomId: dto.roomId,
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      nightlyRate: dto.nightlyRate ?? null,
      lineTotal: dto.lineTotal ?? null,
      lineCurrency: dto.lineCurrency ?? null,
    });
  }
}
