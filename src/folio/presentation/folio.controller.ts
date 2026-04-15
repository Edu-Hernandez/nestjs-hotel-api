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
import { AddChargeUseCase } from '../application/use-cases/add-charge.use-case';
import { AddPaymentUseCase } from '../application/use-cases/add-payment.use-case';
import { CloseFolioUseCase } from '../application/use-cases/close-folio.use-case';
import { DeleteChargeUseCase } from '../application/use-cases/delete-charge.use-case';
import { DeletePaymentUseCase } from '../application/use-cases/delete-payment.use-case';
import { GetFolioUseCase } from '../application/use-cases/get-folio.use-case';
import { OpenFolioUseCase } from '../application/use-cases/open-folio.use-case';
import { UpdateChargeUseCase } from '../application/use-cases/update-charge.use-case';
import { UpdatePaymentUseCase } from '../application/use-cases/update-payment.use-case';
import { VoidFolioUseCase } from '../application/use-cases/void-folio.use-case';
import { AddChargeDto } from './dto/add-charge.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { OpenFolioDto } from './dto/open-folio.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { presentFolioDetail } from './folio.presenter';

@Controller('properties/:propertyId/reservations/:reservationId/folio')
export class FolioController {
  constructor(
    private readonly openFolio: OpenFolioUseCase,
    private readonly getFolio: GetFolioUseCase,
    private readonly closeFolio: CloseFolioUseCase,
    private readonly voidFolio: VoidFolioUseCase,
    private readonly addCharge: AddChargeUseCase,
    private readonly updateCharge: UpdateChargeUseCase,
    private readonly deleteCharge: DeleteChargeUseCase,
    private readonly addPayment: AddPaymentUseCase,
    private readonly updatePayment: UpdatePaymentUseCase,
    private readonly deletePayment: DeletePaymentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async open(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: OpenFolioDto,
  ) {
    const folio = await this.openFolio.execute({
      propertyId,
      reservationId,
      currency: dto.currency,
    });
    return presentFolioDetail(folio);
  }

  @Get()
  async get(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const folio = await this.getFolio.execute(propertyId, reservationId);
    return presentFolioDetail(folio);
  }

  @Patch('close')
  async close(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const folio = await this.closeFolio.execute(propertyId, reservationId);
    return presentFolioDetail(folio);
  }

  @Patch('void')
  async void(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
  ) {
    const folio = await this.voidFolio.execute(propertyId, reservationId);
    return presentFolioDetail(folio);
  }

  @Post('charges')
  @HttpCode(HttpStatus.CREATED)
  async postCharge(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: AddChargeDto,
  ) {
    const folio = await this.addCharge.execute({
      propertyId,
      reservationId,
      category: dto.category,
      description: dto.description,
      quantity: dto.quantity,
      unitAmount: dto.unitAmount,
      totalAmount: dto.totalAmount,
      roomId: dto.roomId ?? null,
    });
    return presentFolioDetail(folio);
  }

  @Patch('charges/:chargeId')
  async patchCharge(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('chargeId', ParseUUIDPipe) chargeId: string,
    @Body() dto: UpdateChargeDto,
  ) {
    const folio = await this.updateCharge.execute({
      propertyId,
      reservationId,
      chargeId,
      category: dto.category,
      description: dto.description,
      quantity: dto.quantity,
      unitAmount: dto.unitAmount,
      totalAmount: dto.totalAmount,
      roomId: dto.roomId,
    });
    return presentFolioDetail(folio);
  }

  @Delete('charges/:chargeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCharge(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('chargeId', ParseUUIDPipe) chargeId: string,
  ) {
    await this.deleteCharge.execute(propertyId, reservationId, chargeId);
  }

  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  async postPayment(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Body() dto: AddPaymentDto,
  ) {
    const folio = await this.addPayment.execute({
      propertyId,
      reservationId,
      method: dto.method,
      amount: dto.amount,
      reference: dto.reference ?? null,
      notes: dto.notes ?? null,
    });
    return presentFolioDetail(folio);
  }

  @Patch('payments/:paymentId')
  async patchPayment(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    const folio = await this.updatePayment.execute({
      propertyId,
      reservationId,
      paymentId,
      method: dto.method,
      amount: dto.amount,
      reference: dto.reference,
      notes: dto.notes,
    });
    return presentFolioDetail(folio);
  }

  @Delete('payments/:paymentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePayment(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('reservationId', ParseUUIDPipe) reservationId: string,
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ) {
    await this.deletePayment.execute(propertyId, reservationId, paymentId);
  }
}
