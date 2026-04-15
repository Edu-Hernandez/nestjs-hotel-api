import type { Property } from '../domain/entities/property.entity';

export function presentProperty(p: Property) {
  return {
    id: p.id,
    name: p.name,
    legalName: p.legalName,
    taxId: p.taxId,
    email: p.email,
    phone: p.phone,
    addressLine1: p.addressLine1,
    addressLine2: p.addressLine2,
    city: p.city,
    state: p.state,
    postalCode: p.postalCode,
    country: p.country,
    timezone: p.timezone,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
