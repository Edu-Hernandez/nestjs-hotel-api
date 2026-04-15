import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Guest, applyGuestPatch } from '../../domain/entities/guest.entity';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
} from '../../domain/repositories/guest.repository';

export type UpdateGuestInput = {
  guestId: string;
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

@Injectable()
export class UpdateGuestUseCase {
  constructor(
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(input: UpdateGuestInput): Promise<Guest> {
    const hasPatch =
      input.firstName !== undefined ||
      input.lastName !== undefined ||
      input.email !== undefined ||
      input.phone !== undefined ||
      input.documentType !== undefined ||
      input.documentNumber !== undefined ||
      input.nationality !== undefined ||
      input.birthDate !== undefined ||
      input.notes !== undefined;
    if (!hasPatch) {
      throw new BadRequestException('Provide at least one field to update');
    }
    const existing = await this.guestRepository.findById(input.guestId);
    if (!existing) {
      throw new NotFoundException(`Guest ${input.guestId} not found`);
    }
    const updated: Guest = applyGuestPatch(existing, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      documentType: input.documentType,
      documentNumber: input.documentNumber,
      nationality: input.nationality,
      birthDate: input.birthDate,
      notes: input.notes,
    });
    await this.guestRepository.update(updated);
    return updated;
  }
}
