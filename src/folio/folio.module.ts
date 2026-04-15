import { Module } from '@nestjs/common';
import { PropertyModule } from '../property/property.module';
import { RoomModule } from '../room/room.module';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AddChargeUseCase } from './application/use-cases/add-charge.use-case';
import { AddPaymentUseCase } from './application/use-cases/add-payment.use-case';
import { CloseFolioUseCase } from './application/use-cases/close-folio.use-case';
import { DeleteChargeUseCase } from './application/use-cases/delete-charge.use-case';
import { DeletePaymentUseCase } from './application/use-cases/delete-payment.use-case';
import { GetFolioUseCase } from './application/use-cases/get-folio.use-case';
import { OpenFolioUseCase } from './application/use-cases/open-folio.use-case';
import { UpdateChargeUseCase } from './application/use-cases/update-charge.use-case';
import { UpdatePaymentUseCase } from './application/use-cases/update-payment.use-case';
import { VoidFolioUseCase } from './application/use-cases/void-folio.use-case';
import { FOLIO_REPOSITORY } from './domain/repositories/folio.repository';
import { FolioPrismaRepository } from './infrastructure/persistence/folio.prisma-repository';
import { FolioController } from './presentation/folio.controller';

@Module({
  imports: [PrismaModule, PropertyModule, RoomModule],
  controllers: [FolioController],
  providers: [
    {
      provide: FOLIO_REPOSITORY,
      useClass: FolioPrismaRepository,
    },
    OpenFolioUseCase,
    GetFolioUseCase,
    CloseFolioUseCase,
    VoidFolioUseCase,
    AddChargeUseCase,
    UpdateChargeUseCase,
    DeleteChargeUseCase,
    AddPaymentUseCase,
    UpdatePaymentUseCase,
    DeletePaymentUseCase,
  ],
})
export class FolioModule {}
