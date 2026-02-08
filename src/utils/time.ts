import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatLastSeen(lastSeenAt: string | number | Date) {
  // User's current IANA timezone, e.g. "Asia/Colombo"
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const date = typeof lastSeenAt === "string" || typeof lastSeenAt === "number"
    ? new Date(lastSeenAt)
    : lastSeenAt;

  const zoned = toZonedTime(date, tz);

  // yyyy-MM-dd hh:mm:ss a => 12-hour time + AM/PM
  return format(zoned, "yyyy-MM-dd hh:mm:ss a");
}