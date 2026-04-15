import { Inject, Injectable } from '@nestjs/common';
import { Guest } from '../../domain/entities/guest.entity';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
} from '../../domain/repositories/guest.repository';

export type CreateGuestInput = {
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
  nationality?: string | null;
  birthDate?: Date | null;
  notes?: string | null;
};

@Injectable()
export class CreateGuestUseCase {
  constructor(
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(input: CreateGuestInput): Promise<Guest> {
    const guest = Guest.create(input);
    await this.guestRepository.save(guest);
    return guest;
  }
}
