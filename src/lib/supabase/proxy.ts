import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_OPTIONS } from "./cookie-options";

//pathが/checkin/が含まれているか//(危険なURL)で始まっていないか判定している
function isSafeReturnUrl(path: string): boolean {
  return path.startsWith("/checkin/") && !path.startsWith("//");
}

export async function updateSession(request: NextRequest) {
  //特別なことがなければリクエストをそのまま進める
  let supabaseResponse = NextResponse.next({ request });

  //supabaseと繋ぐための準備としてクライアントを用意する
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: AUTH_COOKIE_OPTIONS,
      cookies: {
        //ブラウザがリクエストに付けて送ってきた Cookie を読む 処理をセットしておく
        getAll() {
          return request.cookies.getAll();
        },
        // 更新したcookieをレスポンスに載せる処理をセットしておく
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          //新しい箱を作成してプラウザへレスポンスするための状態へsetしておく
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          //引数で渡されたheadersをブラウザへ渡すためのセットしている状態
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  //ユーザーがログインできる情報を持っているか持っていないかまたは無効状態なのか確認している
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = !!data?.claims;

  //リクエストされたURLが/checkin/であるか/loginであるかを判定している
  const { pathname } = request.nextUrl;
  const isCheckinRoute = pathname.startsWith("/checkin/");
  const isLoginRoute = pathname === "/login";

  //urlのクローンを作成後ログイン画面に飛ぶurlに書き換えて渡している。この時クエリにreturnUrl先を登録しておく。
  if (isCheckinRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("returnUrl", pathname);
    //
    return NextResponse.redirect(url);
  }
  //ログイン済みで/loginにいるとき、returnUrlが安全ならそこへ、ダメなら/へ。クエリは消してリダイレクト
  if (isLoginRoute && isAuthenticated) {
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");
    const url = request.nextUrl.clone();
    url.pathname = returnUrl && isSafeReturnUrl(returnUrl) ? returnUrl : "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  //上の2つのifに入らなければ、リダイレクトせずそのまま通す
  return supabaseResponse;
}
