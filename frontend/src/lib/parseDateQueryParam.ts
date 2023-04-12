import "temporal-polyfill/global";

export function parseDateQueryParam(date: string | null) {
  if (!date) {
    return null;
  }
  return Temporal.PlainDate.from(date);
}
