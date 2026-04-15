import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import {
  GUEST_REPOSITORY,
  type GuestRepository,
} from '../../domain/repositories/guest.repository';

@Injectable()
export class DeleteGuestUseCase {
  constructor(
    @Inject(GUEST_REPOSITORY)
    private readonly guestRepository: GuestRepository,
  ) {}

  async execute(guestId: string): Promise<void> {
    const existing = await this.guestRepository.findById(guestId);
    if (!existing) {
      throw new NotFoundException(`Guest ${guestId} not found`);
    }
    const links =
      await this.guestRepository.countReservationGuestLinks(guestId);
    if (links > 0) {
      throw new ConflictException(
        'Cannot delete a guest linked to reservations; remove links first',
      );
    }
    try {
      await this.guestRepository.deleteById(guestId);
    } catch (e: unknown) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
        throw new ConflictException(
          'Cannot delete this guest because related records still exist',
        );
      }
      if (e instanceof Error) {
        throw e;
      }
      throw new Error('Unexpected error while deleting guest');
    }
  }
}
