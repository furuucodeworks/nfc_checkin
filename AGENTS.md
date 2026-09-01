<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 作業記録

ユーザーが作業終了・休憩・一区切りと示したときは、**先に当日分の agent-transcripts をすべて読んでから**、`docs/journal/[今日の日付].md` にユーザーが確認・学習したことをまとめて追記する。詳細は `docs/journal/README.md` を参照。

## プロジェクト構成ドキュメント

`docs/project-structure.md` はプロジェクトのファイル構成の正本とする。

次のいずれかを行ったときは、**同じ作業内で** `docs/project-structure.md` も更新する（ユーザーから別途指示がなくても行う）。

- `src/` 配下にファイル・フォルダを追加・削除・移動した
- `docs/`（`journal/` を除く）や `public/` に意味のあるファイルを追加・削除した
- ルーティング（URL とファイルの対応）が変わった
- 認証フローや主要なディレクトリの役割が変わった

更新内容:

- 全体ツリーに追加・削除・移動を反映する
- ルーティング対応表・ディレクトリ別の役割・認証フローなど、影響のあるセクションを整合させる
- 先頭の「最終更新」日付を当日にする
