import type { Guest } from '../entities/guest.entity';

export const GUEST_REPOSITORY = Symbol('GUEST_REPOSITORY');

export type GuestSearchFilters = {
  email?: string;
  documentNumber?: string;
  documentType?: string | null;
};

export interface GuestRepository {
  save(guest: Guest): Promise<void>;
  update(guest: Guest): Promise<void>;
  findById(id: string): Promise<Guest | null>;
  search(filters: GuestSearchFilters): Promise<Guest[]>;
  countReservationGuestLinks(guestId: string): Promise<number>;
  deleteById(id: string): Promise<void>;
}
