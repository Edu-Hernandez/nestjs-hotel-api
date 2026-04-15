import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import type { Guest } from '../../domain/entities/guest.entity';
import type {
  GuestRepository,
  GuestSearchFilters,
} from '../../domain/repositories/guest.repository';
import { GuestMapper } from './guest.mapper';

@Injectable()
export class GuestPrismaRepository implements GuestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(guest: Guest): Promise<void> {
    const data = GuestMapper.toPersistence(guest);
    await this.prisma.guest.create({ data });
  }

  async update(guest: Guest): Promise<void> {
    const data = GuestMapper.toPersistence(guest);
    await this.prisma.guest.update({
      where: { id: guest.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        nationality: data.nationality,
        birthDate: data.birthDate,
        notes: data.notes,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findById(id: string): Promise<Guest | null> {
    const row = await this.prisma.guest.findUnique({ where: { id } });
    return row ? GuestMapper.toDomain(row) : null;
  }

  async search(filters: GuestSearchFilters): Promise<Guest[]> {
    const or: Prisma.GuestWhereInput[] = [];
    if (filters.email?.trim()) {
      or.push({ email: filters.email.trim().toLowerCase() });
    }
    if (filters.documentNumber?.trim()) {
      const doc = filters.documentNumber.trim();
      or.push({
        documentNumber: doc,
        ...(filters.documentType?.trim()
          ? { documentType: filters.documentType.trim() }
          : {}),
      });
    }
    if (or.length === 0) {
      return [];
    }
    const rows = await this.prisma.guest.findMany({
      where: { OR: or },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
    return rows.map((r) => GuestMapper.toDomain(r));
  }

  async countReservationGuestLinks(guestId: string): Promise<number> {
    return this.prisma.reservationGuest.count({ where: { guestId } });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.guest.delete({ where: { id } });
  }
}
