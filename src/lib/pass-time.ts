import holidayJp from "@holiday-jp/holiday_jp";

/** 土日夜パスが平日に使える時刻（日本時間 19:30） */
const WEEKNIGHT_START_MINUTES = 19 * 60 + 30;

function jstCalendarDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function jstWeekdaySun0(now: Date): number {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    weekday: "short",
  }).format(now);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

function jstMinutesFromMidnight(now: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);
  return hour * 60 + minute;
}

/** パス種別から見て、今は利用時間外か（STEP 5-5） */
export function isOutsidePassHours(
  passType: string | null,
  now = new Date(),
): boolean {
  if (!passType || passType === "フリー") {
    return false;
  }

  const weekday = jstWeekdaySun0(now);
  const isWeekend = weekday === 0 || weekday === 6;
  const holiday = holidayJp.isHoliday(jstCalendarDate(now));
  const isWeekday = !isWeekend && !holiday;

  if (passType === "平日") {
    return !isWeekday;
  }

  if (passType === "土日夜") {
    if (!isWeekday) {
      return false;
    }
    return jstMinutesFromMidnight(now) < WEEKNIGHT_START_MINUTES;
  }

  return false;
}
