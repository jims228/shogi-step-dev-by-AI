# Shogi Step — Build Context v1
> Last updated: 2026-03-24

Builder がすぐ参照できる実装仕様。

---

## 1. Chosen Stack

| 要素 | 選定 | バージョン方針 |
|------|------|-------------|
| Runtime | Expo + React Native | create-expo-app の最新安定版 |
| Language | TypeScript (strict mode) | — |
| Routing | Expo Router | ファイルベース |
| Storage | @react-native-async-storage/async-storage | — |
| Styling | React Native StyleSheet + テーマトークン | Tailwind等の外部CSSフレームワークは使わない |
| Testing | Jest + jest-expo + @testing-library/react-native | ts-jest は使わない |
| Build | EAS Build | — |
| Linting | ESLint (Expo default) | — |

**使わないもの**: Vite, Tailwind, localStorage, React Router, Vitest, Redux, Zustand, Supabase, Firebase

---

## 2. App Shell（ディレクトリ構造）

```
shogi-step/                    # Expo project root
├── app/                       # Expo Router pages
│   ├── _layout.tsx            # Root layout (SafeAreaProvider, ThemeProvider, ProgressProvider)
│   ├── index.tsx              # Roadmap screen (home)
│   ├── lesson/
│   │   └── [id].tsx           # Lesson screen (dynamic route)
│   └── settings.tsx           # Settings screen (将来用)
├── src/
│   ├── components/
│   │   ├── board/
│   │   │   ├── ShogiBoard.tsx     # 9x9盤面コンポーネント
│   │   │   ├── Cell.tsx           # 1マス
│   │   │   └── Piece.tsx          # 駒表示
│   │   ├── lesson/
│   │   │   ├── StepRenderer.tsx   # Step type分岐
│   │   │   ├── ExplainStep.tsx
│   │   │   ├── TapSquareStep.tsx
│   │   │   ├── MoveStep.tsx
│   │   │   ├── QuizStep.tsx
│   │   │   ├── BoardQuizStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── roadmap/
│   │   │   ├── WorldCard.tsx
│   │   │   └── UnitCard.tsx
│   │   └── common/
│   │       ├── CoachBubble.tsx    # コーチ吹き出し
│   │       ├── ProgressBar.tsx    # レッスン内進捗
│   │       └── FeedbackOverlay.tsx # 正解/不正解表示
│   ├── engine/
│   │   └── LessonEngine.ts       # React非依存の純粋ロジック
│   ├── types/
│   │   └── lesson.ts             # 全型定義
│   ├── data/
│   │   ├── lessons/              # レッスンデータ (TS定数)
│   │   │   ├── w1-u1-l1-board.ts
│   │   │   └── ...
│   │   └── roadmap.ts            # World/Unit/Lessonメタデータ
│   ├── hooks/
│   │   ├── useLessonEngine.ts    # LessonEngine のReactラッパー
│   │   └── useProgress.ts        # 進捗読み書き
│   ├── lib/
│   │   ├── sfen.ts               # SFENパーサー
│   │   └── piece.ts              # 駒マッピング（アルファベット→漢字）
│   ├── theme/
│   │   └── index.ts              # デザイントークン
│   └── state/
│       └── ProgressContext.tsx    # 進捗Context Provider
├── tests/
│   ├── engine.test.ts
│   ├── sfen.test.ts
│   └── lesson-data.test.ts
├── assets/                       # アプリアイコン、スプラッシュ等
├── app.json
├── package.json
└── tsconfig.json
```

---

## 3. Navigation Model

```
Stack Navigator (Expo Router)
├── / (index)          → RoadmapScreen
├── /lesson/[id]       → LessonScreen
└── /settings          → SettingsScreen
```

- ロードマップ → レッスン: `router.push('/lesson/w1-u2-l1')`
- レッスン完了 → ロードマップ: `router.back()`
- portrait orientation のみ
- ステータスバー: light-content

---

## 4. Lesson Screen Layout

```
┌─────────────────────────────┐
│  [X]  ████████░░░░  3/6     │  ← Header: 閉じる + 進捗バー + ステップ番号
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ 🎓 コーチ吹き出し     │  │  ← CoachBubble (optional)
│  └───────────────────────┘  │
│                             │
│  説明テキスト / 問題文       │  ← メインコンテンツ
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │     盤 面 (9x9)       │  │  ← ShogiBoard (step typeによる)
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  [選択肢A] [選択肢B] [選択肢C]│  ← 選択肢 (quiz系) or なし
│                             │
├─────────────────────────────┤
│       [ 次へ → ]            │  ← Action Button
└─────────────────────────────┘
```

---

## 5. Board Responsibilities

### ShogiBoard Props

```typescript
interface ShogiBoardProps {
  sfen: string;                          // SFEN盤面文字列
  highlights?: HighlightedSquare[];      // ハイライトマス
  onSquarePress?: (pos: Position) => void; // マスタップ
  selectedSquare?: Position | null;      // 選択中マス
  interactive?: boolean;                 // タップ有効/無効
  size?: 'full' | 'small';              // フル or サムネイル
}

interface HighlightedSquare {
  position: Position;
  color: 'movable' | 'correct' | 'wrong' | 'selected';
}
```

