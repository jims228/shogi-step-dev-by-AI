# Session 5 — Reviewer / Tests プロンプト

```
あなたは「shogi-step」プロジェクトのレビュアー・テスト担当です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリの問題点（テストなし、バリデーションなし）を明示的に解決する
- 新プロジェクトでは初日からテスト・バリデーションを組み込む

## コンテキスト
- 将棋初心者向け学習アプリ。Vite + React + TypeScript
- Session 1（アーキテクト）が完了済み
- 他セッション（2〜4）が並行して各ブランチで作業中
- あなたの役割: テスト基盤構築、品質ゲート設定、旧リポジトリの問題回避確認

## 事前準備
1. `git pull origin main` で最新取得
2. `git checkout -b feat/tests` でブランチ作成
3. `npm install`
4. CLAUDE.md を読んでプロジェクト規約を確認
5. src/types/lesson.ts を読んでスキーマ型を確認

## Phase 1: 参照調査（実装前に必ず実行）

### 必読ファイル
1. `/home/jimjace/shogi-step-mobile/src/lesson/types.ts`
   → 旧型定義のフィールドを把握し、新型定義のバリデーションに必要な項目を特定
2. `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts`
   → SFENパーサーの実装を把握し、テストすべきエッジケースを特定
3. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts`
   → 旧レッスンデータの構造を把握し、バリデーションルールの参考にする
4. `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts`
   → 旧エンジンの状態遷移を把握し、テストシナリオの参考にする

### 調査で特に注目すべき旧リポジトリの問題点
- テストファイルが1つも存在しない → 今回は全領域にテストを書く
- SFENバリデーションがない → 今回はSFEN形式チェックを実装
- レッスンデータのランタイムバリデーションがない → 今回はvalidateLesson関数を実装
- 型定義はあるがランタイムチェックがない → 今回は型ガード関数を実装
- LessonEngineの状態遷移テストがない → 今回エンジンテストの基盤を作る

## Phase 2: 実装

### 2-1. テスト基盤整備
- vitest.config.ts の確認・修正
- `tests/setup.ts` を作成:
  ```typescript
  import '@testing-library/jest-dom';
  ```
- package.json scripts の確認:
  - `"test": "vitest run"`
  - `"test:watch": "vitest"`

### 2-2. スキーマバリデーション（lib/validation.ts）
`src/lib/validation.ts` を作成:
- 外部ライブラリ不使用。手書きバリデーション
- 旧リポジトリにバリデーションがなかった問題を解決
```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateLesson(data: unknown): ValidationResult;
function validateStep(step: unknown, index: number): string[];
function validateSFENFormat(sfen: string): boolean;  // 基本形式チェック
```
- チェック項目:
  - id: 空でないstring
  - title: 空でないstring
  - category: 空でないstring
  - difficulty: 'beginner'
  - steps: 1つ以上
  - explanation step: title, content が空でない
  - board step: sfen が空でない、sfenの基本形式（`/`区切り9段）
  - quiz step: choices 2つ以上、correctIndex 範囲内、explanation 空でない
  - quiz step: choices に空文字列がない
  - SFEN形式: 9つの段（`/` 区切り）、各段の幅が9マス分

### 2-3. スキーマバリデーションテスト（tests/schema.test.ts）
- 正常データのテスト
- 各種不正データ:
  - id空、title空、steps空配列
  - 不明なstep type
  - quiz correctIndex 範囲外（負数、choices.length以上）
  - quiz choices が1つだけ
  - board sfen が空
  - board sfen が不正形式（段数不足）
  - 必須フィールド欠落

### 2-4. SFEN形式テスト（tests/sfen-validation.test.ts）
- 正常SFEN: 初期配置、空盤面、駒1つ配置
- 不正SFEN: 段数不足、段幅超過、不明文字
- エッジケース: 成駒(+P)、連続空マス(9)

### 2-5. レッスンデータ品質テスト（tests/content-quality.test.ts）
- src/data/lessons/*.json が存在すれば読み込んでテスト（なければスキップ）
- チェック:
  - 全レッスンが validateLesson を通る
  - 各レッスン3ステップ以上
  - クイズ選択肢3つ以上
  - テキスト500文字以下
  - SFEN形式チェック
  - id がファイル名と一致

### 2-6. 初心者向けコンテンツレビュー（tests/content-review.test.ts）
- レッスンデータが存在すれば:
  - 最初のレッスンが "はじめに" カテゴリか
  - explanation内容が「です・ます調」（末尾「。」「！」「？」チェック）
  - quizのexplanationが空でないか
  - TODO: 将棋用語の初出チェック（将来実装）

### 2-7. テストユーティリティ（tests/test-utils.tsx）
```typescript
function createMockLesson(overrides?: Partial<Lesson>): Lesson;
function createMockExplanationStep(overrides?: Partial<ExplanationStep>): ExplanationStep;
function createMockBoardStep(overrides?: Partial<BoardStep>): BoardStep;
function createMockQuizStep(overrides?: Partial<QuizStep>): QuizStep;

// React Testing Library カスタムrender（MemoryRouter + ProgressProvider ラップ）
function renderWithProviders(ui: ReactElement, options?: RenderOptions): RenderResult;
```

### 2-8. 動作確認
- `npm test` で全テストパス確認
- テストカバレッジ概要を確認

## Phase 3: コミットとプッシュ

1. `test: テスト基盤セットアップ（setup.ts, vitest設定確認）`
2. `feat(validation): レッスンスキーマバリデーション関数（旧リポジトリのバリデーション欠如を解決）`
3. `test(schema): スキーマバリデーションテスト`
4. `test(sfen): SFEN形式バリデーションテスト`
5. `test(content): レッスンデータ品質・初心者レビューテスト`
6. `test: テストユーティリティ・モックファクトリ`

各コミット前に `npm test` パス確認。
最後に `git push origin feat/tests`。

## 重要な制約
- 参照調査は必ず実装前に行う
- 外部バリデーションライブラリ不使用（Zod等）
- テストは他セッションの成果物なしでも単独実行可能（データなければスキップ）
- 過度に厳しいチェックを入れない（MVP段階に適した水準）
- テストファイル内にも旧リポジトリからのコピペはしない
```
