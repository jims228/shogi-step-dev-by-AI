# Shogi Step — Master Plan v2
# Reference-Driven Clean-Room Mobile Learning App

---

## A. Project Redefinition

### 以前の定義（破棄）
> Vite + React のWebアプリ。ブラウザで動く将棋学習アプリ。

### 新しい定義
> **将棋初心者のための、モバイルファースト・インストール型学習アプリ。**
>
> Duolingo Chess の「bite-sized learning」の型を将棋に適用する。
> キャラクターが横で教えるような体験、ロードマップ形式の進行、
> 1レッスン2〜5分、1概念1レッスン、即時フィードバック、
> 間違えても励まされる設計。
>
> Android / iPhone で気軽にダウンロードして遊べるアプリ。
> UI・キャラ・問題・盤面はすべてオリジナル。

### プロダクト属性
| 属性 | 値 |
|------|-----|
| ターゲット | 将棋の完全初心者（ルールを知らない人） |
| プラットフォーム | iOS + Android（モバイルアプリ） |
| 進行方式 | ロードマップ（World → Unit → Lesson） |
| 1レッスン時間 | 2〜5分 |
| 1レッスン概念数 | 1概念 |
| インタラクション | タップ中心（片手操作） |
| キャラクター | オリジナルコーチキャラ（将棋を教えてくれる存在） |
| コンテンツ形式 | 構造化データ（JSON/TS） |
| 進捗保存 | ローカル（AsyncStorage）→ 将来クラウド同期 |
| ガミフィケーション | XP、ストリーク、進捗バッジ（v1は最小限） |
| 言語 | 日本語（将来英語対応可能な設計） |

### Non-Goals（今やらないこと）
- 対局機能
- AI対戦
- オンライン対戦
- AI によるランタイムコンテンツ生成
- ユーザーアカウント・認証
- 課金・サブスク
- 動画コンテンツ
- SNS連携
- ランキング・リーダーボード

---

## B. Mobile Stack Decision

### 比較

| 観点 | Expo + React Native | Bare React Native | Flutter |
|------|-------|-------|---------|
| **3〜5日でbeta** | 最速。Expo Goで即テスト | セットアップに1日消費 | Dart学習コスト |
| **iOS/Android両対応** | 1コードベース | 1コードベース | 1コードベース |
| **盤面UI** | View + Pressable で十分 | 同左 | CustomPaint で可能だが経験少 |
| **旧資産活用** | 旧shogi-step-mobileがExpo + RN。型・パターンをそのまま参照可 | 部分的に参照可 | 全く別言語 |
| **Expo Router** | ファイルベースルーティング。ディープリンク対応 | 手動設定 | GoRouter |
| **OTAアップデート** | EAS Update で即配信 | CodePush等が必要 | 不可 |
| **ビルド/配信** | EAS Build でクラウドビルド | 手動 Xcode/Gradle | 手動 |
| **将来拡張** | eject可能。ネイティブモジュール追加可 | 最初から自由 | Dart生態系に依存 |
| **チーム知見** | 旧アプリがExpo。知見あり | — | — |

### 結論: **Expo + React Native + Expo Router + TypeScript**

**理由:**
1. 旧shogi-step-mobileが Expo SDK 54 + RN 0.81 で構築済み → 型定義、LessonEngine、SFENパーサー、テーマ等のパターンをそのまま参照できる
2. Expo Go で即座にiOS/Androidでテスト可能 → 3日planに必須
3. EAS Build/Update でストアリリースとOTAアップデートが容易
4. ファイルベースルーティング（Expo Router）でWeb風の開発体験
5. 盤面UIは View + Pressable + CSSグリッド的レイアウトで十分（Canvas不要）
6. Flutter は Dart への移行コストが3〜5日planに不適合

**旧Vite/Web方針との差分:**
| 項目 | 旧計画（破棄） | 新計画 |
|------|---------------|--------|
| フレームワーク | Vite + React | Expo + React Native |
| ルーティング | React Router v7 | Expo Router |
| スタイリング | Tailwind CSS | StyleSheet + テーマトークン |
| テスト | Vitest + RTL | Jest + RNTL |
| ストレージ | localStorage | AsyncStorage |
| デプロイ | 静的ホスティング | EAS Build → App Store / Google Play |

---

## C. What to Extract from References

### Duolingo Chess から抽出するもの

| 抽出カテゴリ | 具体的に採用するもの |
|-------------|-------------------|
| **レッスン構造** | Section > Unit > Lesson の3階層。1レッスン5〜8エクササイズ、2〜5分 |
| **学習順序** | 盤面紹介 → 駒の動き（簡単→難） → ルール → チェックメイト（早めに導入） → 戦術 |
| **インタラクション** | タップ正解マス、駒ドラッグ、複数選択、Yes/No判定、全正解タップ |
| **フィードバック** | 不正解: 赤+説明+同レッスン内再出題。正解: 緑+褒め言葉+効果音 |
| **ロードマップ** | 縦スクロールのパス。ノード型。完了=金、現在=点滅、未来=グレー |
| **bite-sized** | 1画面1エクササイズ。上に進捗バー。下にアクションボタン |
| **復習** | 時間経過でレッスンが「ひび割れ」→ 復習を促す。間違い重み付け |
| **コーチ** | フレンドリーで少しおちゃめなトーン。academic/condescendingではない |
| **ガミフィケーション** | XP、ストリーク、完了お祝い画面。ハート制はv2検討 |

### 将棋教育サイトから抽出するもの

| 抽出カテゴリ | 具体的に採用するもの |
|-------------|-------------------|
| **駒の教え順** | 歩→香→桂→銀→金→角→飛→王（難易度順） |
| **概念導入順** | 盤面→駒の動き→取る→成り→持ち駒→王手→詰み→1手詰 |
| **1手詰パターン** | 頭金→尻金→腹金→腹銀→桂打ち→飛車詰→角詰→開き王手 |
| **初心者つまずきポイント** | 銀金混同、持ち駒忘れ、二歩、成り条件、詰み認識 |
| **問題粒度** | 1問1概念。最小盤面。余計な駒を置かない |

### 旧 shogi-step-mobile から抽出するもの

| 抽出カテゴリ | 採用/回避 |
|-------------|----------|
| **LessonEngine 分離** | 採用。純粋ロジックとUI分離 |
| **4 step types** | 採用+拡張。explain, move, tap_square, quiz → + review |
| **左上キャラ + 右上説明 + 下盤面** | 採用。視線誘導が自然 |
| **ロードマップUI** | 採用。カテゴリアコーディオン + カード |
| **sakura pink テーマ** | 参考。色調は新デザインで再設計 |
| **ハイライト4色** | 採用。movable/correct/wrong/lastMove |
| **スプライト駒画像** | 回避。新規デザインで作成 |
| **WebView二重レンダリング** | 回避。ネイティブ一本化 |
| **prefix文字列マッチ** | 回避。categoryフィールドで管理 |
| **テストなし** | 回避。初日からテスト |