### 盤面仕様
- 9x9グリッド: View + Pressable
- セルサイズ: `Math.floor((screenWidth - padding) / 9)` → 最小44pt目標
- 駒表示: v1はスプライト画像（pieces.png: 1040×520, 130pxタイル）。フォールバック: 漢字Text
- 後手の駒: `transform: [{ rotate: '180deg' }]`
- 座標ラベル: 右辺に筋（9〜1）、下辺に段（一〜九）
- 背景色: 木目調の薄い茶色（#DEB887系）
- 線: 薄い黒 (#333)
- ハイライト: 半透明オーバーレイ

### ハイライト色

| 種類 | 色 | 用途 |
|------|-----|------|
| movable | `rgba(66,133,244,0.25)` 青 | 移動可能マス |
| correct | `rgba(34,197,94,0.3)` 緑 | 正解 |
| wrong | `rgba(239,68,68,0.3)` 赤 | 不正解 |
| selected | `rgba(245,158,11,0.3)` 橙 | 選択中 |

---

## 6. Interaction Types

### explain step
- ユーザー操作: 「次へ」タップ
- 盤面: オプション表示（sfen指定時のみ）
- 判定: なし

### tap_square step
- ユーザー操作: 盤面のマスをタップ
- 判定: correctSquares に含まれるか
- 正解: 緑ハイライト + successText + 「次へ」表示
- 不正解: 赤ハイライト + failText + リトライ可

### move step
- ユーザー操作: 2タップ方式（駒タップ → 移動先タップ）
- 1タップ目: 駒を選択（橙ハイライト + 移動可能マス青ハイライト）
- 2タップ目: 移動先を選択
- 判定: correctMove と一致するか
- 正解: 駒が移動 + 緑 + successText
- 不正解: 赤 + failText + リセット

### quiz step
- ユーザー操作: 選択肢ボタンタップ
- 判定: correctIndex と一致するか
- 正解: ボタン緑 + explanation表示
- 不正解: ボタン赤 + 正解ボタン緑 + explanation表示

### board_quiz step
- ユーザー操作: 小さい盤面をタップ
- 判定: correctIndex と一致するか
- 正解/不正解: quiz と同じフロー

### review step
- 自動: 間違えた問題を再出題
- 間違いがなければスキップ

---

## 7. Data Schema（型定義サマリー）

docs/20-master-plan-v2.md Section G (Builder-B prompt) に完全な型定義あり。

**Key types**: `Position`, `ExplainStep`, `TapSquareStep`, `MoveStep`, `QuizStep`, `BoardQuizStep`, `ReviewStep`, `LessonStep` (union), `Lesson`, `Unit`, `World`

**LessonState** (engine内部):
```typescript
interface LessonState {
  lesson: Lesson;
  currentStepIndex: number;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  mistakes: { stepIndex: number; step: LessonStep }[];
  completed: boolean;
  selectedSquare: Position | null;
}
```

---

## 8. Progress Persistence

### 保存場所
- AsyncStorage (ローカル)
- Key: `@shogi-step/progress`

### データ構造
```typescript
interface AppProgress {
  lessons: Record<string, LessonProgress>;
  lastPlayedLessonId?: string;
  totalCompletedCount: number;
}

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  currentStepIndex: number;
  mistakeCount: number;
  completedAt?: string; // ISO date
}
```

### 保存タイミング
- レッスン内: ステップ進行ごとに currentStepIndex を保存
- レッスン完了時: completed = true, completedAt を保存
- アプリ起動時: AsyncStorage から読み込み → Context Provider に展開

---

## 9. Placeholder Asset Policy

| アセット | v1 | v2 |
|---------|-----|-----|
| 駒画像 | スプライト画像（pieces.png）+ 漢字フォールバック | 高解像度画像 |
| コーチアバター | テキスト吹き出しのみ（画像なし） | イラスト画像 |
| アプリアイコン | Expo default or 簡易作成 | プロデザイン |
| スプラッシュ | Expo default or 簡易作成 | プロデザイン |
| 効果音 | なし | 正解/不正解/駒を置く音 |
| アニメーション | 最小限（フェード程度） | 駒移動アニメーション |

---

## 10. Intentionally Postponed（意図的に先送り）

| 項目 | 理由 | 予定時期 |
|------|------|---------|
| 高解像度駒画像 | v1は既存スプライトで十分 | v2 |
| コーチアバター画像 | 同上 | v2 |
| 効果音 | 3日planに音声制作が入らない | v2 |
| 駒移動アニメーション | Animated APIの実装コスト | v2 |
| XP/ストリーク | ガミフィケーションは教育コアの後 | v2 |
| ハート制 | 初心者の恐怖心除去を優先 | v2検討 |
| spaced repetition | reviewステップで最小限対応 | v2 |
| 多言語対応 | 日本語で完成させてから | v3 |
| クラウド同期 | AsyncStorage first | v3 |
| ユーザー認証 | v1は匿名 | v3 |
| ダークモード | v1はライトモードのみ | v2 |
| 横画面対応 | portrait only | v2 |
| タブレット最適化 | phone first | v2 |

---

## 11. Test Setup Policy

### フレームワーク
- **Preset**: `jest-expo`（Babel transform 経由で TS/TSX を変換）
- **ts-jest は使わない**: Expo プロジェクトでは jest-expo が TS 変換を担当するため不要
- **テストライブラリ**: `@testing-library/react-native`（コンポーネントテスト用）

### 設定場所
- **package.json の `"jest"` セクションに一元管理**（jest.config.js / jest.config.ts は作成しない）
- `shogi-step/` サブディレクトリは `modulePathIgnorePatterns` で除外

### テストファイル配置
- `tests/` ディレクトリ（root直下）に配置
- ファイル名: `*.test.ts` / `*.test.tsx`

### コマンド
- `npm test` — 全テスト実行
- `npm test -- --watch` — ウォッチモード
- `npm test -- path/to/file` — 特定ファイル実行
