# Session 3 — Board / Interaction プロンプト

```
あなたは「shogi-step」プロジェクトの盤面コンポーネント担当です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリを積極的に調査し、知見を抽出してから実装する
- 実装は新規に書く（コピペ禁止）
- 良い理由が説明できるパターンのみ採用する

## コンテキスト
- 将棋初心者向け学習アプリ。Vite + React + TypeScript
- Session 1（アーキテクト）が完了済み
- src/types/lesson.ts に BoardStep 型と Position 型が定義済み
- 旧リポジトリ2つが参照可能

## 事前準備
1. `git pull origin main` で最新取得
2. `git checkout -b feat/board` でブランチ作成
3. `npm install`
4. CLAUDE.md を読んでプロジェクト規約を確認
5. src/types/lesson.ts の BoardStep, Position 型を確認

## Phase 1: 参照調査（実装前に必ず実行）

### 必読ファイル
1. `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts`
   → SFENパーサー実装（71行）。パース手法、エラー処理を確認
   → BoardPiece型: { piece: PieceType, side: Side, promoted: boolean } | null
2. `/home/jimjace/shogi-step-mobile/src/ui/board/ShogiBoard.tsx`
   → 9x9グリッド実装、セルサイズ計算、ハイライト色定義
   → HighlightType: movable(青), correct(緑), lastMove(橙), wrong(赤)
3. `/home/jimjace/shogi-step-mobile/src/ui/board/Piece.tsx`
   → スプライトシート方式の駒表示（新実装では漢字テキストに変更）
4. `/home/jimjace/shogi-commentary-ai/apps/web/src/lib/sfen.ts`
   → TypeScript版SFENパーサー。parseBoardSFEN, usiMoveToCoords の設計
5. `/home/jimjace/shogi-commentary-ai/backend/api/utils/shogi_explain_core.py`
   → SFEN関連の座標変換関数群（sq_to_xy, xy_to_file_rank）
   → 駒の日本語表記変換（move_to_japanese）

### 調査で特に注目すべき点
- 旧mobile版SFENパーサー（71行）のシンプルさ → 同程度の規模感を目指す
- 旧mobile版のPieceType定義（"fu", "ky", "ke"...）→ 新実装ではSFEN標準のアルファベットを採用
- 旧mobile版のハイライト色4種 → 新実装ではv1で必要な色のみ（board step用のhighlight色1種）
- commentary-ai版の座標変換 → 筋/段の変換ルールを正確に把握
- 両リポジトリとも持ち駒表示あり → v1では持ち駒表示はスコープ外

## Phase 2: 実装

### 2-1. SFENパーサー（lib/sfen.ts）
`src/lib/sfen.ts` を作成:
- 旧実装の71行を参考にしつつ新規実装
- SFEN盤面部分のみパース（手番・持ち駒・手数は不要）
- インターフェース:
  ```typescript
  import type { Position } from '../types/lesson';

  // 駒の表現: SFEN標準アルファベット（旧mobile版のPieceType="fu"等はシンプルさのため不採用）
  type PieceChar = 'K' | 'R' | 'B' | 'G' | 'S' | 'N' | 'L' | 'P'
                 | 'k' | 'r' | 'b' | 'g' | 's' | 'n' | 'l' | 'p';
  type PromotedPieceChar = `+${PieceChar}`;
  type CellContent = PieceChar | PromotedPieceChar | null;

  type Board = CellContent[][];  // [row][col], 9x9

  function parseSFEN(sfen: string): Board;
  ```
- 大文字 = 先手、小文字 = 後手
- `+` = 成駒
- 数字 = 空マス連続
- `/` = 段区切り
- 不正SFEN → Error を throw

### 2-2. 駒の表示名マッピング（lib/piece.ts）
`src/lib/piece.ts` を作成:
- commentary-ai版のmove_to_japanese を参考に漢字マッピング
- マッピング:
  ```
  K→王, R→飛, B→角, G→金, S→銀, N→桂, L→香, P→歩
  k→玉, r→飛, b→角, g→金, s→銀, n→桂, l→香, p→歩
  +P/+p→と, +R/+r→龍, +B/+b→馬, +S/+s→成銀, +N/+n→成桂, +L/+l→成香
  ```
- 先手/後手の判定関数: `isGote(piece: CellContent): boolean`

### 2-3. 盤面コンポーネント（components/board/ShogiBoard.tsx）
`src/components/board/ShogiBoard.tsx` を作成:
- Props: `{ sfen: string; highlights?: Position[] }`
- SFENパース → 9x9 CSSグリッド表示
- 各マスに駒の漢字を表示
- 後手の駒は rotate(180deg)（旧mobile版と同じアプローチ）
- highlights に含まれるマスは背景色変更（薄い青: rgba(66,133,244,0.25) — 旧mobileのmovable色を参考）
- マス座標ラベル:
  - 上辺: 9 8 7 6 5 4 3 2 1（筋）
  - 右辺: 一 二 三 四 五 六 七 八 九（段）
- 盤面背景: 薄い黄土色（#F5DEB3程度）
- Tailwind CSS + インラインスタイル（グリッドサイズ計算用）
- レスポンシブ: `max-w-[360px] w-full mx-auto`

### 2-4. テスト
`tests/sfen.test.ts` を作成:
- 平手初期配置のパーステスト（`lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL`）
- 空盤面（`9/9/9/9/9/9/9/9/9`）のパーステスト
- 駒1つだけの盤面（`9/9/9/9/4P4/9/9/9/9`）のパーステスト
- 成駒を含むSFEN（`+P` 等）のパーステスト
- 不正SFEN（段数不足、不明文字）でErrorが投げられることのテスト
- 駒表示名変換のテスト

## Phase 3: コミットとプッシュ

1. `feat(sfen): SFENパーサー実装（参照: mobile版71行パーサー + commentary-ai座標変換）`
2. `feat(piece): 駒表示名マッピング（参照: commentary-ai版move_to_japanese）`
3. `feat(board): 盤面コンポーネント実装（参照: mobile版ShogiBoard + ハイライト色体系）`
4. `test(sfen): SFENパーサーユニットテスト`

各コミット前に `npx tsc --noEmit` と `npm test`（テストがある場合）。
最後に `git push origin feat/board`。

## 重要な制約
- 参照調査は必ず実装前に行う
- 旧コードのコピペ禁止
- 外部将棋ライブラリ不使用
- 駒画像不使用（漢字テキストのみ）
- ドラッグ＆ドロップ不実装
- 持ち駒表示はスコープ外
- 静的盤面表示のみ（手番・着手処理不要）
- コンポーネントは props のみに依存（外部状態なし）
```