### shogi-commentary-ai から抽出するもの

| 抽出カテゴリ | 採用/回避 |
|-------------|----------|
| **encouraging スタイル** | 採用。「親しみやすく前向きなトーン」 |
| **guided/practice/review 3段階** | 採用。各Unitを explain→practice→reviewで構成 |
| **SFEN TypeScriptパーサー** | 参考。新規実装の設計参考 |
| **駒の日本語マッピング** | 参考 |
| **AI解説生成パイプライン** | 将来参考。v1では不要 |

---

## D. Lesson Roadmap Proposal

### 完成形ロードマップ（全8 World）

```
World 1: 将棋の世界へようこそ         ← MVP（3〜5日で完成）
World 2: 駒の動きをマスターしよう
World 3: 取る・成る・打つ
World 4: 王手と詰みを理解しよう
World 5: はじめての1手詰
World 6: もっと1手詰 & 3手詰の入口
World 7: 手筋を覚えよう
World 8: 囲いと戦法の入口
```

### World 1: 将棋の世界へようこそ（6 Unit, 18 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 1-1 | 将棋ってどんなゲーム？ | 3 |
| 1-2 | 歩の動き | 3 |
| 1-3 | 金将の動き | 3 |
| 1-4 | 銀将の動き | 3 |
| 1-5 | 飛車と角行 | 3 |
| 1-6 | World 1 まとめ & ミニドリル | 3 |

### World 2: 駒の動きをマスターしよう（6 Unit, 18 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 2-1 | 香車の動き | 3 |
| 2-2 | 桂馬の動き | 3 |
| 2-3 | 王将の動き | 3 |
| 2-4 | 全駒レビュー | 3 |
| 2-5 | 駒を取ってみよう | 3 |
| 2-6 | World 2 まとめ & ミニドリル | 3 |

### World 3: 取る・成る・打つ（5 Unit, 15 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 3-1 | 成りの基本 | 3 |
| 3-2 | 持ち駒と打つ | 3 |
| 3-3 | 二歩のルール | 2 |
| 3-4 | 打ち歩詰めの基本 | 2 |
| 3-5 | World 3 まとめ | 3 |

### World 4: 王手と詰みを理解しよう（5 Unit, 15 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 4-1 | 王手ってなに？ | 3 |
| 4-2 | 王手の3つの対応 | 3 |
| 4-3 | 詰みの基本 | 3 |
| 4-4 | 詰みと詰みでないの見分け | 3 |
| 4-5 | World 4 まとめ | 3 |

### World 5: はじめての1手詰（6 Unit, 18 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 5-1 | 頭金 | 3 |
| 5-2 | 尻金・腹金 | 3 |
| 5-3 | 銀での詰み | 3 |
| 5-4 | 桂打ちの詰み | 3 |
| 5-5 | 飛車・角での詰み | 3 |
| 5-6 | 1手詰ミックスドリル | 3 |

### World 6: もっと1手詰 & 3手詰の入口（5 Unit, 15 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 6-1 | 開き王手の詰み | 3 |
| 6-2 | 両王手 | 3 |
| 6-3 | 逃げ道封鎖 | 3 |
| 6-4 | 3手詰の考え方 | 3 |
| 6-5 | 3手詰チャレンジ | 3 |

### World 7: 手筋を覚えよう（6 Unit, 18 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 7-1 | 歩の手筋（叩き・垂れ歩） | 3 |
| 7-2 | 歩の手筋（継ぎ歩・合わせ歩） | 3 |
| 7-3 | 銀の手筋 | 3 |
| 7-4 | 金の手筋 | 3 |
| 7-5 | 飛角の手筋 | 3 |
| 7-6 | 手筋ミックスドリル | 3 |

### World 8: 囲いと戦法の入口（5 Unit, 15 Lesson）

| Unit | テーマ | Lesson数 |
|------|--------|---------|
| 8-1 | 矢倉を組んでみよう | 3 |
| 8-2 | 美濃囲いを組んでみよう | 3 |
| 8-3 | 居飛車と振り飛車 | 3 |
| 8-4 | はじめての棒銀 | 3 |
| 8-5 | 実戦ミニマッチ | 3 |

### ロードマップ設計の根拠

1. **Duolingo方式**: チェックメイト（詰み）を早めに導入。World 4（全体の真ん中より前）で王手/詰みを教える。理由: ゲームの目的を理解してから駒を学ぶのは退屈。ただし将棋の場合、駒の動きの種類が多いため、最低限の駒（歩・金・銀・飛・角）を先に教えてから詰みに入る
2. **将棋教育の定番**: 駒の教え順は歩→金→銀→飛→角→香→桂→王。旧mobile版roadmapと同じ
3. **World 1 の駒選定**: 歩・金・銀・飛・角の5駒で初期配置の大部分をカバー。香・桂・王はWorld 2で学ぶ
4. **1手詰パターン**: 頭金から始めて段階的に。将棋教育の定番順序に準拠
5. **手筋と囲い**: 1手詰を一通りやった後。実戦に近い概念を後半に配置

---

## E. World 1 Detailed Curriculum

### Unit 1-1: 将棋ってどんなゲーム？

#### Lesson 1-1-1: 将棋の盤面
- **学習目標**: 9×9の盤面を認識し、マス目があることを理解する
- **ステップ構成（5ステップ）**:
  1. `explain`: 「将棋は2人で遊ぶ日本のボードゲームです。9×9のマス目の盤で戦います」コーチ:「一緒に将棋の世界を覗いてみましょう！」
  2. `explain`: 「盤面にはタテの列（筋）とヨコの列（段）があります。タテは9〜1、ヨコは一〜九で数えます」
  3. `board`: 空の盤面を表示。「これが将棋盤です。タテ9マス×ヨコ9マスで81マスあります」
  4. `tap_square`: 「5五のマス（盤面の真ん中）をタップしてみましょう」→ 正解で「いいですね！」
  5. `quiz`: 「将棋盤は何マス×何マス？」["7×7", "8×8", "9×9"] 正解:2 解説:「9×9で81マスです！チェスの8×8より少し大きいですね」
- **「わかった！」ポイント**: 盤面をタップして反応があった瞬間

#### Lesson 1-1-2: 駒の紹介
- **学習目標**: 将棋には20枚ずつ40枚の駒があることを知る
- **ステップ構成（5ステップ）**:
  1. `explain`: 「将棋には8種類の駒があります。お互いに20枚ずつ、合計40枚で戦います」コーチ:「たくさんあるように見えますが、少しずつ覚えれば大丈夫！」
  2. `board`: 初期配置を表示。「これが最初の並べ方です。上が相手、下が自分の駒です」
  3. `explain`: 「自分の駒と相手の駒は、向きで区別します。とがった方が向いている側の駒です」
  4. `quiz`: 「将棋の駒は全部で何枚？」["20枚", "32枚", "40枚"] 正解:2 解説:「お互い20枚ずつで40枚です。チェス(32枚)より多いですね」
  5. `explain`: 「次のレッスンから、1つずつ駒の動き方を覚えていきましょう！」コーチ:「最初の駒は『歩』です。名前の通り、一歩ずつ進みますよ」
