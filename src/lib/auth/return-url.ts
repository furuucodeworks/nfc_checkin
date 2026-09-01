/** オープンリダイレクト防止。チェックイン URL だけを許可する。 */
export function isSafeReturnUrl(path: string): boolean {
  return path.startsWith("/checkin/") && !path.startsWith("//");
}

export function resolveReturnUrl(returnUrl: string | undefined): string {
  if (!returnUrl || !isSafeReturnUrl(returnUrl)) {
    return "/";
  }
  return returnUrl;
}
