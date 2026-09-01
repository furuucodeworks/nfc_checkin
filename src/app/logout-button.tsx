import { logout } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-700 hover:underline"
      >
        ログアウト
      </button>
    </form>
  );
}