- **「わかった！」ポイント**: 初期配置を見て「多そうだけど8種類」と安心する瞬間

#### Lesson 1-1-3: 将棋の目的
- **学習目標**: 「相手の王を詰ませる」というゲームの目的を理解する
- **ステップ構成（5ステップ）**:
  1. `explain`: 「将棋の目的は、相手の『王（おう）』という駒を逃げられなくすることです。これを『詰み（つみ）』といいます」コーチ:「王さまを追い詰めた方が勝ちです！」
  2. `board`: 王だけの盤面。「これが『王』です。一番大切な駒で、これを取られたら負けです」王をハイライト
  3. `explain`: 「逆にいえば、自分の王を守りながら、相手の王を攻めるゲームです」
  4. `quiz`: 「将棋で勝つにはどうすればいい？」["相手の駒を全部取る", "相手の王を詰ませる", "自分の駒を相手の陣地に入れる"] 正解:1 解説:「相手の王を逃げられなくすれば勝ちです！駒を全部取る必要はありません」
  5. `quiz`: 「将棋で一番大事な駒は？」["歩", "飛車", "王"] 正解:2 解説:「王が取られたら負けなので、一番大事な駒です！」
- **「わかった！」ポイント**: 「全部取らなくていい、王だけ狙えばいい」と理解する瞬間

---

### Unit 1-2: 歩の動き

#### Lesson 1-2-1: 歩は前に一歩
- **学習目標**: 歩が前に1マスだけ進めることを理解する
- **ステップ構成（6ステップ）**:
  1. `explain`: 「最初に覚える駒は『歩（ふ）』です。9枚あって、一番数が多い駒です」コーチ:「兵隊さんのような駒ですね」
  2. `board`: 歩1つ（5五）+ 移動先ハイライト（5四）。「歩は前に1マスだけ進めます」
  3. `move`: 「歩を前に動かしてみましょう」歩を5五→5四に移動。正解:「やったね！」
  4. `board`: 歩が相手の歩と向き合う配置。「歩は前の駒を取ることもできます。斜めには動けません」
  5. `tap_square`: 「歩が進めるマスをタップしてください」→ 前1マスのみ正解
  6. `quiz`: 「歩が動ける方向は？」["前に1マス", "前後に1マス", "上下左右に1マス"] 正解:0 解説:「歩は前に1マスだけ。シンプルですが大切な駒です！」
- **「できた！」ポイント**: 歩を初めて自分で動かした瞬間

#### Lesson 1-2-2: 歩で取る
- **学習目標**: 歩で相手の駒を取ることを理解する
- **ステップ構成（5ステップ）**:
  1. `explain`: 「歩は前にある相手の駒を取ることができます。取った駒は自分のものになります」コーチ:「将棋のすごいところは、取った駒を再利用できること！」
  2. `board`: 自分の歩と相手の歩が向かい合う盤面。「目の前にいる相手の歩を取ってみましょう」
  3. `move`: 歩で相手の歩を取る。正解:「ナイスキャプチャー！」
  4. `explain`: 「取った駒は『持ち駒（もちごま）』になります。あとで詳しく学びますが、自分の番に盤に置き直せるんです」
  5. `quiz`: 「歩で取れるのはどの位置の駒？」[前のマスの駒を示す図、斜めの駒を示す図、横の駒を示す図] 正解:0 解説:「歩は真っ直ぐ前に進んで取ります。斜めには取れません」
- **「できた！」ポイント**: 初めて駒を取った瞬間

#### Lesson 1-2-3: 歩のドリル
- **学習目標**: 歩の動きを反復練習で定着させる
- **ステップ構成（6ステップ）**:
  1. `tap_square`: 歩が動けるマスをタップ（盤面3パターン）
  2. `move`: 歩を正しい位置に動かす（2パターン）
  3. `tap_square`: 歩で取れる駒をタップ
  4. `move`: 歩で相手の駒を取る
  5. `quiz`: 「歩が成ると何になる？」→ 「まだ習ってないよ！次のWorldで学びます」コーチ:「先が楽しみですね！」
  6. review: Unit 1-2の間違い復習（なければスキップ）
- **「できた！」ポイント**: 全問正解でUnit完了の達成感

---

### Unit 1-3: 金将の動き

#### Lesson 1-3-1: 金は6方向
- **学習目標**: 金将が6方向に動けることを理解する
- **ステップ構成（6ステップ）**:
  1. `explain`: 「次は『金将（きんしょう）』、略して『金（きん）』です。王の守り役で、6方向に動けます」コーチ:「歩は1方向でしたが、金は6方向！頼もしいですね」
  2. `board`: 金1つ（5五）+ 6方向ハイライト。「金は前・斜め前・横・真後ろの6方向に1マス動けます」
  3. `tap_square`: 「金が動けるマスを全部タップしてください」→ 6マス
  4. `explain`: 「金が動けない方向は『斜め後ろ』だけです。これだけ覚えればOK！」
  5. `move`: 金を好きな方向に動かす
  6. `quiz`: 「金が動けない方向は？」["前", "横", "斜め後ろ", "真後ろ"] 正解:2 解説:「金は斜め後ろだけ動けません。『斜め後ろ以外OK』と覚えましょう！」
- **「わかった！」ポイント**: 「斜め後ろ以外」というシンプルなルールで覚えられた瞬間

#### Lesson 1-3-2: 金で取る & 金で守る
- **学習目標**: 金で駒を取ること、金が王の隣にいると守りになることを理解する
- **ステップ構成（5ステップ）**:
  1. `board`: 金の周りに相手の駒がある盤面。「金は6方向の駒を取れます」
  2. `move`: 金で相手の駒を取る
  3. `explain`: 「金は王の隣に置くと守りとして強力です。6方向をカバーするので、王の弱点を補えます」
  4. `board`: 王の隣に金がある盤面。「金が王を守っている配置です」
  5. `quiz`: 「金が王の守りに強い理由は？」["一番強い駒だから", "6方向に動けるから", "遠くまで動けるから"] 正解:1

#### Lesson 1-3-3: 金のドリル
- **学習目標**: 金の動きを反復練習で定着させる
- **ステップ構成（6ステップ）**:
  1. `tap_square`: 金が動けるマスを全部タップ（3パターン、端/角/中央）
  2. `move`: 金で相手の駒を取る
  3. `tap_square`: 金が動けないマスをタップ（斜め後ろ）→ 「動けません！」
  4. `quiz`: 歩と金の動きの比較問題
  5. `move`: 金を最適な守り位置に動かす
  6. review: Unit 1-3 復習

---

### Unit 1-4: 銀将の動き

