import { LogoutButton } from "@/app/logout-button";
import { LOCATIONS, isValidLocationId } from "@/lib/locations";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ location_id: string }>;
};

export default async function CheckinPage({ params }: PageProps) {
  const { location_id } = await params;

  //locaton_idが存在するのかを判定している。存在しない場合は404。
  if (!isValidLocationId(location_id)) {
    notFound();
  }

  const facilityName = LOCATIONS[location_id];
  //emailをcookieデータ内から取得。
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email as string | undefined;

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-6">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">Hello</h1>
        <p className="mt-4 text-zinc-600">{facilityName}</p>
        <p className="mt-1 text-sm text-zinc-400">location_id: {location_id}</p>
        {email && (
          <p className="mt-6 text-sm text-zinc-600">
            ログイン中: <span className="font-medium">{email}</span>
          </p>
        )}
        <div className="mt-4">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
