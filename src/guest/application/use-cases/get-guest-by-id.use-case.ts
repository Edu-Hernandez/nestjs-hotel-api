import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Guest } from '../../domain/entities/guest.entity';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
} from '../../domain/repositories/guest.repository';

@Injectable()
export class GetGuestByIdUseCase {
  constructor(
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findById(id);
    if (!guest) {
      throw new NotFoundException(`Guest ${id} not found`);
    }
    return guest;
  }
}