#### Lesson 1-4-1: 銀は5方向
- **学習目標**: 銀将が5方向に動けることを理解し、金との違いを認識する
- **ステップ構成（6ステップ）**:
  1. `explain`: 「次は『銀将（ぎんしょう）』、略して『銀（ぎん）』です。5方向に動けます」コーチ:「金と似ているけど、ちょっと違いますよ」
  2. `board`: 銀1つ（5五）+ 5方向ハイライト。「銀は前・斜め前・斜め後ろの5方向に動けます」
  3. `explain`: 「銀のポイント: 横と真後ろには動けません。金とは逆のパターンです！」
  4. `tap_square`: 「銀が動けるマスを全部タップ」→ 5マス
  5. `board`: 金と銀を並べて比較表示。「金: 斜め後ろ以外。銀: 横と真後ろ以外」
  6. `quiz`: 「銀が動けない方向は？」["斜め後ろ", "横と真後ろ", "前", "斜め前"] 正解:1

#### Lesson 1-4-2: 金と銀を見分ける
- **学習目標**: 金と銀の動きの違いを正確に区別できる
- **ステップ構成（5ステップ）**:
  1. `tap_square`: 金が動けるが銀が動けないマスをタップ（横/真後ろ）
  2. `tap_square`: 銀が動けるが金が動けないマスをタップ（斜め後ろ）
  3. `quiz`: 「横に動けるのはどっち？」["金", "銀", "両方"] 正解:0
  4. `quiz`: 「斜め後ろに動けるのはどっち？」["金", "銀", "両方"] 正解:1
  5. `explain`: 「金=守り向き（横と後ろに動ける）、銀=攻め向き（斜めに動ける）と覚えましょう！」コーチ:「金銀コンビは将棋の基本！」

#### Lesson 1-4-3: 銀のドリル
- 反復練習 + Unit 1-4 復習

---

### Unit 1-5: 飛車と角行

#### Lesson 1-5-1: 飛車はまっすぐ遠くまで
- **学習目標**: 飛車が縦横に何マスでも動けることを理解する
- **ステップ構成（6ステップ）**:
  1. `explain`: 「『飛車（ひしゃ）』は将棋で最も強い駒の1つです。タテとヨコにどこまでも動けます！」コーチ:「歩は1マスでしたが、飛車は何マスでもOK！」
  2. `board`: 飛車1つ（5五）+ 十字方向の移動可能マスをハイライト
  3. `tap_square`: 「飛車が動けるマスを3つタップ」
  4. `explain`: 「ただし、他の駒を飛び越えることはできません。途中に駒があるとそこで止まります」
  5. `board`: 飛車の進路上に駒がある配置。進路が途中で止まることを視覚化
  6. `quiz`: 「飛車が動ける方向は？」["タテとヨコ", "ナナメ", "全方向"] 正解:0

#### Lesson 1-5-2: 角行はナナメに
- **学習目標**: 角行が斜めに何マスでも動けることを理解する
- **ステップ構成（5ステップ）**:
  1. `explain`: 「『角行（かくぎょう）』、略して『角（かく）』です。ナナメにどこまでも動けます」
  2. `board`: 角1つ（5五）+ 斜め方向の移動可能マスをハイライト
  3. `tap_square`: 「角が動けるマスを3つタップ」
  4. `explain`: 「飛車=タテヨコ、角=ナナメ。この2つを合わせると全方向をカバーできます！」
  5. `quiz`: 「飛車と角、どちらがナナメに動ける？」["飛車", "角", "両方"] 正解:1

#### Lesson 1-5-3: 飛角ドリル
- 反復練習 + 飛車/角の比較問題 + Unit 1-5 復習

---

### Unit 1-6: World 1 まとめ & ミニドリル

#### Lesson 1-6-1: 5つの駒を振り返ろう
- 歩・金・銀・飛・角の動きを混合復習

#### Lesson 1-6-2: どの駒が動ける？
- 盤面を見て「この駒はここに動ける？」をYes/Noで判定

#### Lesson 1-6-3: World 1 チャレンジ
- 全Unit混合のミニテスト。パーフェクトで特別バッジ

---

## F. Problem Type Taxonomy

### v1（MVP）で実装する型

| 型名 | 英語ID | 説明 | 用途 |
|------|--------|------|------|
| 説明 | `explain` | テキスト + オプション盤面表示。タップで次へ | 概念導入 |
| マスタップ | `tap_square` | 盤面上の正しいマスをタップ | 駒が動ける場所、攻撃範囲 |
| 駒移動 | `move` | 駒をタップして移動先をタップ（2タップ方式） | 駒を動かす練習、取る練習 |
| 選択クイズ | `quiz` | テキスト問題 + 選択肢ボタン | 知識確認 |
| 盤面クイズ | `board_quiz` | 複数の盤面サムネイルから正解を選ぶ | 盤面認識 |
| 復習 | `review` | 同レッスン/Unit内の間違いを再出題 | 定着 |

### v2 以降で追加する型

| 型名 | 英語ID | 説明 | 追加時期 |
|------|--------|------|---------|
| 全マスタップ | `tap_all` | 正解マスを全てタップ | World 2以降 |
| Yes/No判定 | `yes_no` | 「この駒はここに動ける？」 | World 2以降 |
| 詰み判定 | `is_checkmate` | 「この局面は詰み？」 | World 4以降 |
| 1手詰解答 | `solve_mate` | 詰ます1手を指す | World 5以降 |
| 序列並べ | `ordering` | 手順を正しい順番に並べる | World 6以降 |
| ミニマッチ | `mini_match` | 限定盤面でのミニ対局 | World 8以降 |

---

## G. Work Allocation to 5 Roles

### Role 1: Orchestrator（あなた = このセッション）
- プロダクト定義の維持
- 全ロールへの指示出し
- 意思決定ログの管理
- コンテキスト一貫性の保証
- マージ判断

### Role 2: Researcher
- 参考資料の調査と構造化メモ作成
- レッスン順序の妥当性検証
- 問題パターンの分類
- 初心者つまずきポイントの特定
- 著作権/類似性チェック
- **成果物**: source notes, concept taxonomy, lesson order validation, problem archetypes, legal caution notes

### Role 3: Builder（2セッション並列可）
- Builder-A: アプリ基盤（Expo初期化、ナビゲーション、ロードマップUI、進捗管理）
- Builder-B: レッスンエンジン（LessonEngine、StepRenderer、盤面コンポーネント、インタラクション）
- **成果物**: 動作するアプリバイナリ

### Role 4: Content Creator
- World 1 全18レッスンのデータ作成
- レッスンテキスト・クイズ・盤面配置の作成
- 執筆ガイドラインに沿った品質管理
- コーチキャラの台詞作成
- **成果物**: 18個のレッスンJSONファイル

### Role 5: Reviewer
- レッスンの初心者目線チェック
- テキスト品質・難易度チェック
- 参考元との類似性チェック
- テスト作成・実行
- **成果物**: レビューレポート、テストスイート

---

## H. 3-Day Aggressive Plan

### Day 1: Foundation + World 1 Content Start

