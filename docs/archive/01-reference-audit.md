# B. 各リポジトリから調査すべきもの

## `/home/jimjace/shogi-step-mobile`（旧モバイルアプリ）

| 調査対象 | パス | 何を見るか |
|----------|------|-----------|
| レッスン型定義 | `src/lesson/types.ts` | LessonStep型の設計、stepTypeの種類 |
| レッスンエンジン | `src/lesson/LessonEngine.ts` | 純粋ロジックとUIの分離パターン |
| レッスンエンジンフック | `src/lesson/useLessonEngine.ts` | Reactフック層の設計 |
| レッスンデータ例 | `src/data/lessons/basics_pawn.ts` | 歩レッスンの具体的な構成・SFEN・文言 |
| レッスンインデックス | `src/data/lessons/index.ts` | レッスン登録パターン |
| ロードマップJSON | `src/data/roadmap.json` | レッスンメタデータ構造（カテゴリ・順序・前提条件） |
| 盤面コンポーネント | `src/ui/board/ShogiBoard.tsx` | 9x9グリッド実装、ハイライト方式 |
| SFENパーサー | `src/ui/board/sfen.ts` | パース実装（71行、シンプル） |
| 駒表示 | `src/ui/board/Piece.tsx` | 駒の表現方法 |
| 進捗管理 | `src/state/progress.tsx` | 永続化の設計 |
| テーマ | `src/ui/theme.ts` | デザイントークン（色・タイポグラフィ・スペーシング） |
| レッスン画面 | `src/screens/NativeLessonScreen.tsx` | レッスンUIレイアウト |
| ヘッダー/フッター | `src/ui/lesson/LessonHeader.tsx`, `LessonFooter.tsx` | 進捗バー、ナビゲーション |

## `/home/jimjace/shogi-commentary-ai`（解説AIシステム）

| 調査対象 | パス | 何を見るか |
|----------|------|-----------|
| SFEN/盤面操作 | `backend/api/utils/shogi_explain_core.py` | SFEN解析、座標変換、日本語化 |
| フロントエンドSFEN | `apps/web/src/lib/sfen.ts` | TypeScript版SFENパーサー |
| レッスン定義 | `apps/web/src/lessons/pawn/tsugifu.ts` | guided/practice/review 3段階構造 |
| レッスン型 | `apps/web/src/types.ts` | LessonStep, Substep, Problem型 |
| 定数/カテゴリ | `apps/web/src/constants.ts` | レッスンカテゴリ体系 |
| 解説スタイル | `backend/api/services/ai_service.py` | technical/encouraging/neutralのスタイル指示 |
| 駒の価値 | `backend/api/utils/shogi_explain_core.py` | PIECE_VALUE定義 |
| 用語集 | `backend/api/services/ai_service.py` | 将棋用語の日本語対応 |
