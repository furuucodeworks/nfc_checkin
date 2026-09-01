import { LoginForm } from "./login-form";

type PageProps = {
  searchParams: Promise<{ returnUrl?: string }>;
};

//安全チェック
function resolveReturnUrl(returnUrl: string | undefined): string {
  if (!returnUrl?.startsWith("/checkin/")) {
    return "/";
  }
  return returnUrl;
}

//取得したクエリからURLを取り出し安全チェックをしている
export default async function LoginPage({ searchParams }: PageProps) {
  const { returnUrl } = await searchParams;
  const safeReturnUrl = resolveReturnUrl(returnUrl);

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-6 py-12">
      <main className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-900">ログイン</h1>
          <p className="mt-2 text-sm text-zinc-500">
            チェックインにはログインが必要です
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <LoginForm returnUrl={safeReturnUrl} />
        </div>
      </main>
    </div>
  );
}