| 時間帯 | Orchestrator | Builder-A | Builder-B | Content Creator | Reviewer |
|--------|-------------|-----------|-----------|----------------|----------|
| 午前 | 計画確定・指示出し | Expo初期化、ナビゲーション、テーマ設定 | LessonEngine + 型定義 | Unit 1-1〜1-2 レッスンデータ作成 | テスト基盤構築 |
| 午後 | レビュー・調整 | ロードマップ画面、レッスン画面レイアウト | SFENパーサー + 盤面コンポーネント | Unit 1-3〜1-4 レッスンデータ作成 | スキーマバリデーション実装 |
| 夕方 | マージ判断 | 進捗保存（AsyncStorage） | StepRenderer（explain + quiz） | Unit 1-5〜1-6 レッスンデータ作成 | Unit 1-1〜1-2 レッスンレビュー |

**Day 1 完了条件**:
- [ ] Expo プロジェクトが初期化され、Expo Go で起動する
- [ ] ロードマップ画面のプレースホルダーが表示される
- [ ] LessonEngine の型定義とコアロジックが完成
- [ ] 盤面コンポーネントが SFEN からレンダリングできる
- [ ] World 1 全18レッスンのデータが下書き完了

### Day 2: Integration + Polish

| 時間帯 | Orchestrator | Builder-A | Builder-B | Content Creator | Reviewer |
|--------|-------------|-----------|-----------|----------------|----------|
| 午前 | マージ統合 | レッスン画面にデータ接続 | tap_square + move インタラクション | レビュー指摘の修正 | Unit 1-3〜1-6 レッスンレビュー |
| 午後 | 動作確認 | 進捗バー + ステップナビゲーション | フィードバック表示（正解/不正解） | SFEN盤面の正確性検証 | 全レッスン通しプレイ |
| 夕方 | リリース判断 | コーチ吹き出しUI | review ステップ実装 | コーチ台詞の推敲 | バグ報告 + 修正確認 |

**Day 2 完了条件**:
- [ ] World 1 全18レッスンが通しプレイ可能
- [ ] 正解/不正解のフィードバックが動作する
- [ ] 進捗が保存され、再起動後も維持される
- [ ] 盤面タップと駒移動が動作する

### Day 3: Beta Release

| 時間帯 | Orchestrator | Builder-A | Builder-B | Content Creator | Reviewer |
|--------|-------------|-----------|-----------|----------------|----------|
| 午前 | 最終レビュー | バグ修正 + UI調整 | バグ修正 + インタラクション調整 | 最終テキスト修正 | 最終通しテスト |
| 午後 | EAS Build 実行 | アプリアイコン + スプラッシュ画面 | パフォーマンス確認 | — | ストアスクリーンショット |
| 夕方 | **Beta配布** | — | — | — | — |

**Day 3 完了条件**:
- [ ] EAS Build で iOS/Android バイナリが生成される
- [ ] TestFlight / 内部テスト配布が完了
- [ ] World 1 全レッスンがバグなしでプレイ可能
- [ ] 初心者に見せて「分かりやすい」と言われるレベル

---

## I. 5-Day Safer Plan

### Day 1: Foundation
- Builder-A: Expo初期化、ナビゲーション、テーマ
- Builder-B: 型定義、LessonEngine コアロジック
- Content: Unit 1-1〜1-2 レッスンデータ
- Reviewer: テスト基盤、バリデーション

### Day 2: Core Components
- Builder-A: ロードマップ画面、レッスン画面レイアウト
- Builder-B: SFENパーサー、盤面コンポーネント、StepRenderer
- Content: Unit 1-3〜1-4 レッスンデータ
- Reviewer: Unit 1-1〜1-2 レビュー

### Day 3: Integration
- Builder-A: データ接続、進捗保存
- Builder-B: tap_square + move インタラクション、フィードバック
- Content: Unit 1-5〜1-6 レッスンデータ + レビュー修正
- Reviewer: Unit 1-3〜1-6 レビュー + 通しテスト

### Day 4: Polish
- Builder-A: コーチUI、進捗バー、アニメーション
- Builder-B: review ステップ、エッジケース修正
- Content: コーチ台詞推敲、最終修正
- Reviewer: 全レッスン通しプレイ + バグ報告

### Day 5: Release
- Builder: バグ修正、UI微調整、アプリアイコン
- Content: 最終確認
- Reviewer: 最終テスト
- Orchestrator: EAS Build → Beta配布

---

## J. Decision Log

| # | 決定事項 | 理由 | 日付 |
|---|---------|------|------|
| D1 | Web(Vite)からMobile(Expo+RN)に変更 | プロダクト要件がmobile-first installable app | 2026-03-24 |
| D2 | Expo SDK + Expo Router を採用 | 旧アプリとの参照互換性、3日beta目標、EAS Build | 2026-03-24 |
| D3 | World構造を8段階に設計 | Duolingo方式 + 将棋教育定番順序の統合 | 2026-03-24 |
| D4 | MVP = World 1（18レッスン）| 3〜5日で完成可能な最小有意義単位 | 2026-03-24 |
| D5 | 駒の教え順: 歩→金→銀→飛→角（World 1）→ 香→桂→王（World 2）| 将棋教育定番 + 初期配置カバー率のバランス | 2026-03-24 |
| D6 | 6つのステップタイプをv1で実装 | explain, tap_square, move, quiz, board_quiz, review | 2026-03-24 |
| D7 | LessonEngine分離パターン継続 | 旧appの良パターン。テスタビリティ確保 | 2026-03-24 |
| D8 | 旧docs/ のVite系計画は凍結 | mobile-first方針と矛盾。参考資料として残すが実行しない | 2026-03-24 |
| D9 | 5ロール体制に変更 | orchestrator, researcher, builder(×2), content, reviewer | 2026-03-24 |
| D10 | コーチキャラはv1でテキスト吹き出しのみ | アバター画像はv2。テキストだけでも教育効果あり | 2026-03-24 |

### 旧計画との矛盾解消

| 項目 | 旧計画（docs/内） | 新計画 | 対応 |
|------|------------------|--------|------|
| フレームワーク | Vite + React | Expo + React Native | docs/は参考資料として凍結 |
| スタイリング | Tailwind CSS | StyleSheet + テーマトークン | — |
| テスト | Vitest | Jest + RNTL | — |
| ストレージ | localStorage | AsyncStorage | — |
| レッスン型 | 3型（explanation, board, quiz） | 6型（explain, tap_square, move, quiz, board_quiz, review） | 拡張 |
| 盤面 | 漢字テキスト表示 | スプライト画像（新規作成）or 漢字（v1） | v1は漢字、v2で画像 |
| セッション数 | 5セッション並列 | 5ロール（内Builder 2並列） | 再編 |

---

## K. Open Questions

