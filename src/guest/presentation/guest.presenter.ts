import type { Guest } from '../domain/entities/guest.entity';

export function presentGuest(g: Guest) {
  return {
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    email: g.email,
    phone: g.phone,
    documentType: g.documentType,
    documentNumber: g.documentNumber,
    nationality: g.nationality,
    birthDate: g.birthDate ? g.birthDate.toISOString().slice(0, 10) : null,
    notes: g.notes,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  };
}
