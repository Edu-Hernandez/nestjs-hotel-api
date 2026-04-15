import { Guest } from '../../domain/entities/guest.entity';

export class GuestMapper {
  static toDomain(row: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phone: string | null;
    documentType: string | null;
    documentNumber: string | null;
    nationality: string | null;
    birthDate: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Guest {
    return Guest.reconstitute({
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      documentType: row.documentType,
      documentNumber: row.documentNumber,
      nationality: row.nationality,
      birthDate: row.birthDate,
      notes: row.notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(guest: Guest) {
    return {
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      documentType: guest.documentType,
      documentNumber: guest.documentNumber,
      nationality: guest.nationality,
      birthDate: guest.birthDate,
      notes: guest.notes,
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    };
  }
}
