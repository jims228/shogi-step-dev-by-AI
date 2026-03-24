# C. 再利用 vs 回避の分類

## プロダクトアイデアとして再利用すべきもの

| 知見 | 元 | 活用方法 |
|------|-----|---------|
| **4種のステップタイプ**: explain, move, tap_square, quiz | mobile | MVP v1では `explanation`, `board`, `quiz` の3種に絞る。`move`/`tap_square` はv2候補 |
| **コーチ（おじいちゃん）対話形式** | mobile | 初心者に親しみやすいUI。v1ではテキストのみ、将来的にアバター追加 |
| **ロードマップ形式のレッスン一覧** | mobile | カテゴリ別アコーディオン + 進捗バッジ |
| **ライフ制（5回失敗で終了）** | mobile | v1ではライフ制は入れない。代わりに「やり直し」ボタン |
| **guided → practice → review 3段階** | commentary-ai | 良い教育設計。v1では simplified版（explain → board → quiz の線形進行） |
| **encouraging スタイルの解説** | commentary-ai | 初心者向けトーンの指針として活用 |

## アーキテクチャアイデアとして再利用すべきもの

| パターン | 元 | 活用方法 |
|----------|-----|---------|
| **LessonEngine: 純粋ロジック分離** | mobile `LessonEngine.ts` | レッスン進行ロジックをReact非依存で実装。テスタビリティ向上 |
| **useLessonEngine: フック層でUI接続** | mobile `useLessonEngine.ts` | カスタムフックがエンジンをラップするパターン |
| **データ駆動レッスン**（JSON/TS定数） | 両方 | レッスンを宣言的データで定義。ページごとの実装ではない |
| **SFENパーサー: 小さく自前実装** | mobile `sfen.ts` (71行) | 外部ライブラリ不要。自前71行で十分 |
| **Position型: `{row, col}`** | mobile | 座標を型で明確にし、筋/段の混乱を防ぐ |
| **Context Provider パターン** | mobile `progress.tsx` | 進捗管理をReact Contextで提供 |

## UI/UXアイデアとして再利用すべきもの

| パターン | 元 | 活用方法 |
|----------|-----|---------|
| **レッスン画面レイアウト**: コーチ → 盤面 → 操作エリア | mobile | 上から下への自然な視線誘導 |
| **進捗バー + ステップ番号** | mobile `LessonHeader.tsx` | ユーザーの現在位置を常に表示 |
| **ハイライト4色**: movable(青), correct(緑), wrong(赤), lastMove(橙) | mobile | 直感的なフィードバック色体系 |
| **カテゴリ別アコーディオン一覧** | mobile `RoadmapHomeScreen.tsx` | 多数のレッスンを整理 |
| **矢印オーバーレイ** | commentary-ai | 盤上の指し手ガイド表示（v2候補） |

## 明示的に回避すべきもの

| 問題 | 元 | 回避方法 |
|------|-----|---------|
| **WebView二重レンダリング** | mobile `PawnLessonRemakeScreen.tsx` (339行の複雑さ) | Webアプリとして一本化。WebView不要 |
| **プラットフォーム固有ハック** | mobile (BOARD_SAFETY, Android分岐) | Web単一プラットフォーム |
| **暗黙の状態遷移**（明示的状態マシンなし） | mobile `useLessonEngine.ts` | 状態を明示的に管理 |
| **magic number散在** | mobile (MASCOT_PULL_LEFT=30等) | テーマ/定数ファイルに集約 |
| **カテゴリのprefix文字列マッチ** | mobile (`id.startsWith("rules_")`) | スキーマにcategoryフィールドを持つ |
| **テストなし** | 両方 | 初日からテストを書く |
| **バリデーションなし** | mobile | レッスンデータにランタイムバリデーション |
| **重すぎるAI依存** | commentary-ai | MVP段階ではAI不要。静的コンテンツで十分 |
