/** Interpreta YYYY-MM-DD como medianoche UTC (coherente con columnas @db.Date). */
export function parseDateOnly(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

export function isOnOrAfterDay(a: Date, b: Date): boolean {
  return a.getTime() >= b.getTime();
}

export function isOnOrBeforeDay(a: Date, b: Date): boolean {
  return a.getTime() <= b.getTime();
}
