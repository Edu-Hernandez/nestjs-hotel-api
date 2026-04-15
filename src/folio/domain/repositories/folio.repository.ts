import type {
  ChargeCategory,
  FolioStatus,
  PaymentMethod,
} from '../../../../generated/prisma/enums';
import type { FolioDetail } from '../types/folio-detail';

export const FOLIO_REPOSITORY = Symbol('FOLIO_REPOSITORY');

export interface FolioRepository {
  reservationBelongsToProperty(
    reservationId: string,
    propertyId: string,
  ): Promise<boolean>;
  getReservationCurrency(
    reservationId: string,
    propertyId: string,
  ): Promise<string | null>;
  createFolio(input: {
    id: string;
    reservationId: string;
    currency: string;
  }): Promise<void>;
  findFolioDetailByReservation(
    reservationId: string,
    propertyId: string,
  ): Promise<FolioDetail | null>;
  updateFolioStatus(
    reservationId: string,
    propertyId: string,
    status: FolioStatus,
    closedAt: Date | null,
  ): Promise<void>;
  addCharge(input: {
    id: string;
    folioId: string;
    category: ChargeCategory;
    description: string;
    quantity: number;
    unitAmount: string;
    totalAmount: string;
    roomId: string | null;
  }): Promise<void>;
  addPayment(input: {
    id: string;
    folioId: string;
    method: PaymentMethod;
    amount: string;
    reference: string | null;
    notes: string | null;
  }): Promise<void>;
  updateCharge(input: {
    chargeId: string;
    reservationId: string;
    propertyId: string;
    category?: ChargeCategory;
    description?: string;
    quantity?: number;
    unitAmount?: string;
    totalAmount?: string;
    roomId?: string | null;
  }): Promise<number>;
  deleteCharge(
    chargeId: string,
    reservationId: string,
    propertyId: string,
  ): Promise<number>;
  updatePayment(input: {
    paymentId: string;
    reservationId: string;
    propertyId: string;
    method?: PaymentMethod;
    amount?: string;
    reference?: string | null;
    notes?: string | null;
  }): Promise<number>;
  deletePayment(
    paymentId: string,
    reservationId: string,
    propertyId: string,
  ): Promise<number>;
}
