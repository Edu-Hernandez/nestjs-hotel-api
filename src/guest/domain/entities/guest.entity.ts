import { randomUUID } from 'node:crypto';

export type GuestUpdatePatch = {
  firstName?: string;
  lastName?: string;
  email?: string | null;
  phone?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
  nationality?: string | null;
  birthDate?: Date | null;
  notes?: string | null;
};

export class Guest {
  private constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string | null,
    readonly phone: string | null,
    readonly documentType: string | null,
    readonly documentNumber: string | null,
    readonly nationality: string | null,
    readonly birthDate: Date | null,
    readonly notes: string | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    documentType?: string | null;
    documentNumber?: string | null;
    nationality?: string | null;
    birthDate?: Date | null;
    notes?: string | null;
  }): Guest {
    const now = new Date();
    return new Guest(
      randomUUID(),
      props.firstName.trim(),
      props.lastName.trim(),
      props.email?.trim() ? props.email.trim().toLowerCase() : null,
      props.phone?.trim() ? props.phone.trim() : null,
      props.documentType?.trim() ? props.documentType.trim() : null,
      props.documentNumber?.trim() ? props.documentNumber.trim() : null,
      props.nationality?.trim()
        ? props.nationality.trim().toUpperCase().slice(0, 2)
        : null,
      props.birthDate ?? null,
      props.notes?.trim() ? props.notes.trim() : null,
      now,
      now,
    );
  }

  static reconstitute(props: {
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
    return new Guest(
      props.id,
      props.firstName,
      props.lastName,
      props.email,
      props.phone,
      props.documentType,
      props.documentNumber,
      props.nationality,
      props.birthDate,
      props.notes,
      props.createdAt,
      props.updatedAt,
    );
  }

  withUpdates(patch: GuestUpdatePatch): Guest {
    const firstName =
      patch.firstName !== undefined ? patch.firstName.trim() : this.firstName;
    const lastName =
      patch.lastName !== undefined ? patch.lastName.trim() : this.lastName;
    const email =
      patch.email !== undefined
        ? patch.email?.trim()
          ? patch.email.trim().toLowerCase()
          : null
        : this.email;
    const phone =
      patch.phone !== undefined
        ? patch.phone?.trim()
          ? patch.phone.trim()
          : null
        : this.phone;
    const documentType =
      patch.documentType !== undefined
        ? patch.documentType?.trim()
          ? patch.documentType.trim()
          : null
        : this.documentType;
    const documentNumber =
      patch.documentNumber !== undefined
        ? patch.documentNumber?.trim()
          ? patch.documentNumber.trim()
          : null
        : this.documentNumber;
    const nationality =
      patch.nationality !== undefined
        ? patch.nationality?.trim()
          ? patch.nationality.trim().toUpperCase().slice(0, 2)
          : null
        : this.nationality;
    const birthDate =
      patch.birthDate !== undefined ? patch.birthDate : this.birthDate;
    const notes =
      patch.notes !== undefined
        ? patch.notes?.trim()
          ? patch.notes.trim()
          : null
        : this.notes;
    return new Guest(
      this.id,
      firstName,
      lastName,
      email,
      phone,
      documentType,
      documentNumber,
      nationality,
      birthDate,
      notes,
      this.createdAt,
      new Date(),
    );
  }
}

export function applyGuestPatch(guest: Guest, patch: GuestUpdatePatch): Guest {
  return guest.withUpdates(patch);
}
