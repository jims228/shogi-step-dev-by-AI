# Session 4 — Content / Curriculum プロンプト

```
あなたは「shogi-step」プロジェクトのコンテンツ（カリキュラム）担当です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリのレッスンデータを積極的に調査し、教育設計の知見を抽出する
- レッスン文言は新規に書く（コピペ禁止）
- 旧レッスンのSFEN配置・ステップ構成・教育的工夫を参考にしてよい

## コンテキスト
- 将棋初心者向け学習アプリ。ターゲットは完全初心者
- Session 1（アーキテクト）が完了済み
- src/types/lesson.ts にレッスンスキーマ型が定義済み
- 旧リポジトリ2つが参照可能

## 事前準備
1. `git pull origin main` で最新取得
2. `git checkout -b feat/content` でブランチ作成
3. `npm install`
4. CLAUDE.md を読んでプロジェクト規約を確認
5. src/types/lesson.ts を読んでスキーマ型を正確に把握（特に各step型の必須フィールド）

## Phase 1: 参照調査（実装前に必ず実行）

### 必読ファイル
1. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts`
   → 歩レッスンのステップ構成、SFEN配置、instruction文言のトーン
2. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_gold.ts`
   → 金将レッスンの構成。動ける方向の説明方法
3. `/home/jimjace/shogi-step-mobile/src/data/lessons/rules_intro.ts` （存在する場合）
   → 入門レッスンの構成。将棋の説明の入り方
4. `/home/jimjace/shogi-step-mobile/src/data/roadmap.json`
   → レッスン順序、カテゴリ体系、前提条件の設計
5. `/home/jimjace/shogi-step-mobile/src/data/lessons/index.ts`
   → 44レッスンの一覧。カリキュラム全体像の把握
6. `/home/jimjace/shogi-commentary-ai/apps/web/src/lessons/pawn/tsugifu.ts`
   → guided/practice/review 3段階構造の教育設計
7. `/home/jimjace/shogi-commentary-ai/backend/api/services/ai_service.py`
   → encouraging スタイルの指示文（「親しみやすく前向きなトーン」）

### 調査で特に抽出すべきもの
- 歩レッスンで使われているSFEN文字列（正確な盤面配置として再利用可能）
- 金将レッスンで使われているSFEN文字列
- 各レッスンのステップ数と構成パターン
- instruction/coach_text の語調（です・ます調か、だ・である調か）
- クイズの選択肢数と難易度設計
- 旧レッスンで「初心者に分かりにくい」と思われる箇所

## Phase 2: 最初の3レッスンの教育設計方針

以下の方針で3レッスンを設計する:

### レッスン01: 将棋ってなに？（01-intro.json）
**最適化ポイント: 恐怖心の除去**
- 「将棋は難しそう」という先入観を壊す
- ルール詳細には入らない。「こんなゲームです」レベル
- 盤面を1回見せるだけ（初期配置のSFEN）
- クイズは非常に簡単にする（自信を持たせる）

### レッスン02: 歩の動き（02-pawn.json）
**最適化ポイント: 最小限の成功体験**
- 駒1つだけに集中。情報量を最小に
- 「歩が前に1マス進める」だけを伝える
- 成駒（と金）は紹介するが深入りしない
- SFENは歩1つだけの極小配置を使う

### レッスン03: 金将の動き（03-gold.json）
**最適化ポイント: パターン認識の導入**
- 歩（1方向）→ 金（6方向）の対比で「駒ごとに動きが違う」を定着
- 「王の守り役」という文脈を与えて、なぜ金が重要かを伝える
- ハイライトを活用して動ける方向を視覚的に示す

### 3レッスン共通原則
- 1ステップ = 1概念（詰め込まない）
- 各レッスン5〜7ステップ
- 末尾に2つのクイズ（自信を育てる設計）
- です・ます調で統一
- 専門用語は初出時に必ず平易な説明を添える
- SFEN盤面は駒1〜2個の極小配置（01の初期配置を除く）
- 励ましのトーン（commentary-aiのencouragingスタイル準拠）

## Phase 3: 実装

### 3-1. レッスン執筆ガイドライン
`src/data/AUTHORING_GUIDE.md` を作成:
- JSONの書き方ルール（型準拠）
- トーン規約（です・ます調、励まし、具体例必須）
- クイズ規約（3〜4選択肢、明らかな間違い1つ含む、解説必須）
- SFEN記述ルール（盤面部分のみ、手番等は含めない）
- ファイル命名規則（`NN-slug.json`）
- 1ステップの文量目安（3〜5文、150文字以下）
- v1のstep types（explanation, board, quiz）
- 旧リポジトリ参照時の注意（パターンは参考にするが文言はコピペしない）

### 3-2. レッスン01: 将棋ってなに？（01-intro.json）
`src/data/lessons/01-intro.json`:
- id: "01-intro"
- category: "はじめに"
- difficulty: "beginner"
- ステップ構成（5〜7ステップ）:
  1. explanation: 将棋とは何か（2人で遊ぶボードゲーム、日本の伝統）
  2. explanation: 将棋盤の説明（9×9マス、「筋」と「段」）
  3. board: 初期配置（SFEN: `lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL`）、「たくさんの駒が並んでいますね。少しずつ覚えていきましょう！」
  4. explanation: 先手と後手の説明
  5. explanation: 勝利条件（相手の「王」を動けなくすること＝詰み）
  6. quiz: 「将棋盤は何マス×何マスでしょう？」選択肢: ["7×7", "8×8", "9×9", "10×10"] 正解: 2
  7. quiz: 「将棋の目的は？」選択肢: ["相手の駒を全部取る", "相手の王を詰ませる", "自分の王を敵陣に入れる"] 正解: 1

### 3-3. レッスン02: 歩の動き（02-pawn.json）
- id: "02-pawn"
- category: "駒の動き"
- 旧 basics_pawn.ts のSFEN配置を参考にしつつ新規作成
- ステップ構成:
  1. explanation: 歩の紹介（一番数が多い駒、9枚ある）
  2. board: 歩が1つだけの盤面 + 移動先ハイライト（SFEN: `9/9/9/9/4P4/9/9/9/9`、highlight: [{row:3, col:4}]）
  3. explanation: 歩は前に1マスだけ進める
  4. explanation: 二歩の禁止（同じ筋に自分の歩を2枚置けない）を簡単に
  5. board: 歩が敵陣3段目に入った場面（成りの紹介）
  6. quiz: 「歩はどの方向に動けますか？」選択肢: ["前に1マス", "前後に1マス", "上下左右に1マス"] 正解: 0
  7. quiz: 「歩が敵陣に入るとどうなりますか？」選択肢: ["何も起きない", "成って『と金』になれる", "相手に取られる"] 正解: 1

### 3-4. レッスン03: 金将の動き（03-gold.json）
- id: "03-gold"
- category: "駒の動き"
- 旧 basics_gold.ts のSFEN配置を参考にしつつ新規作成
- ステップ構成:
  1. explanation: 金将の紹介（王の守り役、6方向に動ける）
  2. board: 金が中央にある盤面 + 6方向ハイライト（SFEN: `9/9/9/9/4G4/9/9/9/9`、highlight: 6マス）
  3. explanation: 金将は「斜め後ろ」以外の6方向に動ける
  4. board: 金将で王を守る配置例
  5. explanation: 金将は成れない（すでに強い駒だから）
  6. quiz: 「金将が動けない方向は？」選択肢: ["前", "横", "斜め後ろ", "真後ろ"] 正解: 2
  7. quiz: 「金将は成ることができますか？」選択肢: ["できる", "できない", "条件つきでできる"] 正解: 1

### 3-5. レッスンインデックス
`src/data/index.ts`:
```typescript
import type { Lesson } from '../types/lesson';
import intro from './lessons/01-intro.json';
import pawn from './lessons/02-pawn.json';
import gold from './lessons/03-gold.json';

export const lessons: Lesson[] = [intro, pawn, gold];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(l => l.id === id);
}

export function getLessonsByCategory(category: string): Lesson[] {
  return lessons.filter(l => l.category === category);
}
```

## Phase 4: コミットとプッシュ

1. `docs(content): レッスン執筆ガイドライン追加`
2. `content: レッスン01「将棋ってなに？」（参照: mobile版rules系レッスン構成）`
3. `content: レッスン02「歩の動き」（参照: mobile版basics_pawn.tsのSFEN・構成）`
4. `content: レッスン03「金将の動き」（参照: mobile版basics_gold.tsのSFEN・構成）`
5. `feat(data): レッスンインデックスモジュール`

最後に `git push origin feat/content`。

## 重要な制約
- 参照調査は必ず実装前に行う
- 旧レッスンの文言コピペ禁止（SFEN文字列は正確であれば参考可）
- すべてのJSONは src/types/lesson.ts に厳密準拠
- SFEN文字列は正しい将棋盤面であること
- correctIndex は0始まり
- 各レッスンのidはファイル名と一致
- 初心者が読んで理解できるか常に自問する
- 1ステップあたり3〜5文（150文字以下）に抑える
```
