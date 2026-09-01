"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LoginFormProps = {
  returnUrl: string;
};

export function LoginForm({ returnUrl }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // デフォルトイベント（ここではonSubmit)を止める)
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Supabase クライアントを作り、メールとパスワードでログインを依頼。結果の error を signInError に受け取る
      const supabase = createClient();
      const signInPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      // 応答がないまま固まるケースを切り分ける
      const timeoutPromise = new Promise<never>((_, reject) => {
        window.setTimeout(() => {
          reject(new Error("TIMEOUT"));
        }, 15000);
      });

      const { error: signInError } = await Promise.race([
        signInPromise,
        timeoutPromise,
      ]);

      //エラーが存在した場合setErrorとsetLoadingに指定している内容をセットする
      if (signInError) {
        setError(`ログインに失敗しました（${signInError.message}）`);
        return;
      }

      //ログイン成功後、returnUrl（元々行きたかったページ）へ移動させる命令
      router.push(returnUrl);
      //サーバー側の表示を最新のcookieを使って更新する
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message === "TIMEOUT") {
        setError(
          "ログイン応答がありません（15秒タイムアウト）。開発者ツールの Network で token リクエストを確認してください。",
        );
        return;
      }

      setError(
        error instanceof Error
          ? `ログイン処理でエラーが発生しました（${error.message}）`
          : "ログイン処理で不明なエラーが発生しました",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-700"
        >
          メールアドレス
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-zinc-700"
        >
          パスワード
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
