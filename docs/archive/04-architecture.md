# アーキテクチャ提案

## 推奨技術スタック

| 要素 | 選択 | 理由 |
|------|------|------|
| フレームワーク | **Vite + React + TypeScript** | 最小構成、高速、SSR不要 |
| スタイリング | **Tailwind CSS v4** | シンプル、依存少 |
| テスト | **Vitest + React Testing Library** | Viteとの統合が自然 |
| 状態管理 | **React useState/useContext** | 外部ライブラリ不要 |
| ルーティング | **React Router v7** | 軽量、標準的 |
| データ | **静的JSONファイル（型付き）** | DB不要、スキーマ検証可能 |

## ディレクトリ構造

```
shogi-step-dev-by-AI/
├── src/
│   ├── app/                  # アプリエントリ、ルーティング
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── components/           # UIコンポーネント
│   │   ├── lesson/           # レッスン関連
│   │   │   ├── LessonList.tsx
│   │   │   ├── LessonDetail.tsx
│   │   │   └── StepRenderer.tsx
│   │   ├── board/            # 盤面コンポーネント
│   │   │   └── ShogiBoard.tsx
│   │   └── quiz/             # クイズコンポーネント
│   │       └── QuizStep.tsx
│   ├── types/                # 型定義
│   │   └── lesson.ts         # レッスンスキーマ型
│   ├── data/                 # レッスンデータ（JSON）
│   │   ├── lessons/
│   │   │   ├── 01-intro.json
│   │   │   ├── 02-pawn.json
│   │   │   └── 03-gold.json
│   │   └── index.ts          # レッスンインデックス
│   ├── hooks/                # カスタムフック
│   │   └── useProgress.ts
│   └── lib/                  # ユーティリティ
│       ├── sfen.ts           # SFENパーサー
│       ├── piece.ts          # 駒表示名マッピング
│       ├── lessonEngine.ts   # レッスンエンジン（React非依存）
│       └── validation.ts     # スキーマバリデーション
├── tests/                    # テストファイル
│   ├── schema.test.ts
│   ├── sfen.test.ts
│   ├── sfen-validation.test.ts
│   ├── content-quality.test.ts
│   ├── content-review.test.ts
│   ├── test-utils.tsx
│   └── setup.ts
├── public/
│   └── images/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── CLAUDE.md
```

## レッスンスキーマ型

```typescript
// types/lesson.ts

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
  sfen: string;           // SFEN盤面部分のみ
  highlights?: Position[];
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
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner';
  steps: LessonStep[];
}

export interface LessonProgress {
  lessonId: string;
  currentStepIndex: number;
  completed: boolean;
}
```

## 盤面/コンポーネント分離
- `ShogiBoard` は完全に独立したコンポーネントとし、props経由でSFEN文字列を受け取るだけ
- 最初は9x9グリッド + 漢字テキスト表記の最小実装
- 後から差し替え可能な設計にしておく

## バリデーション/テスト方針
- レッスンJSONに対するランタイムバリデーション（自前型ガード関数）
- SFENパーサーのユニットテスト
- コンポーネントのレンダリングテスト（React Testing Library）
- レッスンデータの内容チェック（空フィールド、不正な選択肢数等）
