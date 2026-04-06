-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoomOperationalStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'CLEANING', 'OUT_OF_ORDER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "ReservationChannel" AS ENUM ('DIRECT', 'PHONE', 'EMAIL', 'WEB', 'OTA', 'WALK_IN', 'CORPORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "FolioStatus" AS ENUM ('OPEN', 'CLOSED', 'VOID');

-- CreateEnum
CREATE TYPE "ChargeCategory" AS ENUM ('ACCOMMODATION', 'FOOD_BEVERAGE', 'SERVICE', 'TAX', 'FEE', 'DAMAGE', 'ADJUSTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET', 'VOUCHER', 'OTHER');

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "tax_id" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address_line1" TEXT NOT NULL,
    "address_line2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postal_code" TEXT,
    "country" CHAR(2) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_adults" INTEGER NOT NULL DEFAULT 2,
    "max_children" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "number" TEXT NOT NULL,
    "floor" TEXT,
    "operational_status" "RoomOperationalStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "document_type" TEXT,
    "document_number" TEXT,
    "nationality" CHAR(2),
    "birth_date" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "public_code" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "channel" "ReservationChannel" NOT NULL DEFAULT 'DIRECT',
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "actual_check_in_at" TIMESTAMP(3),
    "actual_check_out_at" TIMESTAMP(3),
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "total_estimated" DECIMAL(14,2),
    "special_requests" TEXT,
    "internal_notes" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_guests" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reservation_guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_rooms" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "check_in_date" DATE NOT NULL,
    "check_out_date" DATE NOT NULL,
    "nightly_rate" DECIMAL(12,2),
    "line_total" DECIMAL(14,2),
    "line_currency" CHAR(3),
    "assigned_at" TIMESTAMP(3),

    CONSTRAINT "reservation_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_plans" (
    "id" UUID NOT NULL,
    "property_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" UUID NOT NULL,
    "rate_plan_id" UUID NOT NULL,
    "room_type_id" UUID NOT NULL,
    "valid_from" DATE NOT NULL,
    "valid_to" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folios" (
    "id" UUID NOT NULL,
    "reservation_id" UUID NOT NULL,
    "status" "FolioStatus" NOT NULL DEFAULT 'OPEN',
    "currency" CHAR(3) NOT NULL DEFAULT 'USD',
    "opened_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "charges" (
    "id" UUID NOT NULL,
    "folio_id" UUID NOT NULL,
    "category" "ChargeCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_amount" DECIMAL(12,2) NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "charged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" UUID,

    CONSTRAINT "charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "folio_id" UUID NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference" TEXT,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_blocks" (
    "id" UUID NOT NULL,
    "room_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "room_types_property_id_idx" ON "room_types"("property_id");

-- CreateIndex
CREATE INDEX "rooms_property_id_operational_status_idx" ON "rooms"("property_id", "operational_status");

-- CreateIndex
CREATE INDEX "rooms_room_type_id_idx" ON "rooms"("room_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_property_id_number_key" ON "rooms"("property_id", "number");

-- CreateIndex
CREATE INDEX "guests_email_idx" ON "guests"("email");

-- CreateIndex
CREATE INDEX "guests_document_number_idx" ON "guests"("document_number");

-- CreateIndex
CREATE INDEX "guests_last_name_first_name_idx" ON "guests"("last_name", "first_name");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_public_code_key" ON "reservations"("public_code");

-- CreateIndex
CREATE INDEX "reservations_property_id_status_idx" ON "reservations"("property_id", "status");

-- CreateIndex
CREATE INDEX "reservations_property_id_check_in_date_check_out_date_idx" ON "reservations"("property_id", "check_in_date", "check_out_date");

-- CreateIndex
CREATE INDEX "reservations_check_in_date_check_out_date_idx" ON "reservations"("check_in_date", "check_out_date");

-- CreateIndex
CREATE INDEX "reservation_guests_guest_id_idx" ON "reservation_guests"("guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_guests_reservation_id_guest_id_key" ON "reservation_guests"("reservation_id", "guest_id");

-- CreateIndex
CREATE INDEX "reservation_rooms_room_id_check_in_date_check_out_date_idx" ON "reservation_rooms"("room_id", "check_in_date", "check_out_date");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_rooms_reservation_id_room_id_key" ON "reservation_rooms"("reservation_id", "room_id");

-- CreateIndex
CREATE INDEX "rate_plans_property_id_idx" ON "rate_plans"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "rate_plans_property_id_code_key" ON "rate_plans"("property_id", "code");

-- CreateIndex
CREATE INDEX "rates_room_type_id_valid_from_valid_to_idx" ON "rates"("room_type_id", "valid_from", "valid_to");

-- CreateIndex
CREATE INDEX "rates_rate_plan_id_idx" ON "rates"("rate_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "folios_reservation_id_key" ON "folios"("reservation_id");

-- CreateIndex
CREATE INDEX "folios_status_idx" ON "folios"("status");

-- CreateIndex
CREATE INDEX "charges_folio_id_idx" ON "charges"("folio_id");

-- CreateIndex
CREATE INDEX "charges_room_id_idx" ON "charges"("room_id");

-- CreateIndex
CREATE INDEX "payments_folio_id_idx" ON "payments"("folio_id");

-- CreateIndex
CREATE INDEX "room_blocks_room_id_start_date_end_date_idx" ON "room_blocks"("room_id", "start_date", "end_date");

-- AddForeignKey
ALTER TABLE "room_types" ADD CONSTRAINT "room_types_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_guests" ADD CONSTRAINT "reservation_guests_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_guests" ADD CONSTRAINT "reservation_guests_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_rooms" ADD CONSTRAINT "reservation_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rate_plans" ADD CONSTRAINT "rate_plans_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_rate_plan_id_fkey" FOREIGN KEY ("rate_plan_id") REFERENCES "rate_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_folio_id_fkey" FOREIGN KEY ("folio_id") REFERENCES "folios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "charges" ADD CONSTRAINT "charges_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_folio_id_fkey" FOREIGN KEY ("folio_id") REFERENCES "folios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_blocks" ADD CONSTRAINT "room_blocks_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