| # | 質問 | 影響範囲 | 期限 |
|---|------|---------|------|
| Q1 | コーチキャラの名前・性格・ビジュアルは？ | Content, UI | Day 2まで |
| Q2 | 駒の表示は漢字テキスト or 画像（v1）？ | Builder-B | Day 1で決定 |
| Q3 | Expo SDK のバージョンは 54（旧と同じ）or 最新？ | Builder-A | Day 1で決定 |
| Q4 | テーマカラーは sakura pink 継続 or 新デザイン？ | Builder-A, Content | Day 1で決定 |
| Q5 | ハート制（間違えるとライフ減）はv1で入れる？ | Builder-B, Content | Day 1で決定 |
| Q6 | World 1 の18レッスンで足りる？多い？ | Content, Reviewer | Day 2で検証 |
| Q7 | レッスンデータは JSON or TypeScript 定数？ | Builder, Content | Day 1で決定 |
| Q8 | 盤面のタッチ領域は十分か？（小さい端末で） | Builder-B | Day 2でテスト |

---

## L. Next Exact Prompts

### Researcher に送るプロンプト

```
あなたは「shogi-step」プロジェクトのリサーチャーです。

## あなたの役割
参考資料を調査し、構造化されたメモを作成する。
ただし、参考にするのは「構造・考え方・パターン・概念順序」であり、
文言・画像・問題を直接流用しないこと。

## タスク

### 1. 旧リポジトリ調査
以下のファイルを読み、構造化メモを作成してください:

**旧mobile app:**
- `/home/jimjace/shogi-step-mobile/src/lesson/types.ts` → step type の設計
- `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts` → エンジンのAPI設計
- `/home/jimjace/shogi-step-mobile/src/lesson/useLessonEngine.ts` → フック層の設計
- `/home/jimjace/shogi-step-mobile/src/data/roadmap.json` → 全70レッスンの順序・カテゴリ・前提条件
- `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts` → 歩レッスンの具体構成
- `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_gold.ts` → 金レッスンの具体構成
- `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_silver.ts` → 銀レッスンの具体構成
- `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts` → SFENパーサー（71行）
- `/home/jimjace/shogi-step-mobile/src/ui/board/ShogiBoard.tsx` → 盤面レンダリング
- `/home/jimjace/shogi-step-mobile/src/screens/NativeLessonScreen.tsx` → レッスン画面レイアウト
- `/home/jimjace/shogi-step-mobile/src/screens/RoadmapHomeScreen.tsx` → ロードマップ画面
- `/home/jimjace/shogi-step-mobile/src/ui/theme.ts` → デザイントークン

**旧commentary AI:**
- `/home/jimjace/shogi-commentary-ai/apps/web/src/lessons/pawn/tsugifu.ts` → guided/practice/review構造
- `/home/jimjace/shogi-commentary-ai/apps/web/src/lib/sfen.ts` → TS版SFENパーサー
- `/home/jimjace/shogi-commentary-ai/backend/api/services/ai_service.py` → encouraging style定義

### 2. 各ファイルについて以下を記録
各ファイルごとに:
- **構造として参考にすべきもの**: データ構造、API設計、パターン
- **避けるべきもの**: 肥大化、tight coupling、magic numbers
- **新プロジェクトへの具体的な活用方法**: どう形を変えて取り入れるか

### 3. レッスン順序の妥当性検証
オーケストレーターが提案した World 1 の18レッスンについて:
- 順序は初心者にとって自然か？
- 1レッスンに詰め込みすぎていないか？
- 抜けている概念はないか？
- 旧roadmap.json の順序と比較して問題はないか？

### 4. 著作権ガードレール確認
以下を明確に仕分けてください:
- 「直接流用NG」のもの（テキスト、画像、問題図、盤面配置）
- 「構造として参考可」のもの（教え方の順序、問題タイプ、レイアウト概念）
- 「注意が必要」なもの（似すぎないようチェックが必要）

### 出力形式
`docs/research-notes.md` として保存してください。
以下の構造で:
1. Source-by-source notes
2. Concept taxonomy
3. Lesson order validation
4. Problem archetypes
5. Beginner pitfalls
6. Legal/copyright caution notes
```

---

### Builder-A に送るプロンプト

```
あなたは「shogi-step」プロジェクトの Builder-A（アプリ基盤担当）です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild
- 旧リポジトリを参照して知見を抽出するが、コードはコピペしない
- 実装は新規に書く

## コンテキスト
- 将棋初心者向けモバイル学習アプリ
- Expo + React Native + Expo Router + TypeScript
- iOS/Android 両対応
- 旧アプリ: /home/jimjace/shogi-step-mobile（Expo SDK 54）

## 事前参照（実装前に読むこと）
1. `/home/jimjace/shogi-step-mobile/package.json` → 依存関係の参考
2. `/home/jimjace/shogi-step-mobile/app.config.ts` → Expo設定の参考
3. `/home/jimjace/shogi-step-mobile/src/navigation/RootNavigator.tsx` → ナビゲーション構造
4. `/home/jimjace/shogi-step-mobile/src/ui/theme.ts` → デザイントークン
5. `/home/jimjace/shogi-step-mobile/src/screens/RoadmapHomeScreen.tsx` → ロードマップUI
6. `/home/jimjace/shogi-step-mobile/src/state/progress.tsx` → 進捗管理パターン

## タスク（Day 1）

### 1. Expo プロジェクト初期化
```bash
npx create-expo-app@latest shogi-step --template blank-typescript
```
- Expo Router をセットアップ
- 必要な依存: @react-native-async-storage/async-storage, react-native-safe-area-context, react-native-screens
- jest + @testing-library/react-native をセットアップ
- TypeScript strict mode

### 2. ディレクトリ構造
```
app/                    # Expo Router ページ
  (tabs)/               # タブナビゲーション（将来用）
  _layout.tsx           # ルートレイアウト
  index.tsx             # ロードマップ画面
  lesson/[id].tsx       # レッスン画面
  settings.tsx          # 設定画面
src/
  components/
    lesson/             # レッスンUI
    board/              # 盤面
    roadmap/            # ロードマップ
    common/             # 共通UI
  engine/               # LessonEngine（React非依存）
  types/                # 型定義
  data/                 # レッスンデータ
    lessons/
    roadmap.ts
  hooks/                # カスタムフック
  lib/                  # ユーティリティ
  theme/                # デザイントークン
  state/                # Context Providers
tests/
```

### 3. テーマ設定
旧 theme.ts を参考に、新テーマトークンを作成:
- colors（プライマリ、背景、テキスト、成功、エラー、盤面背景）
- spacing（xs, sm, md, lg, xl）
- borderRadius
- typography（fontSize, fontWeight）
- shadows

### 4. ロードマップ画面（app/index.tsx）
- World 1 のUnit一覧をカードで表示
- 各Unitカード: タイトル、レッスン数、進捗バッジ
- カードタップで最初の未完了レッスンに遷移
- スクロール可能なリスト
- 旧RoadmapHomeScreenのアコーディオン方式を参考にするが新デザイン

### 5. レッスン画面枠組み（app/lesson/[id].tsx）
- ヘッダー: 進捗バー + 閉じるボタン
- コンテンツエリア: StepRenderer（プレースホルダー）
- フッター: 「次へ」ボタン
- レイアウト: 旧NativeLessonScreenの視線誘導を参考

### 6. 進捗管理（src/state/progress.tsx）
- AsyncStorage で保存
- Context Provider パターン（旧 progress.tsx 参考）
- インターフェース:
  ```typescript
  type LessonProgress = {
    lessonId: string;
    completed: boolean;
    currentStepIndex: number;
    mistakeCount: number;
  };
  type WorldProgress = {
    completedLessonIds: string[];
    lastPlayedLessonId?: string;
  };
  ```

### 7. コミット粒度
1. `init: Expo + TypeScript プロジェクト初期化`
2. `feat(theme): デザイントークン設定`
3. `feat(roadmap): ロードマップ画面実装`
4. `feat(lesson): レッスン画面枠組み`
5. `feat(progress): AsyncStorage 進捗管理`

各コミット前に型チェック。最後に push。

## 重要な制約
- Expo Go で動作確認すること
- 旧コードのコピペ禁止
- portrait orientation のみ
- 余計なライブラリ追加禁止
```

