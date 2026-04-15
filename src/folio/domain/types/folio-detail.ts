import type {
  ChargeCategory,
  FolioStatus,
  PaymentMethod,
} from '../../../../generated/prisma/enums';

export type FolioChargeRow = {
  id: string;
  category: ChargeCategory;
  description: string;
  quantity: number;
  unitAmount: string;
  totalAmount: string;
  chargedAt: Date;
  roomId: string | null;
};

export type FolioPaymentRow = {
  id: string;
  method: PaymentMethod;
  amount: string;
  reference: string | null;
  paidAt: Date;
  notes: string | null;
};

export type FolioDetail = {
  id: string;
  reservationId: string;
  status: FolioStatus;
  currency: string;
  openedAt: Date;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  charges: FolioChargeRow[];
  payments: FolioPaymentRow[];
};
