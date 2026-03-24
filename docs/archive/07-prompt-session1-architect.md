# Session 1 — Architect / Schema + Reference Audit プロンプト

```
あなたは「shogi-step」プロジェクトのアーキテクト担当です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリを積極的に調査し、知見を抽出する
- 実装は新規に書く（コピペ禁止）
- 旧構造を「すでにあるから」という理由で引き継がない
- 良い理由が説明できるパターンのみ採用する

## コンテキスト
- 将棋初心者向け学習アプリの新規構築
- リポジトリは完全に空（.gitのみ）
- このセッションが最初に実行され、他の4セッションの基盤を作る
- 旧リポジトリ2つが参照可能:
  - /home/jimjace/shogi-step-mobile（React Nativeモバイルアプリ）
  - /home/jimjace/shogi-commentary-ai（解説AIシステム + Next.jsフロントエンド）

## Phase 1: 参照監査（実装前に必ず実行）

以下のファイルを読み、設計判断の材料にすること:

### 必読ファイル
1. `/home/jimjace/shogi-step-mobile/src/lesson/types.ts`
   → LessonStep型の設計を把握。stepTypeの種類（explain, move, tap_square, quiz）を確認
2. `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts`
   → 純粋ロジックとUIの分離パターンを理解
3. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts`
   → レッスンデータの具体的な形を確認
4. `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts`
   → SFENパーサーの実装規模感（71行）を確認
5. `/home/jimjace/shogi-commentary-ai/apps/web/src/lessons/pawn/tsugifu.ts`
   → guided/practice/review 3段階レッスン構造を確認
6. `/home/jimjace/shogi-commentary-ai/apps/web/src/lib/sfen.ts`
   → TypeScript版SFENパーサーの設計を確認

### 監査結果として判断すること
各ファイルを読んだ後、以下を判断して簡潔にコメントとしてコミットメッセージに残す:
- 新スキーマに取り入れるべきパターン
- 明確に避けるべきパターン
- v1では不要だがv2以降の候補としてメモすべきもの

## Phase 2: プロジェクト初期化

### 2-1. Viteプロジェクト作成
```bash
npm create vite@latest . -- --template react-ts
```
- 不要なボイラープレート削除（App.css内デフォルトスタイル、assets/react.svg等）

### 2-2. 依存関係インストール
```bash
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```
- Tailwind CSS v4 をインストール・設定

### 2-3. 設定ファイル
- `vitest.config.ts`: jsdom環境、テストセットアップファイル指定
- `tsconfig.json`: strict mode有効化、パスエイリアス（@/ → src/）
- `.gitignore`: node_modules, dist, .env, *.local

### 2-4. ディレクトリ構造
```
src/
  app/           # App.tsx, main.tsx
  components/
    lesson/      # レッスン関連
    board/       # 盤面関連
    quiz/        # クイズ関連
  types/         # 型定義
  data/
    lessons/     # レッスンJSON
  hooks/         # カスタムフック
  lib/           # ユーティリティ（SFENパーサー等）
tests/           # テスト
```
空ディレクトリには `.gitkeep` を置く。

## Phase 3: レッスンスキーマ型定義

`src/types/lesson.ts` に以下を定義。

**旧リポジトリからの採用判断**:
- mobile版の4stepType（explain, move, tap_square, quiz）→ v1では3種（explanation, board, quiz）に絞る
- mobile版の `coach_text` → v1では explanation.content に統合。将来的にcoach対話UIを追加する余地を残す
- mobile版の `correct_move`, `correct_square` → v2候補。v1はquizのみ
- mobile版の `Position = {row, col}` → 採用。座標を型で明確にする
- commentary-ai版の `guided/practice/review` 3段階 → v2候補。v1は線形ステップ進行