---

### Builder-B に送るプロンプト

```
あなたは「shogi-step」プロジェクトの Builder-B（レッスンエンジン・盤面担当）です。

## プロジェクトポリシー: Reference-Driven Clean-Room Rebuild

## コンテキスト
- 将棋初心者向けモバイル学習アプリ（Expo + React Native）
- Builder-A がアプリ基盤を並行構築中
- あなたはレッスンエンジンと盤面コンポーネントを担当

## 事前参照（実装前に読むこと）
1. `/home/jimjace/shogi-step-mobile/src/lesson/types.ts` → step type設計
2. `/home/jimjace/shogi-step-mobile/src/lesson/LessonEngine.ts` → 純粋ロジック分離
3. `/home/jimjace/shogi-step-mobile/src/lesson/useLessonEngine.ts` → フック層
4. `/home/jimjace/shogi-step-mobile/src/ui/board/sfen.ts` → SFENパーサー（71行）
5. `/home/jimjace/shogi-step-mobile/src/ui/board/ShogiBoard.tsx` → 盤面レンダリング
6. `/home/jimjace/shogi-step-mobile/src/ui/board/Piece.tsx` → 駒表示
7. `/home/jimjace/shogi-commentary-ai/apps/web/src/lib/sfen.ts` → TS版SFENパーサー

## タスク（Day 1〜2）

### 1. 型定義（src/types/lesson.ts）
```typescript
export interface Position { row: number; col: number; }

export type StepType = 'explain' | 'tap_square' | 'move' | 'quiz' | 'board_quiz' | 'review';

export interface ExplainStep {
  type: 'explain';
  text: string;
  coachText?: string;
  sfen?: string;           // オプション盤面表示
  highlights?: Position[];
}

