import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { Guest } from '../../domain/entities/guest.entity';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
  type GuestSearchFilters,
} from '../../domain/repositories/guest.repository';

@Injectable()
export class SearchGuestsUseCase {
  constructor(
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(filters: GuestSearchFilters): Promise<Guest[]> {
    const hasEmail = Boolean(filters.email?.trim());
    const hasDocument = Boolean(filters.documentNumber?.trim());
    if (!hasEmail && !hasDocument) {
      throw new BadRequestException(
        'Provide at least one of: email, documentNumber',
      );
    }
    return this.guestRepository.search(filters);
  }
}
