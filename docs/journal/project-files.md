# プロジェクト ファイル一覧

このプロジェクト内のファイル・フォルダの用途をまとめた参照用ドキュメント。

---

## プロジェクト設定（ルート）

| ファイル | 用途 | GitHub |
|----------|------|--------|
| `package.json` | プロジェクト名・依存ライブラリ一覧・`npm run dev` などのコマンド定義 | ✅ |
| `package-lock.json` | インストールしたパッケージの正確なバージョンを固定（再現性のため） | ✅ |
| `tsconfig.json` | TypeScript の設定（厳格モード、`@/*` のパスエイリアスなど） | ✅ |
| `next.config.ts` | Next.js の設定（現状はほぼ空・将来の拡張用） | ✅ |
| `next-env.d.ts` | Next.js が自動生成する型定義の参照。**手で編集しない** | ✅（自動更新） |
| `eslint.config.mjs` | コード品質チェック（ESLint）のルール | ✅ |
| `postcss.config.mjs` | CSS 処理の設定（Tailwind を動かすため） | ✅ |
| `.gitignore` | Git に含めないファイルの指定（`node_modules`、`.env*` など） | ✅ |
| `env.example` | 環境変数のテンプレート（ダミー値のみ）。本物のキーは入れない | ✅ |
| `README.md` | プロジェクトの入口。セットアップ・デプロイ・URL の手引き | ✅ |
| `AGENTS.md` | AI エージェント向けのコード記述ルール（Next.js 16 の注意点など） | ✅ |
| `CLAUDE.md` | AI 向けに `AGENTS.md` を参照させる入口ファイル | ✅ |

---

## アプリ本体（`src/`）

### `src/app/` — 画面・ページ（Next.js App Router）

| ファイル | 用途 |
|----------|------|
| `layout.tsx` | 全ページ共通の土台（HTML構造、フォント、サイトタイトル） |
| `page.tsx` | ホーム画面（`/`）— 各施設のチェックインURLへのリンク |
| `globals.css` | 全体のスタイル（Tailwind の読み込み、色・フォントの基本設定） |
| `favicon.ico` | ブラウザタブに表示されるアイコン |
| `checkin/[location_id]/page.tsx` | チェックイン画面（`/checkin/saitama` など） |

`[location_id]` は動的ルート。URL の `saitama` などがパラメータとして渡る。

### `src/lib/` — 共通ロジック（画面以外）

| ファイル | 用途 |
|----------|------|
| `locations.ts` | 施設マスタ（`saitama` → 埼玉/熊谷 などの定義・バリデーション） |
| `supabase/client.ts` | ブラウザ側で Supabase に接続するクライアント |
| `supabase/server.ts` | サーバー側で Supabase に接続するクライアント |

---

## 静的ファイル（`public/`）

URL から直接配信される画像など。

| ファイル | 用途 | 備考 |
|----------|------|------|
| `next.svg` | Next.js ロゴ（サンプル） | 現状未使用・削除可 |
| `vercel.svg` | Vercel ロゴ（サンプル） | 現状未使用・削除可 |
| `globe.svg` など | サンプルアイコン | 現状未使用・削除可 |

本番では施設ロゴなどをここに置くこともある。

---

## ドキュメント（`docs/`）

| ファイル | 用途 |
|----------|------|
| `requirements.md` | 要件定義（何を作るか） |
| `implementation-plan.md` | 実装計画（STEP 1〜8 の順番） |
| `journal/README.md` | 日次記録フォルダの説明 |
| `journal/[日付].md` | その日の作業ログ（例: `2026-06-27.md`） |
| `journal/project-files.md` | このファイル。プロジェクト内ファイルの用途一覧 |

---

## 環境変数ファイル

| ファイル | 用途 | GitHub |
|----------|------|--------|
| `env.example` | 必要な環境変数のテンプレート（ダミー値） | ✅ 載せる |
| `.env.local` | 本物のキーを入れる場所（ローカル開発用） | ❌ 載せない |

---

## 自動生成・触らないフォルダ

| パス | 用途 | GitHub |
|------|------|--------|
| `node_modules/` | `npm install` で入ったライブラリ本体 | ❌ |
| `.next/` | `npm run build` / `dev` のビルド成果物 | ❌ |
| `.git/` | Git の履歴・メタデータ | リポジトリ自体 |

---

## 全体構造

```
nfc_checkin/
├── 設定ファイル群       → プロジェクトの土台・ツール設定
├── src/app/             → 画面（ユーザーが見るページ）
├── src/lib/             → 共通ロジック（DB接続・施設定義など）
├── public/              → 画像など静的ファイル
├── docs/                → 要件定義・実装計画・作業記録
├── node_modules/        → ライブラリ（自動）
└── .next/               → ビルド結果（自動）
```

---

## 開発で主に触るファイル

| やりたいこと | 触る場所 |
|--------------|----------|
| 画面を変える | `src/app/` 配下 |
| ロジックを足す | `src/lib/` |
| 設定を変える | `package.json`、`next.config.ts` |
| 作業を記録する | `docs/journal/[日付].md` |
| セットアップ手順を見る | `README.md` |
| 仕様を確認する | `docs/requirements.md` |
| 進捗・STEPを確認する | `docs/implementation-plan.md` |
