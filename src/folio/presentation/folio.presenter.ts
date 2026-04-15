import type { FolioDetail } from '../domain/types/folio-detail';

export function presentFolioDetail(f: FolioDetail) {
  return {
    id: f.id,
    reservationId: f.reservationId,
    status: f.status,
    currency: f.currency,
    openedAt: f.openedAt.toISOString(),
    closedAt: f.closedAt?.toISOString() ?? null,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
    charges: f.charges.map((c) => ({
      id: c.id,
      category: c.category,
      description: c.description,
      quantity: c.quantity,
      unitAmount: c.unitAmount,
      totalAmount: c.totalAmount,
      chargedAt: c.chargedAt.toISOString(),
      roomId: c.roomId,
    })),
    payments: f.payments.map((p) => ({
      id: p.id,
      method: p.method,
      amount: p.amount,
      reference: p.reference,
      paidAt: p.paidAt.toISOString(),
      notes: p.notes,
    })),
  };
}
