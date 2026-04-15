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
import { AddRateUseCase } from '../application/use-cases/add-rate.use-case';
import { CreateRatePlanUseCase } from '../application/use-cases/create-rate-plan.use-case';
import { DeleteRatePlanUseCase } from '../application/use-cases/delete-rate-plan.use-case';
import { DeleteRateUseCase } from '../application/use-cases/delete-rate.use-case';
import { GetRatePlanUseCase } from '../application/use-cases/get-rate-plan.use-case';
import { ListRatePlansUseCase } from '../application/use-cases/list-rate-plans.use-case';
import { ListRatesUseCase } from '../application/use-cases/list-rates.use-case';
import { UpdateRatePlanUseCase } from '../application/use-cases/update-rate-plan.use-case';
import { UpdateRateUseCase } from '../application/use-cases/update-rate.use-case';
import { CreateRatePlanDto } from './dto/create-rate-plan.dto';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRatePlanDto } from './dto/update-rate-plan.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { presentRate, presentRatePlan } from './rate-plan.presenter';

@Controller('properties/:propertyId/rate-plans')
export class RatePlanController {
  constructor(
    private readonly createRatePlan: CreateRatePlanUseCase,
    private readonly listRatePlans: ListRatePlansUseCase,
    private readonly getRatePlan: GetRatePlanUseCase,
    private readonly updateRatePlan: UpdateRatePlanUseCase,
    private readonly deleteRatePlan: DeleteRatePlanUseCase,
    private readonly addRate: AddRateUseCase,
    private readonly listRates: ListRatesUseCase,
    private readonly updateRate: UpdateRateUseCase,
    private readonly deleteRate: DeleteRateUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateRatePlanDto,
  ) {
    const plan = await this.createRatePlan.execute({
      propertyId,
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      isActive: dto.isActive,
    });
    return presentRatePlan(plan);
  }

  @Get()
  async list(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const items = await this.listRatePlans.execute(propertyId);
    return items.map(presentRatePlan);
  }

  @Get(':ratePlanId/rates')
  async listRatesForPlan(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
  ) {
    const items = await this.listRates.execute(propertyId, ratePlanId);
    return items.map(presentRate);
  }

  @Post(':ratePlanId/rates')
  @HttpCode(HttpStatus.CREATED)
  async addRateToPlan(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
    @Body() dto: CreateRateDto,
  ) {
    const rate = await this.addRate.execute({
      propertyId,
      ratePlanId,
      roomTypeId: dto.roomTypeId,
      validFrom: dto.validFrom,
      validTo: dto.validTo,
      amount: dto.amount,
      currency: dto.currency,
    });
    return presentRate(rate);
  }

  @Patch(':ratePlanId/rates/:rateId')
  async patchRate(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
    @Param('rateId', ParseUUIDPipe) rateId: string,
    @Body() dto: UpdateRateDto,
  ) {
    const rate = await this.updateRate.execute({
      propertyId,
      ratePlanId,
      rateId,
      roomTypeId: dto.roomTypeId,
      validFrom: dto.validFrom,
      validTo: dto.validTo,
      amount: dto.amount,
      currency: dto.currency,
    });
    return presentRate(rate);
  }

  @Delete(':ratePlanId/rates/:rateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRate(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
    @Param('rateId', ParseUUIDPipe) rateId: string,
  ) {
    await this.deleteRate.execute(propertyId, ratePlanId, rateId);
  }

  @Get(':ratePlanId')
  async getOne(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
  ) {
    const plan = await this.getRatePlan.execute(propertyId, ratePlanId);
    return presentRatePlan(plan);
  }

  @Patch(':ratePlanId')
  async patchPlan(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
    @Body() dto: UpdateRatePlanDto,
  ) {
    const plan = await this.updateRatePlan.execute({
      propertyId,
      ratePlanId,
      name: dto.name,
      code: dto.code,
      description: dto.description,
      isActive: dto.isActive,
    });
    return presentRatePlan(plan);
  }

  @Delete(':ratePlanId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePlan(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('ratePlanId', ParseUUIDPipe) ratePlanId: string,
  ) {
    await this.deleteRatePlan.execute(propertyId, ratePlanId);
  }
}
