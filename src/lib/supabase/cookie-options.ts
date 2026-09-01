/** 要件: Cookie 有効期限 365 日 */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * ログイン・ログアウトは Server Action が Cookie を書くため httpOnly: true。
 * ブラウザの signInWithPassword では true にできない（確認済み）。
 */
export const AUTH_COOKIE_OPTIONS = {
  maxAge: SESSION_MAX_AGE_SECONDS,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};
