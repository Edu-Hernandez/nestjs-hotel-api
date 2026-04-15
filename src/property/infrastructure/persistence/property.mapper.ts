import { Property } from '../../domain/entities/property.entity';

export class PropertyMapper {
  static toDomainProperty(row: {
    id: string;
    name: string;
    legalName: string | null;
    taxId: string | null;
    email: string | null;
    phone: string | null;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string | null;
    postalCode: string | null;
    country: string;
    timezone: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Property {
    return Property.reconstitute({
      id: row.id,
      name: row.name,
      legalName: row.legalName,
      taxId: row.taxId,
      email: row.email,
      phone: row.phone,
      addressLine1: row.addressLine1,
      addressLine2: row.addressLine2,
      city: row.city,
      state: row.state,
      postalCode: row.postalCode,
      country: row.country,
      timezone: row.timezone,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistenceProperty(property: Property) {
    return {
      id: property.id,
      name: property.name,
      legalName: property.legalName,
      taxId: property.taxId,
      email: property.email,
      phone: property.phone,
      addressLine1: property.addressLine1,
      addressLine2: property.addressLine2,
      city: property.city,
      state: property.state,
      postalCode: property.postalCode,
      country: property.country,
      timezone: property.timezone,
      isActive: property.isActive,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}
