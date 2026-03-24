# Builder-B Prompt — Engine, Board, Interactions

あなたは「shogi-step」の Builder-B（レッスンエンジン・盤面・インタラクション担当）です。

## プロジェクト概要
将棋初心者向けモバイル学習アプリ。Expo + React Native + TypeScript。
reference-driven clean-room rebuild。

## 最重要ルール
- **ctx が source of truth**: docs/context/ 内のファイルが正式仕様
- 旧コードのコピペ禁止。パターン参照のみ
- 駒スプライト画像（pieces.png）は直接利用OK（自社アセット、D12決定済み）
- LessonEngine は React 非依存の純粋関数で実装（D7）

## 事前参照（実装前に読むこと）
1. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-05-build-context.md` → 技術仕様・型定義・盤面仕様・インタラクション仕様
2. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-03-reference-mapping.md` → 参照ルール・駒スプライト利用方針（Source 6）
3. `/home/jimjace/shogi-step-mobile/src/lesson/types.ts` → 旧 step type 設計参考
4. `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts` → 純粋ロジック分離パターン参考
5. `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts` → SFENパーサー（71行）参考
6. `/home/jimjace/shogi-step-mobile/src/ui/board/ShogiBoard.tsx` → 盤面レンダリング参考
7. `/home/jimjace/shogi-step-mobile/src/ui/board/Piece.tsx` → 駒スプライト表示 + オフセット微調整値
8. `/home/jimjace/shogi-step-mobile/assets/pieces.png` → 駒スプライト画像（新プロジェクトの assets/ にコピーして使う）

## ブランチ
`feat/engine-board`

## タスク

### 1. 型定義（src/types/lesson.ts）
ctx-05 Section 7 + docs/20-master-plan-v2.md Section L (Builder-B prompt) の型定義に従う。

```typescript
export interface Position { row: number; col: number; }

export type StepType = 'explain' | 'tap_square' | 'move' | 'quiz' | 'board_quiz' | 'review';

export interface ExplainStep {
  type: 'explain';
  text: string;
  coachText?: string;  // おじいの台詞
  sfen?: string;
  highlights?: Position[];
}

export interface TapSquareStep {
  type: 'tap_square';
  instruction: string;
  coachText?: string;
  sfen: string;
  correctSquares: Position[];
  highlights?: Position[];
  successText: string;
  failText: string;
}

export interface MoveStep {
  type: 'move';
  instruction: string;
  coachText?: string;
  sfen: string;
  correctMove: { from: Position; to: Position };
  highlights?: Position[];
  successText: string;
  failText: string;
}

export interface QuizStep {
  type: 'quiz';
  question: string;
  coachText?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface BoardQuizStep {
  type: 'board_quiz';
  question: string;
  coachText?: string;
  boardOptions: { sfen: string; label?: string }[];
  correctIndex: number;
  explanation: string;
}

export interface ReviewStep {
  type: 'review';
  source: 'mistakes_in_lesson' | 'mistakes_in_unit';
  count: number;
}

export type LessonStep = ExplainStep | TapSquareStep | MoveStep | QuizStep | BoardQuizStep | ReviewStep;

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  worldId: string;
  order: number;
  steps: LessonStep[];
}

export interface Unit {
  id: string;
  title: string;
  worldId: string;
  order: number;
  lessonIds: string[];
}

export interface World {
  id: string;
  title: string;
  order: number;
  unitIds: string[];
}
```

### 2. LessonEngine（src/engine/LessonEngine.ts）
- React 非依存。純粋関数のみ
- ctx-05 Section 7 の LessonState を実装
- 関数: createInitialState, handleTapSquare, handleMove, handleQuizAnswer, advanceStep, getCurrentStep, canAdvance
- 間違いを mistakes[] に記録（review step 用）

### 3. useLessonEngine フック（src/hooks/useLessonEngine.ts）
- LessonEngine を useState でラップ
- 正解時 600ms / 不正解時 700ms の自動進行タイマー（旧app参考値）
- useProgress と連携して進捗自動保存

### 4. SFENパーサー（src/lib/sfen.ts）
- 旧71行パーサーを参考に新規実装
- SFEN 盤面部分のみパース
- parseSFEN(sfen: string): CellContent[][] (9x9)
- 不正 SFEN → Error throw

### 5. 駒スプライト表示（src/components/board/Piece.tsx）
- **pieces.png をプロジェクトの assets/ にコピー**
- スプライトシート: 1040×520px, 8列×4行, 130pxタイル
  - Row 0: 先手未成 (P,L,N,S,G,B,R,K)
  - Row 1: 先手成 (+P,+L,+N,+S,+B,+R)
  - Row 2: 後手未成
  - Row 3: 後手成
- 旧 Piece.tsx のオフセット微調整値を参考に新規実装
- Image コンポーネントで sprite 表示
- フォールバック: 画像読み込み失敗時は漢字 Text で表示

### 6. 盤面コンポーネント（src/components/board/ShogiBoard.tsx）
- ctx-05 Section 5 の Props/仕様に従う
- 9x9 グリッド: View + Pressable
- セルサイズ: 画面幅ベースで動的計算（最小44pt）
- 4色ハイライト（ctx-05 の色定義）
- 座標ラベル: 筋(9〜1), 段(一〜九)
- 背景色: #DEB887 系
- onSquarePress で タップイベント

### 7. StepRenderer（src/components/lesson/StepRenderer.tsx）
- currentStep.type で分岐
- ExplainStep.tsx: テキスト + CoachBubble + オプション盤面
- TapSquareStep.tsx: 盤面 + instruction + タップ判定
- MoveStep.tsx: 2タップ方式
- QuizStep.tsx: 問題 + 選択肢ボタン
- BoardQuizStep.tsx: 小盤面サムネイル選択
- ReviewStep.tsx: 間違い再出題（間違いなければスキップ）

### 8. CoachBubble（src/components/common/CoachBubble.tsx）
- テキスト吹き出し。名前「おじい」表示
- 口調: やさしい、短文、ひらがな多め
- ビジュアル: v1はテキストのみ（アバター画像なし）

### 9. FeedbackOverlay（src/components/common/FeedbackOverlay.tsx）
- 正解: 緑バー + テキスト（「いいね！」「せいかい！」）
- 不正解: 赤バー + テキスト（「おしいね」「もういっかい やってみよう」）

### 10. テスト
- `tests/engine.test.ts`: LessonEngine の全関数テスト
- `tests/sfen.test.ts`: SFENパーサーテスト（初期配置、空盤面、成駒、不正SFEN）

### コミット粒度
1. `feat(types): レッスン・ロードマップ型定義`
2. `feat(engine): LessonEngine 純粋ロジック`
3. `feat(sfen): SFENパーサー`
4. `feat(piece): 駒スプライト表示コンポーネント`
5. `feat(board): 盤面コンポーネント`
6. `feat(step): StepRenderer 全タイプ + CoachBubble + FeedbackOverlay`
7. `feat(hook): useLessonEngine フック`
8. `test: LessonEngine + SFEN テスト`

各コミット前に型チェック + テスト（ある場合）。
最後に `git push origin feat/engine-board`。

### 完了条件
- [ ] 型定義がコンパイル通る
- [ ] LessonEngine のテストが全パス
- [ ] SFENパーサーのテストが全パス
- [ ] 盤面コンポーネントが SFEN から駒スプライト付きでレンダリングできる
- [ ] StepRenderer が全6タイプを描画分岐できる
- [ ] おじいの吹き出しが表示される
