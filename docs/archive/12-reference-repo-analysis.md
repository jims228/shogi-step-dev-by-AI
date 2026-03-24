# 旧リポジトリ調査レポート

## shogi-step-mobile 調査結果

### 概要
- React Native 0.81.5 + Expo SDK 54 + TypeScript 5.9.2
- React Navigation 7 ベースのスタック型ナビゲーション
- 82 TypeScript ソースファイル
- 44のネイティブレッスン（約4,400行のレッスンコンテンツ）

### レッスン/コンテンツモデル

**二重レンダリング戦略**:
- ネイティブレッスン（TypeScript定数）: 44レッスン
- WebViewフォールバック（外部Web URL）

**LessonData型**:
```typescript
type LessonData = {
  id: string;           // "tesuji_pawn_tataki_l1"
  title: string;        // "叩きの歩（Lv1）"
  unit: string;         // "tesuji" | "basics" | etc.
  reward_xp: number;    // 10
  steps: LessonStep[];  // 3-100 ステップ
};
```

**LessonStep型（4種類）**:
```typescript
type LessonStepType = "explain" | "move" | "tap_square" | "quiz";

type LessonStep = {
  id: string;
  type: LessonStepType;
  board_sfen: string;
  highlights?: Position[];
  instruction: string;
  coach_text?: string;
  correct_move?: { from: Position; to: Position };
  correct_square?: Position;
  quiz_options?: string[];
  quiz_answer?: number;
  success_text?: string;
  fail_text?: string;
};
```

### レッスン画面レイアウト
```
┌─────────────────────────────────┐
│ [×] [progress bar] [❤️ 5]       │  LessonHeader
├─────────────────────────────────┤
│        [Coach avatar]            │
│  ┌──────────────────────────┐    │
│  │ Coach dialogue bubble    │    │  DialogueRow
│  └──────────────────────────┘    │
├─────────────────────────────────┤
│     ┌──────────────────────┐    │
│     │  9x9 Shogi Board    │    │  BoardArea
│     │  + Highlights       │    │
│     └──────────────────────┘    │
│   [Option A] [Option B] ...      │  Quiz options
├─────────────────────────────────┤
│  [正解！やったね！]              │
│  [次へ]                          │  LessonFooter
└─────────────────────────────────┘
```

### SFENパーサー（71行）
- `parseSFEN(sfen: string): BoardState`
- BoardPiece型: `{ piece: PieceType, side: Side, promoted: boolean } | null`
- PieceType: `"fu" | "ky" | "ke" | "gi" | "ki" | "ka" | "hi" | "ou"`

### ハイライト色体系
```typescript
const HIGHLIGHT_COLORS = {
  movable: "rgba(66,133,244,0.3)",   // 青
  correct: "rgba(34,197,94,0.3)",    // 緑
  lastMove: "rgba(245,158,11,0.3)",  // 橙
  wrong: "rgba(239,68,68,0.3)",      // 赤
};
```

### 進捗管理
```typescript
type MobileProgress = {
  completedLessonIds: string[];
  lastPlayedLessonId?: string;
};
// AsyncStorage "mobileProgress:v1"
```

### 良いパターン
1. **LessonEngine分離**: 純粋ロジック（React非依存）→ テスタブル
2. **useLessonEngine**: フック層でReact状態管理
3. **Context Provider**: 進捗・設定の単一ソース
4. **データ駆動**: レッスンが宣言的データ、追加が容易
5. **レスポンシブ盤面**: `onLayout`で動的サイズ計算

### 問題のあるパターン
1. **PawnLessonRemakeScreen**: 339行、関心の混在
2. **プラットフォーム固有ハック**: Android/iOS分岐散在
3. **暗黙の状態遷移**: 明示的状態マシンなし
4. **magic number**: MASCOT_PULL_LEFT=30等
5. **カテゴリprefix マッチ**: `id.startsWith("rules_")`で脆弱
6. **テストなし**: jest設定あるがテストファイル0
7. **バリデーションなし**: SFENもレッスンデータも

### レッスン統計
- 総レッスン数: 100+（roadmap.json）
- ネイティブ実装: 44
- MVP選定: 30（mvp_lessons.json）
- 分布: Rules 11, Basics 9, Tesuji 20+, Castles 7, Openings 8

---

## shogi-commentary-ai 調査結果

### 概要
- バックエンド: Python 3.10 + FastAPI
- フロントエンド: Next.js (React 18) + TypeScript + Tailwind CSS
- ML: scikit-learn (RandomForest, GradientBoosting)
- LLM: Google Gemini API
- 将棋エンジン: YaneuraOu (NNUE) + bioshogi Ruby service

### コア: 5段階解説パイプライン
```
KIF入力 → 特徴抽出 → ML予測 → プロンプト構築 → LLM生成 → ~80文字日本語解説
```

### SFEN/盤面操作
- `parse_sfen_board(board_part)` → 9x9行列
- `apply_usi_move(board, move, turn)` → 新盤面
- `move_to_japanese(move, board, turn)` → 日本語表記
- 座標変換: `sq_to_xy(sq)`, `xy_to_file_rank(x, y)`

### TypeScript版SFENパーサー
- `parseBoardSFEN(board)` → piece配列
- `usiMoveToCoords(usi)` → 座標変換
- `formatUsiMoveJapanese(usi, pieces, side)` → "▲７六歩"

### レッスン構造（3段階）
```typescript
type LessonStep = {
  type: "guided" | "practice" | "review";
  title: string;
  sfen: string;
  orientation: "sente" | "gote";
  substeps?: Substep[];
  problems?: Problem[];
};
```

### 解説スタイル
```python
_STYLE_INSTRUCTIONS = {
    "technical": "専門的な視点で、手順や読み筋に言及しつつ解説",
    "encouraging": "親しみやすく前向きなトーンで、良い点を認めながら解説",
    "neutral": "客観的かつ淡々と、局面の状況を正確に解説",
}
```

### 駒の価値
```python
PIECE_VALUE = {
    "P": 1, "L": 3, "N": 3, "S": 5, "G": 6, "B": 8, "R": 10,
    "+P": 5, "+L": 5, "+N": 5, "+S": 6, "+B": 10, "+R": 12,
}
```

### 新プロジェクトへの活用ポイント
1. **encouragingスタイル**: 初心者向けトーンの指針
2. **SFEN TypeScriptパーサー**: 実装の参考
3. **3段階レッスン構造**: v2候補として教育設計の参考
4. **駒の日本語変換**: マッピングの参考
5. **座標変換ルール**: 筋/段の変換ロジック
