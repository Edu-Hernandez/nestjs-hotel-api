import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { CreateGuestUseCase } from './application/use-cases/create-guest.use-case';
import { DeleteGuestUseCase } from './application/use-cases/delete-guest.use-case';
import { GetGuestByIdUseCase } from './application/use-cases/get-guest-by-id.use-case';
import { SearchGuestsUseCase } from './application/use-cases/search-guests.use-case';
import { UpdateGuestUseCase } from './application/use-cases/update-guest.use-case';
import { GUEST_REPOSITORY } from './domain/repositories/guest.repository';
import { GuestPrismaRepository } from './infrastructure/persistence/guest.prisma-repository';
import { GuestController } from './presentation/guest.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GuestController],
  providers: [
    {
      provide: GUEST_REPOSITORY,
      useClass: GuestPrismaRepository,
    },
    CreateGuestUseCase,
    GetGuestByIdUseCase,
    SearchGuestsUseCase,
    UpdateGuestUseCase,
    DeleteGuestUseCase,
  ],
  exports: [GUEST_REPOSITORY],
})
export class GuestModule {}
