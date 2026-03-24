# Session 2 — Frontend App プロンプト

```
あなたは「shogi-step」プロジェクトのフロントエンド担当です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリを積極的に調査し、知見を抽出してから実装する
- 実装は新規に書く（コピペ禁止）
- 良い理由が説明できるパターンのみ採用する

## コンテキスト
- 将棋初心者向け学習アプリ。Vite + React + TypeScript
- Session 1（アーキテクト）が完了済み。mainブランチに基盤あり
- src/types/lesson.ts にレッスンスキーマ型が定義済み
- 旧リポジトリ2つが参照可能

## 事前準備
1. `git pull origin main` で最新取得
2. `git checkout -b feat/app-shell` でブランチ作成
3. `npm install`
4. CLAUDE.md を読んでプロジェクト規約を確認
5. src/types/lesson.ts を読んでスキーマ型を確認

## Phase 1: 参照調査（実装前に必ず実行）

### 必読ファイル
1. `/home/jimjace/shogi-step-mobile/src/screens/NativeLessonScreen.tsx`
   → レッスン画面のレイアウト構成を把握（コーチ → 盤面 → 操作エリア）
   → 「前へ」「次へ」のナビゲーションパターンを確認
2. `/home/jimjace/shogi-step-mobile/src/screens/RoadmapHomeScreen.tsx`
   → レッスン一覧のUI構成、カテゴリ別表示、進捗バッジの表示方法
3. `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts`
   → 純粋ロジック分離パターン（submitMove, submitQuiz, advanceStep）
4. `/home/jimjace/shogi-step-mobile/src/lesson/useLessonEngine.ts`
   → Reactフック層のインターフェース設計
5. `/home/jimjace/shogi-step-mobile/src/state/progress.tsx`
   → 進捗管理のContext Providerパターン
6. `/home/jimjace/shogi-step-mobile/src/ui/lesson/LessonHeader.tsx`
   → 進捗バー、ステップ表示
7. `/home/jimjace/shogi-step-mobile/src/ui/lesson/LessonFooter.tsx`
   → 「次へ」ボタンのUI/UXパターン
8. `/home/jimjace/shogi-step-mobile/src/ui/theme.ts`
   → デザイントークン（色、タイポグラフィ、スペーシング）

### 調査で特に注目すべき点
- LessonEngine がReact非依存な純粋ロジックであること → 同じ分離パターンを新規実装で採用
- RoadmapHomeScreen のカテゴリ分類が `id.startsWith()` で行われていること → 新実装では category フィールドで分類（旧の問題を回避）
- NativeLessonScreen のフィードバック表示（正解/不正解）のタイミング → 参考にする
- progress.tsx のAsyncStorage使用 → 新実装では localStorage に置き換え

## Phase 2: 実装

### 2-1. レッスンエンジン（lib/lessonEngine.ts）— 旧LessonEngineパターンを採用
`src/lib/lessonEngine.ts` を作成:
- React非依存の純粋ロジック（旧 LessonEngine.ts の分離パターンを新規実装）
- インターフェース:
  ```typescript
  interface LessonState {
    lesson: Lesson;
    currentStepIndex: number;
    quizAnswered: boolean;
    quizCorrect: boolean | null;
    completed: boolean;
  }

  function createInitialState(lesson: Lesson, startIndex?: number): LessonState;
  function goToNextStep(state: LessonState): LessonState;
  function goToPrevStep(state: LessonState): LessonState;
  function submitQuizAnswer(state: LessonState, choiceIndex: number): LessonState;
  function getCurrentStep(state: LessonState): LessonStep;
  function canAdvance(state: LessonState): boolean;
  ```
- 旧LessonEngineとの差分: move/tap_square ステップ不要、ライフ制なし、シンプルに

### 2-2. レッスンエンジンフック（hooks/useLessonEngine.ts）
`src/hooks/useLessonEngine.ts` を作成:
- LessonState を useState でラップ
- 進捗の自動保存（useProgress と連携）
- インターフェース:
  ```typescript
  function useLessonEngine(lesson: Lesson): {
    state: LessonState;
    currentStep: LessonStep;
    goNext: () => void;
    goPrev: () => void;
    submitAnswer: (index: number) => void;
    canAdvance: boolean;
    progress: { current: number; total: number };
  }
  ```

### 2-3. レッスン一覧（components/lesson/LessonList.tsx）
- レッスンデータを読み込み、カテゴリ別にグループ表示
- 各レッスンをカードとして表示（タイトル、説明、カテゴリ）
- 旧RoadmapHomeScreenのアコーディオン方式は参考にするが、v1ではシンプルなリスト
- 進捗バッジ表示（完了: チェックマーク、進行中: ステップ番号）
- カードクリックで `/lesson/:id` に遷移
- Tailwind CSS、モバイルファースト

### 2-4. レッスン詳細（components/lesson/LessonDetail.tsx）
- URLパラメータからレッスンID取得
- useLessonEngine フックでレッスン進行管理
- レイアウト構成（旧NativeLessonScreenの上→下の視線誘導を採用）:
  ```
  [進捗バー: ● ● ● ○ ○ (3/5)]
  [ステップタイトル]
  [StepRenderer（内容表示エリア）]
  [前へ / 次へ ボタン]
  ```
- 最終ステップ完了時に「レッスン完了！」メッセージ

### 2-5. ステップレンダラー（components/lesson/StepRenderer.tsx）
- LessonStep.type に応じて分岐:
  - `explanation` → タイトル + テキスト表示（+ オプション画像）
  - `board` → 盤面プレースホルダー（「盤面: [SFEN]」テキスト + 説明）。Session 3 の ShogiBoard に後から差し替え
  - `quiz` → QuizStep コンポーネント

### 2-6. クイズコンポーネント（components/quiz/QuizStep.tsx）
- 問題文表示
- 選択肢をボタンで表示
- 選択後の状態:
  - 正解: 緑表示 + 解説テキスト表示 + 「次へ」有効化
  - 不正解: 赤表示 + 「もう一度」促し（旧mobileのフィードバックパターン参考）
- 回答済み状態では選択肢ボタンを無効化

### 2-7. 進捗フック（hooks/useProgress.ts）
- localStorage を使用（旧mobileの AsyncStorage に相当）
- Context Provider パターンで提供（旧 progress.tsx のパターンを採用）
- インターフェース:
  ```typescript
  function useProgress(): {
    getProgress(lessonId: string): LessonProgress | null;
    saveProgress(progress: LessonProgress): void;
    getAllProgress(): LessonProgress[];
  }
  ```

### 2-8. モックデータ（暫定）
`src/data/mockLessons.ts` を作成（Session 4 が本番データを作るまでの仮データ）:
- 2レッスン分（各3ステップ: explanation, board, quiz）
- src/types/lesson.ts のスキーマに厳密に準拠
- SFEN文字列は簡素だが正しいもの（空盤面や歩1つの配置）
- ファイル名に「mock」を含める（Session 4 のデータと明確に区別）

`src/data/index.ts` を作成:
- モックデータをインポートしてエクスポート
- Session 4 マージ時に本番データに差し替え可能な構造

### 2-9. App.tsx 更新
- ルーティングに LessonList, LessonDetail を接続
- ProgressProvider でアプリ全体をラップ
- 共通レイアウト（ヘッダー「将棋ステップ」、戻るリンク）

## Phase 3: コミットとプッシュ

以下の粒度でコミット:
1. `feat(engine): レッスンエンジン純粋ロジック実装（参照: mobile版LessonEngine分離パターン）`
2. `feat(lesson): レッスン一覧・詳細コンポーネント実装`
3. `feat(quiz): クイズステップコンポーネント実装`
4. `feat(progress): localStorage進捗管理フック実装`
5. `feat(app): ルーティング接続・モックデータ追加`

各コミット前に `npx tsc --noEmit` で型チェック。
最後に `git push origin feat/app-shell`。

## 重要な制約
- 参照調査は必ず実装前に行う
- 旧コードのコピペ禁止。パターンの採用は理由を明示
- 盤面コンポーネントは本実装しない（プレースホルダーのみ）。Session 3 が担当
- レッスンデータはモックでOK。Session 4 が本データを作成
- 余計なライブラリ追加禁止
- LessonEngineは必ずReact非依存にする（テスタビリティ確保）
```
