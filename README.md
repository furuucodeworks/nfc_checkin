# NFC チェックインシステム

NFCタグを使用した全社統一チェックインシステム。

## ドキュメント

- [要件定義](docs/requirements.md)
- [実装計画](docs/implementation-plan.md)

## 技術スタック

- Next.js (App Router)
- Supabase (PostgreSQL / Auth)
- Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数

`env.example` をコピーして `.env.local` を作成し、Supabase の値を設定する。

```bash
cp env.example .env.local
```

Supabase プロジェクトは [Supabase Dashboard](https://supabase.com/dashboard) で作成する。リージョンは **Northeast Asia (Tokyo)** を選択する（要件定義 §6）。

### 3. 開発サーバー起動

```bash
npm run dev
```

- ホーム: http://localhost:3000
- チェックイン（埼玉）: http://localhost:3000/checkin/saitama
- チェックイン（小布施）: http://localhost:3000/checkin/obuse
- チェックイン（愛知）: http://localhost:3000/checkin/aichi

## NFCタグ URL 形式

```
https://yourdomain.com/checkin/[location_id]
```

| location_id | 施設 |
|-------------|------|
| `saitama` | 埼玉/熊谷 |
| `obuse` | 小布施 |
| `aichi` | 愛知 |

## Vercel へのデプロイ

1. [Vercel](https://vercel.com) で GitHub リポジトリをインポート
2. 環境変数 `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
3. デプロイ後、`/checkin/saitama` などで動作確認

## スクリプト

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド
npm run start    # 本番サーバー
npm run lint     # ESLint
```
