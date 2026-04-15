import { Module } from '@nestjs/common';
import { GuestModule } from '../guest/guest.module';
import { PropertyModule } from '../property/property.module';
import { RoomModule } from '../room/room.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AddReservationGuestUseCase } from './application/use-cases/add-reservation-guest.use-case';
import { AssignReservationRoomUseCase } from './application/use-cases/assign-reservation-room.use-case';
import { CancelReservationUseCase } from './application/use-cases/cancel-reservation.use-case';
import { CheckInReservationUseCase } from './application/use-cases/check-in-reservation.use-case';
import { CheckOutReservationUseCase } from './application/use-cases/check-out-reservation.use-case';
import { CreateReservationUseCase } from './application/use-cases/create-reservation.use-case';
import { GetReservationDetailUseCase } from './application/use-cases/get-reservation-detail.use-case';
import { ListReservationsUseCase } from './application/use-cases/list-reservations.use-case';
import { ReopenReservationUseCase } from './application/use-cases/reopen-reservation.use-case';
import { RemoveReservationGuestUseCase } from './application/use-cases/remove-reservation-guest.use-case';
import { RemoveReservationRoomUseCase } from './application/use-cases/remove-reservation-room.use-case';
import { UpdateReservationGuestUseCase } from './application/use-cases/update-reservation-guest.use-case';
import { UpdateReservationRoomUseCase } from './application/use-cases/update-reservation-room.use-case';
import { UpdateReservationStatusUseCase } from './application/use-cases/update-reservation-status.use-case';
import { UpdateReservationUseCase } from './application/use-cases/update-reservation.use-case';
import { RESERVATION_REPOSITORY } from './domain/repositories/reservation.repository';
import { ReservationPrismaRepository } from './infrastructure/persistence/reservation.prisma-repository';
import { ReservationController } from './presentation/reservation.controller';

@Module({
  imports: [PrismaModule, PropertyModule, GuestModule, RoomModule],
  controllers: [ReservationController],
  providers: [
    {
      provide: RESERVATION_REPOSITORY,
      useClass: ReservationPrismaRepository,
    },
    CreateReservationUseCase,
    ListReservationsUseCase,
    GetReservationDetailUseCase,
    AddReservationGuestUseCase,
    AssignReservationRoomUseCase,
    UpdateReservationUseCase,
    UpdateReservationStatusUseCase,
    CheckInReservationUseCase,
    CheckOutReservationUseCase,
    CancelReservationUseCase,
    ReopenReservationUseCase,
    RemoveReservationGuestUseCase,
    UpdateReservationGuestUseCase,
    RemoveReservationRoomUseCase,
    UpdateReservationRoomUseCase,
  ],
})
export class ReservationModule {}
