export const shortDate = (date: Date) => date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });

export function mondayOf(date: Date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  return monday;
}

export function shifted(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

// Keep the existing unpadded format so earlier workout marks still match.
export function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function weekOffset(base: Date, date: Date) {
  const start = mondayOf(base);
  const target = mondayOf(date);
  return (Date.UTC(target.getFullYear(), target.getMonth(), target.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 604_800_000;
}

export function monthDates(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const start = mondayOf(first);
  const count = Math.ceil(((first.getDay() + 6) % 7 + last.getDate()) / 7) * 7;
  return Array.from({ length: count }, (_, index) => shifted(start, index));
}
