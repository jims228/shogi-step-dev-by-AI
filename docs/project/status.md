# Project Status

> Last updated: 2026-03-25

## 概要

| 項目 | 状態 |
|------|------|
| ブランチ | `main` |
| 最新コミット | `433f354` fix: 空アセットPNG修正 + 依存バージョン整合 |
| テスト | 56件パス（engine 34 + sfen 22） |
| 型チェック | パス |
| Metro バンドラー | 起動確認済み（Android バンドル HTTP 200） |
| 実機確認 | **未完了**（次の最優先タスク） |

## 実装済み

| コンポーネント | ファイル | 状態 |
|-------------|---------|------|
| Expo アプリ基盤 | app/_layout.tsx, app.json, package.json | 動作 |
| ロードマップ画面 | app/index.tsx | 動作（Unit カード表示） |
| レッスン画面 | app/lesson/[id].tsx | 接続済み（StepRenderer 統合） |
| テーマ | src/theme/index.ts | 動作 |
| 型定義 | src/types/lesson.ts | 安定 |
| LessonEngine | src/engine/LessonEngine.ts | テスト済み（34件） |
| SFEN パーサー | src/lib/sfen.ts | テスト済み（22件） |
| 駒マッピング | src/lib/piece.ts | 動作 |
| バリデーション | src/lib/validation.ts | 動作 |
| 盤面 | src/components/board/ShogiBoard.tsx | 実装済み |
| 駒スプライト | src/components/board/Piece.tsx + assets/pieces.png | 実装済み |
| StepRenderer | src/components/lesson/StepRenderer.tsx | 6タイプ分岐 |
| 各ステップUI | src/components/lesson/*.tsx (6ファイル) | 実装済み |
| CoachBubble | src/components/common/CoachBubble.tsx | 実装済み |
| FeedbackOverlay | src/components/common/FeedbackOverlay.tsx | 実装済み |
| useLessonEngine | src/hooks/useLessonEngine.ts | 実装済み |
| useProgress | src/hooks/useProgress.ts | 実装済み |
| ProgressContext | src/state/ProgressContext.tsx | 実装済み |
| World 1 データ | src/data/lessons/ (18ファイル) | 作成済み |
| ロードマップデータ | src/data/roadmap.ts | 作成済み |
| テスト | tests/ (7ファイル) | engine/sfen パス |

## 既知の問題

| # | 問題 | 影響 | 優先度 |
|---|------|------|--------|
| 1 | 実機未確認 | 本当に動くか不明 | **最高** |
| 2 | schema/content テストが jest-expo 環境で未検証 | CI 品質ゲート不完全 | 中 |
| 3 | expo-env.d.ts が削除されている | 型定義に影響するかも | 低 |
| 4 | tsconfig.json に未コミットの変更あり | クリーンでない | 低 |

## ブロッカー

なし。実機確認の実行待ちのみ。