export interface TapSquareStep {
  type: 'tap_square';
  instruction: string;
  coachText?: string;
  sfen: string;
  correctSquares: Position[];  // 正解マス（1つ or 複数）
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
- React非依存の純粋ロジック（旧パターン採用）
- 状態:
  ```typescript
  interface LessonState {
    lesson: Lesson;
    currentStepIndex: number;
    stepResult: 'pending' | 'correct' | 'incorrect' | null;
    mistakes: { stepIndex: number; step: LessonStep }[];
    completed: boolean;
    selectedSquare: Position | null;  // move の1タップ目
  }
  ```
- 関数:
  - `createInitialState(lesson: Lesson): LessonState`
  - `handleTapSquare(state: LessonState, pos: Position): LessonState`
  - `handleMove(state: LessonState, from: Position, to: Position): LessonState`
  - `handleQuizAnswer(state: LessonState, index: number): LessonState`
  - `advanceStep(state: LessonState): LessonState`
  - `getCurrentStep(state: LessonState): LessonStep`
  - `canAdvance(state: LessonState): boolean`

### 3. SFENパーサー（src/lib/sfen.ts）
- 旧71行パーサーを参考に新規実装
- SFEN盤面部分のみパース
- 型: CellContent = アルファベット表記 | null
- parseSFEN(sfen: string): CellContent[][]

### 4. 駒表示マッピング（src/lib/piece.ts）
- アルファベット → 漢字マッピング
- 先手/後手判定
- v1は漢字テキスト表示（画像はv2）

### 5. 盤面コンポーネント（src/components/board/ShogiBoard.tsx）
- React Native View + Pressable で9×9グリッド
- Props: { sfen, highlights?, onSquarePress?, selectedSquare? }
- 駒は漢字 Text で表示
- 後手の駒は rotate(180deg)
- ハイライト色:
  - movable: rgba(66,133,244,0.25)
  - correct: rgba(34,197,94,0.3)
  - wrong: rgba(239,68,68,0.3)
  - selected: rgba(245,158,11,0.3)
- マス座標ラベル（筋/段）
- 盤面背景色
- レスポンシブ（画面幅に応じてセルサイズ計算）

### 6. StepRenderer（src/components/lesson/StepRenderer.tsx）
- currentStep の type に応じて描画分岐
- ExplainRenderer: テキスト + コーチ吹き出し + オプション盤面
- TapSquareRenderer: 盤面 + インストラクション + タップ判定
- MoveRenderer: 盤面 + 2タップ方式の駒移動
- QuizRenderer: 問題 + 選択肢ボタン
- BoardQuizRenderer: 小さい盤面複数表示
- ReviewRenderer: 間違い再出題

### 7. useLessonEngine フック（src/hooks/useLessonEngine.ts）
- LessonState を useState でラップ
- handleTapSquare, handleMove 等をコールバック化
- 進捗自動保存

### 8. テスト
- LessonEngine のユニットテスト
- SFENパーサーのユニットテスト

### コミット粒度
1. `feat(types): レッスン・ロードマップ型定義`
2. `feat(engine): LessonEngine 純粋ロジック`
3. `feat(sfen): SFENパーサー`
4. `feat(board): 盤面コンポーネント`
5. `feat(step): StepRenderer 全タイプ`
6. `feat(hook): useLessonEngine フック`
7. `test: LessonEngine + SFEN テスト`
```

---

### Content Creator に送るプロンプト

```
あなたは「shogi-step」プロジェクトのコンテンツクリエイターです。

## プロジェクトポリシー
- 将棋初心者向け学習アプリのレッスンデータを作成する
- Duolingo Chess の bite-sized learning の型を将棋に適用
- テキスト・問題・盤面配置はすべてオリジナルで作成
- 公開サイトの問題文や盤面の丸写し禁止
- 旧リポジトリのレッスンは構成・教え方の参考のみ

## 事前参照
1. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_pawn.ts` → 歩レッスンの参考
2. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_gold.ts` → 金レッスンの参考
3. `/home/jimjace/shogi-step-mobile/src/data/lessons/basics_silver.ts` → 銀レッスンの参考
4. Builder-B が定義した src/types/lesson.ts の型定義を厳密に守ること

## 執筆ガイドライン

### トーン
- です・ます調
- 親しみやすく前向き（encouraging）
- 専門用語は初出時に必ずひらがな読みと簡単な説明を添える
- 「〜しましょう」「〜ですね」「すごい！」「やったね！」を自然に使う
- 1ステップ3〜5文（100文字以下推奨）

### コーチキャラ台詞
- 各ステップにオプションで coachText を入れる
- キャラの名前は仮で「しょうた先生」（後で変更可能）
- トーン: フレンドリーで少しおちゃめ。先生というより年上の友達
- 例: 「歩は一歩ずつ前に進む、まさに名前通りの駒だね！」

### クイズ設計
- 選択肢は3つ（シンプルに）
- 明らかに間違いの選択肢を1つ含める（自信を育てる）
- 正解後の解説は必ず書く
- correctIndex は0始まり

### SFEN盤面
- 問題に使う盤面は駒を最小限にする（1〜5個）
- SFENの盤面部分のみ（手番・持ち駒は含めない）
- 全てのSFENは正しい将棋の盤面であること

## タスク: World 1 全18レッスンのデータ作成

### 以下のJSONファイルを作成してください:

Unit 1-1（将棋ってどんなゲーム？）:
- `src/data/lessons/w1-u1-l1-board.json` （将棋の盤面）
- `src/data/lessons/w1-u1-l2-pieces.json` （駒の紹介）
- `src/data/lessons/w1-u1-l3-goal.json` （将棋の目的）

Unit 1-2（歩の動き）:
- `src/data/lessons/w1-u2-l1-pawn-move.json`
- `src/data/lessons/w1-u2-l2-pawn-capture.json`
- `src/data/lessons/w1-u2-l3-pawn-drill.json`

Unit 1-3（金将の動き）:
- `src/data/lessons/w1-u3-l1-gold-move.json`
- `src/data/lessons/w1-u3-l2-gold-defense.json`
- `src/data/lessons/w1-u3-l3-gold-drill.json`

Unit 1-4（銀将の動き）:
- `src/data/lessons/w1-u4-l1-silver-move.json`
- `src/data/lessons/w1-u4-l2-gold-vs-silver.json`
- `src/data/lessons/w1-u4-l3-silver-drill.json`

Unit 1-5（飛車と角行）:
- `src/data/lessons/w1-u5-l1-rook.json`
- `src/data/lessons/w1-u5-l2-bishop.json`
- `src/data/lessons/w1-u5-l3-rook-bishop-drill.json`

Unit 1-6（World 1 まとめ）:
- `src/data/lessons/w1-u6-l1-review-all.json`
- `src/data/lessons/w1-u6-l2-which-can-move.json`
- `src/data/lessons/w1-u6-l3-challenge.json`

### 各レッスンの構成
- 5〜8ステップ
- 型定義に厳密に準拠
- step types を適切に混ぜる（explain → tap_square/move → quiz のパターン）
- 最後のステップは quiz か review

### ファイル命名規則
`w{world}-u{unit}-l{lesson}-{slug}.json`

### ロードマップインデックス
`src/data/roadmap.ts` を作成:
- World, Unit, Lesson のメタデータ定義
- 全レッスンJSONのインポートとエクスポート

### コミット粒度
Unit ごとに1コミット（6コミット）+ roadmap.ts で1コミット
```

---

### Reviewer に送るプロンプト

```
あなたは「shogi-step」プロジェクトのレビュアーです。

## あなたの役割
品質ゲートの番人。初心者目線でレッスンをチェックし、
技術的な品質も担保する。

## 品質基準チェックリスト

### 教育品質
- [ ] 初心者に難しすぎないか（小学3年生が読んで理解できるか）
- [ ] 1レッスンに1概念か（2つ以上の新概念が混在していないか）
- [ ] テキストが長すぎないか（1ステップ100文字以下）
- [ ] 専門用語に初出時の説明があるか
- [ ] 誤答フィードバックが冷たくないか（「もう一度！」ではなく「おしい！」等）
- [ ] 盤面の駒数が少なすぎ/多すぎないか（1〜5個目安）
- [ ] 難易度が急に上がっていないか（各レッスン間の差）
- [ ] 説明と問題の整合性があるか
- [ ] です・ます調で統一されているか
- [ ] コーチの台詞が自然か

### 技術品質
- [ ] JSONがスキーマ型に準拠しているか
- [ ] SFEN文字列が正しい盤面を表しているか
- [ ] correctIndex が選択肢の範囲内か
- [ ] correctSquares / correctMove が盤面上の有効な位置か
- [ ] 必須フィールドが全て埋まっているか
- [ ] id がファイル名と一致しているか

### 著作権
- [ ] 参考元の表現を写しすぎていないか
- [ ] 問題図・盤面がオリジナルか
- [ ] Duolingo のUI/フローを模倣しすぎていないか

### モバイルUI
- [ ] タップ領域が十分か
- [ ] テキストが小さすぎないか
- [ ] 1画面に収まるか（スクロール不要が原則）

## タスク
1. テスト基盤の構築（Jest + RNTL）
2. スキーマバリデーション関数の実装
3. SFENバリデーション関数の実装
4. レッスンデータ品質テストの実装
5. Content Creator の成果物が来たら上記チェックリストで全件チェック
6. Builder の成果物が来たら通しプレイテスト

## 出力
- `docs/review-checklist.md` に結果を記録
- テストコードを `tests/` に配置
```

---

### Context Manager に渡す情報

```
## Shogi Step Project Context（2026-03-24 時点）

### North Star
将棋初心者が「わかった！」「できた！」を繰り返しながら、
1日5分ずつ将棋の基本を身につけられるモバイルアプリ。

### Non-Goals
対局機能、AI対戦、オンライン対戦、課金、認証、動画

### Legal Guardrails
- Duolingo の名称/ロゴ/色/キャラ/文章/問題/画像を流用しない
- 公開将棋サイトの問題図/画像/文章を転載しない
- 参考にするのは概念順序、学習設計、問題タイプ、抽象パターンのみ
- 最終成果物はすべてオリジナル

### Current Tech Decision
Expo + React Native + Expo Router + TypeScript + AsyncStorage

### Lesson Roadmap
8 Worlds, MVP = World 1 (18 lessons, 6 units)

### World 1 Scope
U1: 将棋とは (3L) → U2: 歩 (3L) → U3: 金 (3L) → U4: 銀 (3L) → U5: 飛角 (3L) → U6: まとめ (3L)

### Open Questions
Q1: コーチキャラの名前・ビジュアル
Q2: 駒表示は漢字 or 画像（v1）
Q3: Expo SDK バージョン
Q4: テーマカラー
Q5: ハート制の有無（v1）
Q6: 18レッスンの分量の妥当性
Q7: レッスンデータ形式（JSON or TS）
Q8: 小端末での盤面タッチ領域

### Decisions Made
D1-D10: docs/20-master-plan-v2.md の Decision Log 参照

### Pending Research
- 旧リポジトリの詳細調査メモ
- レッスン順序の妥当性検証

### Blocked Items
なし

### Next Prompts
Researcher → Builder-A → Builder-B → Content Creator → Reviewer
（Researcher と Builder-A は同時起動可能）
```
