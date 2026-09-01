/** 要件: Cookie 有効期限 365 日 */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * 現状はブラウザの signInWithPassword で Cookie を書くため httpOnly: false。
 * true だとログイン後に /checkin へ進んでも未認証扱いで /login に戻る（確認済み）。
 * 要件の HttpOnly は、サーバー側ログインに切り替えるときに満たす。
 */
export const AUTH_COOKIE_OPTIONS = {
  maxAge: SESSION_MAX_AGE_SECONDS,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  httpOnly: false,
};
