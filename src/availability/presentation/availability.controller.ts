import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { GetAvailabilityUseCase } from '../application/get-availability.use-case';
import { AvailabilityQueryDto } from './dto/availability-query.dto';

@Controller('properties/:propertyId/availability')
export class AvailabilityController {
  constructor(private readonly getAvailability: GetAvailabilityUseCase) {}

  @Get()
  async get(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Query() query: AvailabilityQueryDto,
  ) {
    return this.getAvailability.execute(propertyId, query.from, query.to);
  }
}
