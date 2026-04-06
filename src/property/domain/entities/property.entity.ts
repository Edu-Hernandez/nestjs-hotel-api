import { randomUUID } from 'node:crypto';

export class Property {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly legalName: string | null,
    readonly taxId: string | null,
    readonly email: string | null,
    readonly phone: string | null,
    readonly addressLine1: string,
    readonly addressLine2: string | null,
    readonly city: string,
    readonly state: string | null,
    readonly postalCode: string | null,
    readonly country: string,
    readonly timezone: string,
    readonly isActive: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}

  static create(props: {
    name: string;
    legalName?: string | null;
    taxId?: string | null;
    email?: string | null;
    phone?: string | null;
    addressLine1: string;
    addressLine2?: string | null;
    city: string;
    state?: string | null;
    postalCode?: string | null;
    country: string;
    timezone?: string;
  }): Property {
    const now = new Date();
    return new Property(
      randomUUID(),
      props.name,
      props.legalName ?? null,
      props.taxId ?? null,
      props.email ?? null,
      props.phone ?? null,
      props.addressLine1,
      props.addressLine2 ?? null,
      props.city,
      props.state ?? null,
      props.postalCode ?? null,
      props.country.toUpperCase().slice(0, 2),
      props.timezone ?? 'UTC',
      true,
      now,
      now,
    );
  }

  static reconstitute(props: {
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
    return new Property(
      props.id,
      props.name,
      props.legalName,
      props.taxId,
      props.email,
      props.phone,
      props.addressLine1,
      props.addressLine2,
      props.city,
      props.state,
      props.postalCode,
      props.country,
      props.timezone,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }
}
