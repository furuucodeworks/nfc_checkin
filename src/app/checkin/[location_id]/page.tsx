import { LogoutButton } from "@/app/logout-button";
import { LOCATIONS, isValidLocationId } from "@/lib/locations";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ location_id: string }>;
};

// 有効期限の残り日数を出すための関数（日本時間）
function todayJst(): string {
  // 今日の日付を YYYY-MM-DD で返す（計算の基準日）
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function remainingDaysFrom(expiresOn: string): number {
  // 有効期限までの残り日数を計算する。期限 − 今日
  const today = Date.parse(`${todayJst()}T00:00:00+09:00`);
  const expiry = Date.parse(`${expiresOn}T00:00:00+09:00`);
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function formatJaDate(isoDate: string): string {
  // 有効期限の表示用。計算はしない（2026-09-09 → 2026年9月9日）
  const [year, month, day] = isoDate.split("-");
  return `${year}年${Number(month)}月${Number(day)}日`;
}

export default async function CheckinPage({ params }: PageProps) {
  const { location_id } = await params;

  //locaton_idが存在するのかを判定している。存在しない場合は404。
  if (!isValidLocationId(location_id)) {
    notFound();
  }

  const facilityName = LOCATIONS[location_id];

  // Cookie の JWT からログイン中のユーザー ID を取り、accounts の名前と写真パスを読む
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  let accountName: string | null = null;
  let photoUrl: string | null = null;
  let passType: string | null = null;
  let expiresOn: string | null = null;
  let isShared: boolean | null = null;
  if (userId) {
    const { data: account } = await supabase
      .from("accounts")
      .select("name, photo_path")
      .eq("id", userId)
      .maybeSingle();
    accountName = account?.name ?? null;

    // 写真は Storage にある。期限付きの署名 URL を作って画面に渡す
    if (account?.photo_path) {
      const { data: signed } = await supabase.storage
        .from("photos")
        .createSignedUrl(account.photo_path, 60 * 10);
      photoUrl = signed?.signedUrl ?? null;
    }

    // 申し込み（パスの種類・有効期限・共通化）を読む
    const { data: application } = await supabase
      .from("applications")
      .select("id, pass_type, expires_on, is_shared")
      .eq("account_id", userId)
      .maybeSingle();
    passType = application?.pass_type ?? null;
    expiresOn = application?.expires_on ?? null;
    isShared = application?.is_shared ?? null;

    // NFCをかざしてこの画面が開いたとき、チェックイン記録を1行書く
    await supabase.from("checkins").insert({
      account_id: userId,
      application_id: application?.id ?? null,
      checkin_date_jst: todayJst(),
      location_id,
      status: "成功",
    });
    // 同じ日の成功が既にあると unique_checkin_per_day で失敗する。
    // 画面は出す。当日済みの判定画面は STEP 5。
  }

  // 残り日数を計算し、0〜7日のときだけ画面に出す
  const remainingDays =
    expiresOn !== null ? remainingDaysFrom(expiresOn) : null;
  const showRemainingDays =
    remainingDays !== null && remainingDays >= 0 && remainingDays <= 7;

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-6">
      <main className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-semibold text-zinc-900">
          チェックイン完了
        </h1>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={accountName ?? "登録写真"}
            className="mx-auto mt-6 h-48 w-48 rounded-2xl object-cover"
          />
        ) : null}
        {accountName ? (
          <p className="mt-4 text-xl font-medium text-zinc-800">{accountName}</p>
        ) : (
          <p className="mt-4 text-sm text-zinc-400">名前を取得できませんでした</p>
        )}
        {passType ? (
          <p className="mt-4 text-zinc-700">パスの種類: {passType}</p>
        ) : (
          <p className="mt-4 text-sm text-zinc-400">
            申し込み情報を取得できませんでした
          </p>
        )}
        {expiresOn ? (
          <p className="mt-1 text-zinc-700">
            有効期限: {formatJaDate(expiresOn)}
          </p>
        ) : null}
        {isShared !== null ? (
          <p className="mt-1 text-zinc-700">
            共通化: {isShared ? "あり" : "なし"}
          </p>
        ) : null}
        {showRemainingDays ? (
          <p className="mt-1 text-sm text-amber-700">残り{remainingDays}日</p>
        ) : null}
        <p className="mt-4 text-zinc-600">チェックインが完了しました</p>
        <p className="mt-6 text-sm text-zinc-500">{facilityName}</p>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </main>
    </div>
  );
}