```typescript
// 座標型（旧mobileの Position パターンを採用）
export interface Position {
  row: number;  // 0-8 (上から下: 一段〜九段)
  col: number;  // 0-8 (右から左: 1筋〜9筋)
}

export interface ExplanationStep {
  type: 'explanation';
  title: string;
  content: string;        // 説明テキスト（です・ます調）
  image?: string;
}

export interface BoardStep {
  type: 'board';
  title: string;
  description: string;    // 盤面の説明テキスト
  sfen: string;           // SFEN盤面部分のみ（例: "9/9/9/9/4P4/9/9/9/9"）
  highlights?: Position[]; // 強調マス（旧mobileのハイライト方式を採用）
}

export interface QuizStep {
  type: 'quiz';
  question: string;
  choices: string[];       // 3〜4個
  correctIndex: number;    // 0始まり
  explanation: string;     // 正解後の解説
}

export type LessonStep = ExplanationStep | BoardStep | QuizStep;

export interface Lesson {
  id: string;              // ファイル名と一致（例: "01-intro"）
  title: string;
  description: string;
  category: string;        // "はじめに" | "駒の動き" など（prefixマッチ回避）
  difficulty: 'beginner';
  steps: LessonStep[];
}

export interface LessonProgress {
  lessonId: string;
  currentStepIndex: number;
  completed: boolean;
}
```

**旧mobileとの差分メモ（CLAUDE.mdに記載）**:
- 旧: highlights は `Position[]` で `{row, col}` 形式 → 採用
- 旧: stepType に move/tap_square あり → v2候補
- 旧: coach_text/success_text/fail_text あり → v1では explanation に統合
- 旧: lives/score あり → v1ではなし

## Phase 4: CLAUDE.md 作成

プロジェクトルートに `CLAUDE.md` を作成。以下を含める:

```markdown
# Shogi Step - 将棋初心者向け学習アプリ

## プロジェクト概要
将棋初心者のための段階的学習アプリ。Reference-Driven Clean-Room Rebuildとして構築。

## Reference-Driven Clean-Room ポリシー
- 旧リポジトリ（shogi-step-mobile, shogi-commentary-ai）は参照として調査する
- 実装は新規に書く。旧コードのコピペ禁止
- 旧パターンの採用は理由を明示できる場合のみ
- 参照先:
  - /home/jimjace/shogi-step-mobile — UIレイアウト、LessonEngine分離、SFENパーサー
  - /home/jimjace/shogi-commentary-ai — レッスン3段階構造、SFENユーティリティ、encouraging解説スタイル

## 技術スタック
- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4
- React Router v7
- Vitest + React Testing Library

## 開発コマンド
- `npm run dev` — 開発サーバー起動
- `npm run build` — プロダクションビルド
- `npm test` — テスト実行
- `npx tsc --noEmit` — 型チェック

## ディレクトリ構造
- src/app/ — アプリエントリ、ルーティング
- src/components/ — UIコンポーネント（lesson/, board/, quiz/）
- src/types/ — 型定義（lesson.ts が中心）
- src/data/lessons/ — レッスンJSONファイル
- src/hooks/ — カスタムフック
- src/lib/ — ユーティリティ（SFENパーサー等）
- tests/ — テストファイル

## コーディング規約
- TypeScript strict mode
- コンポーネントは function 宣言 + export
- 日本語コメント可、変数名・関数名は英語
- レッスンデータは JSON、型は src/types/lesson.ts に準拠
- 座標は Position 型（{row, col}）で統一

## ブランチ戦略
- main — Session 1 の初期セットアップ
- feat/app-shell — Session 2（フロントエンド）
- feat/board — Session 3（盤面）
- feat/content — Session 4（コンテンツ）
- feat/tests — Session 5（テスト）

## スキーマ設計メモ（旧リポジトリ参照結果）
- v1 step types: explanation, board, quiz
- v2候補: move（駒移動操作）, tap_square（マス選択操作）, guided/practice/review 3段階
- v1 highlights: Position[]（旧mobile方式を採用）
- v1にはライフ制・スコア・コーチアバターなし
```

## Phase 5: 最小 App.tsx

`src/app/App.tsx` に React Router 設定:
- `/` → 「レッスン一覧」プレースホルダー
- `/lesson/:id` → 「レッスン詳細」プレースホルダー
- 共通レイアウト（ヘッダー「将棋ステップ」）

## Phase 6: コミットとプッシュ

以下の粒度でコミット:
1. `init: Vite + React + TypeScript プロジェクト初期化`
2. `feat(types): レッスンスキーマ型定義（参照監査結果を反映）`
3. `docs: CLAUDE.md プロジェクト規約・参照ポリシー追加`
4. `feat(app): 最小アプリシェルとルーティング設定`

各コミット前に `npx tsc --noEmit` で型チェック。
最後に `git push origin main`。

## 重要な制約
- 参照監査は必ず実装前に行う
- 旧コードのコピペは禁止。パターンの採用は理由を説明できること
- 余計なライブラリを追加しない
- 型定義は他4セッションの基盤。特に慎重に
```
