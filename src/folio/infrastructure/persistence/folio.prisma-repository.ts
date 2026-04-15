import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma/client';
import {
  FolioStatus,
  type ChargeCategory,
  type PaymentMethod,
} from '../../../../generated/prisma/enums';
import type {
  FolioDetail,
  FolioChargeRow,
  FolioPaymentRow,
} from '../../domain/types/folio-detail';
import type { FolioRepository } from '../../domain/repositories/folio.repository';
import { PrismaService } from '../../../shared/prisma/prisma.service';

function dec(v: Prisma.Decimal): string {
  return v.toString();
}

@Injectable()
export class FolioPrismaRepository implements FolioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async reservationBelongsToProperty(
    reservationId: string,
    propertyId: string,
  ): Promise<boolean> {
    const row = await this.prisma.reservation.findFirst({
      where: { id: reservationId, propertyId },
      select: { id: true },
    });
    return row !== null;
  }

  async getReservationCurrency(
    reservationId: string,
    propertyId: string,
  ): Promise<string | null> {
    const row = await this.prisma.reservation.findFirst({
      where: { id: reservationId, propertyId },
      select: { currency: true },
    });
    return row?.currency ?? null;
  }

  async createFolio(input: {
    id: string;
    reservationId: string;
    currency: string;
  }): Promise<void> {
    await this.prisma.folio.create({
      data: {
        id: input.id,
        reservationId: input.reservationId,
        currency: input.currency.toUpperCase().slice(0, 3),
        status: FolioStatus.OPEN,
      },
    });
  }

  async findFolioDetailByReservation(
    reservationId: string,
    propertyId: string,
  ): Promise<FolioDetail | null> {
    const row = await this.prisma.folio.findFirst({
      where: {
        reservationId,
        reservation: { propertyId },
      },
      include: {
        charges: { orderBy: { chargedAt: 'desc' } },
        payments: { orderBy: { paidAt: 'desc' } },
      },
    });
    if (!row) {
      return null;
    }
    const charges: FolioChargeRow[] = row.charges.map((c) => ({
      id: c.id,
      category: c.category,
      description: c.description,
      quantity: c.quantity,
      unitAmount: dec(c.unitAmount),
      totalAmount: dec(c.totalAmount),
      chargedAt: c.chargedAt,
      roomId: c.roomId,
    }));
    const payments: FolioPaymentRow[] = row.payments.map((p) => ({
      id: p.id,
      method: p.method,
      amount: dec(p.amount),
      reference: p.reference,
      paidAt: p.paidAt,
      notes: p.notes,
    }));
    return {
      id: row.id,
      reservationId: row.reservationId,
      status: row.status,
      currency: row.currency,
      openedAt: row.openedAt,
      closedAt: row.closedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      charges,
      payments,
    };
  }

  async updateFolioStatus(
    reservationId: string,
    propertyId: string,
    status: FolioStatus,
    closedAt: Date | null,
  ): Promise<void> {
    await this.prisma.folio.updateMany({
      where: {
        reservationId,
        reservation: { propertyId },
      },
      data: { status, closedAt, updatedAt: new Date() },
    });
  }

  async addCharge(input: {
    id: string;
    folioId: string;
    category: ChargeCategory;
    description: string;
    quantity: number;
    unitAmount: string;
    totalAmount: string;
    roomId: string | null;
  }): Promise<void> {
    await this.prisma.charge.create({
      data: {
        id: input.id,
        folioId: input.folioId,
        category: input.category,
        description: input.description,
        quantity: input.quantity,
        unitAmount: new Prisma.Decimal(input.unitAmount),
        totalAmount: new Prisma.Decimal(input.totalAmount),
        roomId: input.roomId,
      },
    });
  }

  async addPayment(input: {
    id: string;
    folioId: string;
    method: PaymentMethod;
    amount: string;
    reference: string | null;
    notes: string | null;
  }): Promise<void> {
    await this.prisma.payment.create({
      data: {
        id: input.id,
        folioId: input.folioId,
        method: input.method,
        amount: new Prisma.Decimal(input.amount),
        reference: input.reference,
        notes: input.notes,
      },
    });
  }

  async updateCharge(input: {
    chargeId: string;
    reservationId: string;
    propertyId: string;
    category?: ChargeCategory;
    description?: string;
    quantity?: number;
    unitAmount?: string;
    totalAmount?: string;
    roomId?: string | null;
  }): Promise<number> {
    const data: Prisma.ChargeUncheckedUpdateManyInput = {};
    if (input.category !== undefined) {
      data.category = input.category;
    }
    if (input.description !== undefined) {
      data.description = input.description;
    }
    if (input.quantity !== undefined) {
      data.quantity = input.quantity;
    }
    if (input.unitAmount !== undefined) {
      data.unitAmount = new Prisma.Decimal(input.unitAmount);
    }
    if (input.totalAmount !== undefined) {
      data.totalAmount = new Prisma.Decimal(input.totalAmount);
    }
    if (input.roomId !== undefined) {
      data.roomId = input.roomId;
    }
    const result = await this.prisma.charge.updateMany({
      where: {
        id: input.chargeId,
        folio: {
          reservationId: input.reservationId,
          reservation: { propertyId: input.propertyId },
        },
      },
      data,
    });
    return result.count;
  }

  async deleteCharge(
    chargeId: string,
    reservationId: string,
    propertyId: string,
  ): Promise<number> {
    const result = await this.prisma.charge.deleteMany({
      where: {
        id: chargeId,
        folio: {
          reservationId,
          reservation: { propertyId },
        },
      },
    });
    return result.count;
  }

  async updatePayment(input: {
    paymentId: string;
    reservationId: string;
    propertyId: string;
    method?: PaymentMethod;
    amount?: string;
    reference?: string | null;
    notes?: string | null;
  }): Promise<number> {
    const data: Prisma.PaymentUpdateManyMutationInput = {};
    if (input.method !== undefined) {
      data.method = input.method;
    }
    if (input.amount !== undefined) {
      data.amount = new Prisma.Decimal(input.amount);
    }
    if (input.reference !== undefined) {
      data.reference = input.reference;
    }
    if (input.notes !== undefined) {
      data.notes = input.notes;
    }
    const result = await this.prisma.payment.updateMany({
      where: {
        id: input.paymentId,
        folio: {
          reservationId: input.reservationId,
          reservation: { propertyId: input.propertyId },
        },
      },
      data,
    });
    return result.count;
  }

  async deletePayment(
    paymentId: string,
    reservationId: string,
    propertyId: string,
  ): Promise<number> {
    const result = await this.prisma.payment.deleteMany({
      where: {
        id: paymentId,
        folio: {
          reservationId,
          reservation: { propertyId },
        },
      },
    });
    return result.count;
  }
}
