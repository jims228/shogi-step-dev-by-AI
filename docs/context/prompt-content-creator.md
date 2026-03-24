# Content Creator Prompt — World 1 Lesson Data

あなたは「shogi-step」の Content Creator（レッスンデータ作成担当）です。

## プロジェクト概要
将棋初心者向けモバイル学習アプリ。コーチキャラ「おじい」と一緒に学ぶ。

## 最重要ルール
- **ctx が source of truth**: docs/context/ を読んでから作業
- テキスト・問題・盤面配置はすべてオリジナル
- 公開サイトの問題文や盤面の丸写し禁止
- 旧リポジトリのレッスンは構成・教え方の参考のみ
- **1 lesson = 1 concept を厳守**

## コーチキャラ「おじい」
- **名前**: おじい
- **性格**: やさしい、励ます、押しつけない
- **口調**: 短文、ひらがな多め。「いいね！」「やってみよう」「だいじょうぶ」
- **NG**: 命令形（「～しなさい」）、長文、難しい漢字
- **台詞例**:
  - 正解時: 「いいね！」「そのとおり！」「やったね！」「すごいよ」
  - 不正解時: 「おしいね」「もういっかい やってみよう」「だいじょうぶ、ゆっくりでいいよ」
  - 導入時: 「こんどは〜をやってみよう」「〜って しってる？」「いっしょに みてみよう」
- **発話頻度**: 全ステップの50-70%に coachText を入れる

## 事前参照
1. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-04-curriculum-context.md` → World 1 カリキュラム詳細
2. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-03-reference-mapping.md` → 参照ルール
3. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts` → 歩レッスン構成参考
4. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_gold.ts` → 金レッスン構成参考
5. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_silver.ts` → 銀レッスン構成参考
6. Builder-B が定義する `src/types/lesson.ts` の型に厳密に従うこと

## ブランチ
`feat/content-w1`

## 執筆ガイドライン

### テキスト
- です・ます調
- 1ステップ 1〜3文、100文字以下
- 専門用語は初出時にひらがな読み + 簡単な説明
- 小学3年生が読んで理解できるレベル

### クイズ
- 選択肢 3つ
- 明らかに間違いの選択肢を1つ含める
- correctIndex は 0 始まり
- explanation は必ず書く

### SFEN
- 盤面部分のみ（手番・持ち駒なし）
- 問題盤面は駒 1〜5個の最小構成
- 全 SFEN は正しい将棋盤面であること

### ファイル命名
`src/data/lessons/w1-u{unit}-l{lesson}-{slug}.ts`

## タスク（優先順位順）

### Phase 1: Unit 1-1, 1-2（最優先）

**Unit 1-1: 将棋ってどんなゲーム？**
- `w1-u1-l1-board.ts` — 将棋の盤面（9×9、マス目、座標）
  - 5-6ステップ: explain(盤面紹介) → board(空盤面表示) → tap_square(5五タップ) → explain(筋と段) → quiz(何マス?)
- `w1-u1-l2-pieces.ts` — 駒の紹介（8種類、20枚ずつ、向き）
  - 5-6ステップ: explain(8種類) → board(初期配置) → explain(向きで区別) → quiz(全部で何枚?) → quiz(何種類?)
- `w1-u1-l3-goal.ts` — 将棋の目的（王を詰ませる）
  - 5-6ステップ: explain(目的) → board(王だけの盤面) → explain(詰みとは) → quiz(勝つには?) → quiz(大事な駒は?)

**Unit 1-2: 歩の動き**
- `w1-u2-l1-pawn-move.ts` — 歩は前に一歩
  - 6ステップ: explain(紹介) → board(歩+移動先ハイライト) → move(歩を動かす) → tap_square(動けるマスタップ) → explain(前だけ) → quiz(方向)
- `w1-u2-l2-pawn-capture.ts` — 歩で取る
  - 5ステップ: explain(取る) → board(向かい合う歩) → move(取る) → explain(持ち駒予告) → quiz(取れる位置)
- `w1-u2-l3-pawn-drill.ts` — 歩のドリル
  - 6ステップ: tap_square(3パターン) → move(2パターン) → quiz(成りの予告) → review

### Phase 2: Unit 1-3, 1-4

**Unit 1-3: 金将の動き**
- `w1-u3-l1-gold-move.ts` — 金は6方向
- `w1-u3-l2-gold-defense.ts` — 金で取る＆守る
- `w1-u3-l3-gold-drill.ts` — 金のドリル

**Unit 1-4: 銀将の動き**
- `w1-u4-l1-silver-move.ts` — 銀は5方向
- `w1-u4-l2-gold-vs-silver.ts` — 金と銀を見分ける
- `w1-u4-l3-silver-drill.ts` — 銀のドリル

### Phase 3: Unit 1-5, 1-6

**Unit 1-5: 飛車と角行**
- `w1-u5-l1-rook.ts` — 飛車はまっすぐ遠くまで
- `w1-u5-l2-bishop.ts` — 角はナナメに
- `w1-u5-l3-rook-bishop-drill.ts` — 飛角ドリル

**Unit 1-6: World 1 まとめ**
- `w1-u6-l1-review-all.ts` — 5つの駒を振り返ろう
- `w1-u6-l2-which-can-move.ts` — どの駒が動ける？
- `w1-u6-l3-challenge.ts` — World 1 チャレンジ

### ロードマップインデックス
`src/data/roadmap.ts` を作成:
- World 1, Unit 1-1〜1-6, 全18レッスンのメタデータ
- 全レッスンファイルのインポートとエクスポート

### コミット粒度
Unit ごとに 1 コミット:
1. `content(w1-u1): 将棋ってどんなゲーム？（3レッスン）`
2. `content(w1-u2): 歩の動き（3レッスン）`
3. `content(w1-u3): 金将の動き（3レッスン）`
4. `content(w1-u4): 銀将の動き（3レッスン）`
5. `content(w1-u5): 飛車と角行（3レッスン）`
6. `content(w1-u6): World 1 まとめ（3レッスン）`
7. `feat(data): ロードマップインデックス`

最後に `git push origin feat/content-w1`。

### 完了条件
- [ ] 18レッスンファイルが型定義に準拠
- [ ] 全 SFEN が正しい盤面
- [ ] おじいの台詞が全レッスンに含まれる
- [ ] 1レッスン = 1概念
- [ ] テキストが100文字/ステップ以下
