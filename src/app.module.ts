import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AvailabilityModule } from './availability/availability.module';
import { FolioModule } from './folio/folio.module';
import { GuestModule } from './guest/guest.module';
import { PropertyModule } from './property/property.module';
import { RatePlanModule } from './rate-plan/rate-plan.module';
import { ReservationModule } from './reservation/reservation.module';
import { RoomBlockModule } from './room-block/room-block.module';
import { RoomModule } from './room/room.module';
import { RoomTypeModule } from './room-type/room-type.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PropertyModule,
    RoomTypeModule,
    RoomModule,
    RoomBlockModule,
    AvailabilityModule,
    GuestModule,
    ReservationModule,
    RatePlanModule,
    FolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
