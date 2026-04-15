import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePropertyUseCase } from '../application/use-cases/create-property.use-case';
import { GetPropertyByIdUseCase } from '../application/use-cases/get-property-by-id.use-case';
import { ListPropertiesUseCase } from '../application/use-cases/list-properties.use-case';
import { UpdatePropertyUseCase } from '../application/use-cases/update-property.use-case';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { presentProperty } from './property.presenter';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly listProperties: ListPropertiesUseCase,
    private readonly getPropertyById: GetPropertyByIdUseCase,
    private readonly updateProperty: UpdatePropertyUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreatePropertyDto) {
    const property = await this.createProperty.execute({
      name: dto.name,
      legalName: dto.legalName,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      timezone: dto.timezone,
    });
    return presentProperty(property);
  }

  @Get()
  async list() {
    const items = await this.listProperties.execute();
    return items.map(presentProperty);
  }

  @Get(':propertyId')
  async getOne(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    const property = await this.getPropertyById.execute(propertyId);
    return presentProperty(property);
  }

  @Patch(':propertyId')
  async patch(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    const property = await this.updateProperty.execute({
      propertyId,
      name: dto.name,
      legalName: dto.legalName,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      postalCode: dto.postalCode,
      country: dto.country,
      timezone: dto.timezone,
      isActive: dto.isActive,
    });
    return presentProperty(property);
  }
}
