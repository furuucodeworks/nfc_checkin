export type DisplayLanguage = "ja" | "en" | "zh";

export type CheckinFailureStatus =
  | "未払い"
  | "期限切れ"
  | "施設不一致"
  | "時間外";

export function resolveDisplayLanguage(
  value: string | null | undefined,
): DisplayLanguage {
  if (value === "en" || value === "zh") {
    return value;
  }
  return "ja";
}

function formatDate(isoDate: string, language: DisplayLanguage): string {
  const [year, month, day] = isoDate.split("-");
  if (language === "en") {
    return `${year}-${month}-${day}`;
  }
  return `${year}年${Number(month)}月${Number(day)}日`;
}

const DATE_TIME_LOCALE: Record<DisplayLanguage, string> = {
  ja: "ja-JP",
  en: "en-US",
  zh: "zh-CN",
};

function formatDateTime(isoDateTime: string, language: DisplayLanguage): string {
  return new Intl.DateTimeFormat(DATE_TIME_LOCALE[language], {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDateTime));
}

const PASS_TYPE_EN: Record<string, string> = {
  フリー: "Free",
  平日: "Weekday",
  土日夜: "Weekend / evening",
};

const PASS_TYPE_ZH: Record<string, string> = {
  フリー: "不限时",
  平日: "平日",
  土日夜: "周末/夜间",
};

const COPY = {
  ja: {
    titleDone: "チェックイン完了",
    titleAlready: "チェックイン済み",
    titleError: "チェックインできません",
    photoAlt: "登録写真",
    nameMissing: "名前を取得できませんでした",
    alreadyMessage: "本日はすでにチェックイン済みです",
    applicationMissing: "申し込み情報を取得できませんでした",
    successMessage: "チェックインが完了しました",
    logout: "ログアウト",
    passTypeLabel: (passType: string) => `パスの種類: ${passType}`,
    expiresOnLabel: (isoDate: string) => `有効期限: ${formatDate(isoDate, "ja")}`,
    sharedLabel: (isShared: boolean) => `共通化: ${isShared ? "あり" : "なし"}`,
    remainingDays: (days: number) => `残り${days}日`,
    todayCheckin: (isoDateTime: string) =>
      `本日のチェックイン: ${formatDateTime(isoDateTime, "ja")}`,
    facility: {
      saitama: "埼玉/熊谷",
      obuse: "小布施",
      aichi: "愛知",
    },
    errors: {
      未払い: "お支払いが確認できていません。受付へお越しください",
      期限切れ: "ご利用期限が過ぎています。受付へお越しください",
      施設不一致:
        "このパスはこの施設ではご利用いただけません。受付へお越しください",
      時間外: "現在の時間帯はご利用いただけません。受付へお越しください",
    },
  },
  en: {
    titleDone: "Check-in complete",
    titleAlready: "Already checked in",
    titleError: "Unable to check in",
    photoAlt: "Registered photo",
    nameMissing: "Name could not be loaded",
    alreadyMessage: "You have already checked in today",
    applicationMissing: "Pass information could not be loaded",
    successMessage: "Check-in is complete",
    logout: "Log out",
    passTypeLabel: (passType: string) =>
      `Pass: ${PASS_TYPE_EN[passType] ?? passType}`,
    expiresOnLabel: (isoDate: string) =>
      `Valid through: ${formatDate(isoDate, "en")}`,
    sharedLabel: (isShared: boolean) =>
      `Multi-site: ${isShared ? "Yes" : "No"}`,
    remainingDays: (days: number) =>
      days === 1 ? "1 day left" : `${days} days left`,
    todayCheckin: (isoDateTime: string) =>
      `Checked in today: ${formatDateTime(isoDateTime, "en")}`,
    facility: {
      saitama: "Saitama / Kumagaya",
      obuse: "Obuse",
      aichi: "Aichi",
    },
    errors: {
      未払い: "Payment has not been confirmed. Please go to reception.",
      期限切れ: "This pass has expired. Please go to reception.",
      施設不一致: "This pass cannot be used at this facility. Please go to reception.",
      時間外: "This pass cannot be used at this time. Please go to reception.",
    },
  },
  zh: {
    titleDone: "签到完成",
    titleAlready: "已签到",
    titleError: "无法签到",
    photoAlt: "登记照片",
    nameMissing: "无法读取姓名",
    alreadyMessage: "今天已经签到过了",
    applicationMissing: "无法读取套票信息",
    successMessage: "签到已完成",
    logout: "退出登录",
    passTypeLabel: (passType: string) =>
      `套票种类: ${PASS_TYPE_ZH[passType] ?? passType}`,
    expiresOnLabel: (isoDate: string) =>
      `有效期: ${formatDate(isoDate, "zh")}`,
    sharedLabel: (isShared: boolean) =>
      `多馆通用: ${isShared ? "有" : "无"}`,
    remainingDays: (days: number) => `剩余${days}天`,
    todayCheckin: (isoDateTime: string) =>
      `今日签到: ${formatDateTime(isoDateTime, "zh")}`,
    facility: {
      saitama: "埼玉/熊谷",
      obuse: "小布施",
      aichi: "爱知",
    },
    errors: {
      未払い: "尚未确认付款。请前往前台。",
      期限切れ: "套票已过期。请前往前台。",
      施設不一致: "此套票无法在本馆使用。请前往前台。",
      時間外: "当前时段无法使用。请前往前台。",
    },
  },
} as const;

export function checkinCopy(language: DisplayLanguage) {
  return COPY[language];
}
