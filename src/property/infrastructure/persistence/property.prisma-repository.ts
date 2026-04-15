import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { Property } from '../../domain/entities/property.entity';
import type { PropertyRepository } from '../../domain/repositories/property.repository';
import { PropertyMapper } from './property.mapper';

@Injectable()
export class PropertyPrismaRepository implements PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveProperty(property: Property): Promise<void> {
    const data = PropertyMapper.toPersistenceProperty(property);
    await this.prisma.property.upsert({
      where: { id: property.id },
      create: data,
      update: {
        name: data.name,
        legalName: data.legalName,
        taxId: data.taxId,
        email: data.email,
        phone: data.phone,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        timezone: data.timezone,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findAllProperties(): Promise<Property[]> {
    const rows = await this.prisma.property.findMany({
      orderBy: { name: 'asc' },
    });
    return rows.map((r) => PropertyMapper.toDomainProperty(r));
  }

  async findPropertyById(id: string): Promise<Property | null> {
    const row = await this.prisma.property.findUnique({ where: { id } });
    return row ? PropertyMapper.toDomainProperty(row) : null;
  }
}
