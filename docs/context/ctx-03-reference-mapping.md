# Shogi Step — Reference Mapping v1.1
> Last updated: 2026-03-24 (旧リポジトリ調査結果反映)

参考元ごとに「何を参考にしてよいか」「何をコピーしてはいけないか」を明確化する。

---

## Source 1: Duolingo Chess

| 項目 | 内容 |
|------|------|
| **Source** | Duolingo Chess（チェス学習アプリ） |
| **参考にしてよいもの（概念レベル）** | - Section > Unit > Lesson の3階層構造<br>- 1レッスン5〜8エクササイズ、2〜5分<br>- チェックメイト早期導入の学習設計思想<br>- タップ正解マス / 駒移動 / Yes-No判定 などのインタラクション設計パターン<br>- 不正解時: 赤表示+説明+同レッスン内再出題<br>- 正解時: 緑表示+褒め言葉<br>- 縦スクロールのロードマップパス（ノード型）<br>- 1画面1エクササイズ + 上に進捗バー + 下にアクションボタン<br>- 時間経過で復習促進（ひび割れUI）<br>- コーチ: フレンドリーで少しおちゃめなトーン<br>- XP、ストリーク、完了お祝い |
| **コピーしてはいけないもの** | - Duolingo の名称、ロゴ、ブランドカラー（緑）<br>- キャラクターデザイン（フクロウ等）<br>- 具体的なUIレイアウトの直写し<br>- 問題文・説明文のテキスト<br>- アニメーション・サウンド・画像素材<br>- 「Duolingo」「Duo」等の商標 |
| **抽出コンセプトタグ** | `lesson-granularity`, `roadmap-ux`, `bite-sized`, `tutor-presence`, `spaced-review`, `feedback-loop`, `gamification` |
| **フォローアップ** | - 将棋は駒種類がチェスより多いため、チェックメイト導入をどこまで前倒しできるか → Q15で検討済（W5維持） |

---

## Source 2: 将棋上達サイト（shogi-joutatsu.com 等）

| 項目 | 内容 |
|------|------|
| **Source** | 将棋初心者向け解説サイト群 |
| **参考にしてよいもの（概念レベル）** | - 初心者向けの駒の教え順: 歩→香→桂→銀→金→角→飛→王<br>- 概念導入順: 盤面→駒の動き→取る→成り→持ち駒→王手→詰み→1手詰<br>- 1手詰パターン分類: 頭金→尻金→腹金→腹銀→桂打ち→飛車詰→角詰→開き王手<br>- 初心者つまずきポイントの知見: 銀金混同、持ち駒忘れ、二歩、成り条件、詰み認識<br>- 問題の粒度: 1問1概念、最小盤面、余計な駒を置かない |
| **コピーしてはいけないもの** | - サイト上の説明文テキスト<br>- 具体的な問題図・盤面配置<br>- 画像・図表・動画<br>- サイト独自の教え方のフレーズ |
| **抽出コンセプトタグ** | `piece-order`, `concept-sequence`, `tsume-taxonomy`, `beginner-pitfalls`, `minimal-board` |
| **フォローアップ** | - 当プロジェクトの駒順は歩→金→銀→飛→角。定番と異なり香→桂が後。理由: 金銀比較学習を優先 |

---

## Source 3: 旧 shogi-step-mobile（調査完了）

| 項目 | 内容 |
|------|------|
| **Source** | `/home/jimjace/shogi-step-mobile` (Expo + React Native, SDK 54) |

### Reusable Patterns（新プロジェクトで設計参考にすべき）

| パターン | 旧実装の詳細 | 新プロジェクトへの活用 |
|---------|-------------|-------------------|
| **LessonEngine 分離** | 純粋関数: `startLesson()`, `submitMove()`, `submitTap()`, `submitQuiz()`, `advanceStep()`, `selectSquare()`。全て新stateを返す、副作用なし | **reusable pattern**。同じ関数型設計を採用。新型(board_quiz, review)を追加 |
| **useLessonEngine Hook** | 自動進行タイマー: 正解600ms/不正解700ms。SFEN→盤面変換、ハイライト生成、フィードバック管理 | **reusable pattern**。タイマー値と自動進行ロジックを参考 |
| **4 Step Types** | explain, move, tap_square, quiz。各stepに sfen, instruction, coach_text, correct answer | **reusable + 拡張**。6型に拡張（+board_quiz, review） |
| **2タップ移動** | 1タップ目: 先手駒選択 → 2タップ目: 移動先。selectedSquare で状態管理 | **reusable pattern**。そのまま採用 |
| **画面レイアウト** | Header(進捗バー+ライフ+閉じる) → DialogueRow(キャラ+吹き出し) → BoardArea → Footer(次へボタン) | **reusable layout**。v1ではライフを除外 |
| **ハイライト4色** | movable(青), correct(緑), lastMove(橙), wrong(赤)。HighlightOverlayで絶対配置 | **reusable**。色コード+方式を採用 |
| **ロードマップUI** | カテゴリ別アコーディオン。sections: rules, basics, kiki, pawn_app, tsume, tesuji, castle, opening | **reusable concept**。World > Unit 構造に再設計 |
| **進捗管理** | ProgressProvider + AsyncStorage。completedLessonIds[], lastPlayedLessonId。key: "mobileProgress:v1" | **reusable pattern**。mistakeCount追加 |
| **テーマトークン** | colors(brand pink #E65A8D, board tan #D2A86A), typography(h1:22,h2:16,body:14), spacing(xs:6〜xl:24), radius, shadows | **reusable structure**。色は新デザイン |
| **SFENパーサー** | 大文字=先手, 小文字=後手, "+"=成り, 数字=空マス, "/"=行区切り。9x9にパディング | **reusable pattern**。新規実装の設計参考 |
| **スプライト駒表示** | pieces.png (1040x520, 8列x4行)。PIECE_SCALE=1.3。駒ごとにオフセット微調整 | **avoid (v1)**。v1は漢字テキスト。v2で新画像 |
| **コーチアバター** | Rive アニメーション or 絵文字フォールバック。CoachAvatar.tsx | **avoid (v1)**。v1はテキスト吹き出しのみ |
| **レッスンデータ44本** | basics_pawn, tesuji x27, castle x7, opening x8。各stepにsfen+instruction+coach_text | **構成参考のみ**。コンテンツは全てオリジナル |

### Avoid（避けるべきもの）

| 問題点 | 旧実装の詳細 | 理由 |
|--------|-------------|------|
| **WebView二重レンダリング** | PawnLessonRemakeScreen.tsxがWebViewを使用。ネイティブとWebViewの2系統が共存 | 複雑性。新プロジェクトはネイティブ一本 |
| **prefix文字列マッチ** | カテゴリ判定をlessonId prefixで実施 | 脆弱。enumフィールドで管理 |
| **テストなし** | テストファイルが見当たらない | 初日からテスト |
| **ライフ制 (lives: 5)** | LessonState.livesで管理。game-over alert表示 | v1ではなし（Q5推奨）。初心者の恐怖心除去 |
| **LAN IP自動検出** | Settings画面でwebBaseUrl/apiBaseUrlを手動設定。WebView用 | 不要（WebView使わない） |
| **Sakura Burst エフェクト** | enabled=false で無効化済み。8-13枚の花びらアニメーション | v1では不要。v2検討 |

### 旧レッスン分量の参考データ

| カテゴリ | レッスン数 | 新World対応 |
|---------|----------|------------|
| rules | 不明（roadmap.json要確認） | W1 Unit 1-1 |
| basics (各駒) | basics_pawn等 | W1 Unit 1-2〜1-5, W2 |
| kiki (利き) | 不明 | W2-W3 |
| tsume (詰将棋) | 不明 | W5-W6 |
| tesuji | 27本 | W7 |
| castle | 7本 | W8 |
| opening | 8本 | W8 |

---

## Source 4: 旧 shogi-commentary-ai（調査完了）

| 項目 | 内容 |
|------|------|
| **Source** | `/home/jimjace/shogi-commentary-ai` (Next.js + Python FastAPI) |

### Reusable Patterns

| パターン | 旧実装の詳細 | 新プロジェクトへの活用 |
|---------|-------------|-------------------|
| **Encouraging Style 定義** | 3スタイル: technical/encouraging/neutral。encouraging = 「親しみやすく前向きなトーンで、指し手の良い点を認めながら解説」 | **reusable tone**。Content Creator のガイドラインに直接反映 |
| **Encouraging 表現パターン** | attack: 「攻めの手を繰り出しています」, defense: 「守りを固めています」, sacrifice: 「捨て駒の筋で勝負に出ています」 | **reusable vocabulary**。ポジティブフレーミングの参考 |
| **安全度の日本語表現** | ≥80: 「堅い囲いで安定」, 50-80: 「ある程度守られている」, 30-50: 「やや不安」, <30: 「危険」 | **reusable concept**。段階的な言い回しの参考 |
| **SFEN解析ユーティリティ** | parse_sfen_board(), apply_usi_move(), find_king(), sq_to_xy(), piece_side() | **reusable pattern**（設計参考）。TS版を新規実装 |
| **駒マッピング** | P(歩), L(香), N(桂), S(銀), G(金), B(角), R(飛), K(王) | **reusable data concept** |
| **guided/practice/review** | レッスンを3段階構成。概念説明→実践→復習 | **reusable structure**。各Unitの3L構成に反映済み |
| **詰将棋データ構造** | id, title, sfen, steps(手数), description | **reusable schema**。W5以降のデータ構造参考 |
| **ExplanationPlanner** | 構造化中間表現を作ってからテキスト生成。flow, topic, tactical_motif, evidence, confidence | **future reference**。v2以降のAI解説生成に参考 |

### Avoid

| 問題点 | 理由 |
|--------|------|
| AI解説生成パイプライン（Gemini連携） | v1ではAIランタイム生成なし |
| Supabase認証 / JWT / API Keys | v1はアカウント機能なし |
| bioshogi_service（Ruby Sinatra） | v1では将棋エンジン連携なし |
| YaneuraOu エンジン連携 | v1では不要 |
| Next.js / SSR / API Routes | Mobile appでは不要 |
| 8次元特徴量抽出 | v1では不要 |
| バッチ解析パイプライン | v1では不要 |

---

## Source 5: Shogi_AI_Learning（参考利用）

| 項目 | 内容 |
|------|------|
| **Source** | `/home/jimjace/Shogi_AI_Learning` (Next.js + Expo + FastAPI monorepo) |
| **参考にしてよいもの** | - 盤面コンポーネントの設計思想（ShogiBoard.tsx, PieceSprite.tsx）<br>- レッスンデータ構造（guided/practice 形式）<br>- SFEN解析ユーティリティ（apps/web/src/lib/shogi/）<br>- 駒ごとのオフセット微調整値（PieceSprite.tsx）<br>- ディレクトリ構造の参考 |
| **コピーしてはいけないもの** | - コードの直接コピペ<br>- Gemini API連携部分<br>- YaneuraOuエンジン連携 |
| **抽出コンセプトタグ** | `board-component`, `piece-sprite`, `lesson-structure`, `sfen-utils` |

---

## Source 6: 駒スプライト画像（直接利用）

| 項目 | 内容 |
|------|------|
| **Source** | `/home/jimjace/shogi-step-mobile/assets/pieces.png`<br>`/home/jimjace/Shogi_AI_Learning/apps/web/public/images/pieces.png` |
| **仕様** | 1040×520px, 8列×4行, 130pxタイル<br>Row 0: 先手未成 (P,L,N,S,G,B,R,K)<br>Row 1: 先手成 (+P,+L,+N,+S,+B,+R)<br>Row 2-3: 後手未成/成 |
| **利用方針** | **直接コピーして新プロジェクトの assets/ に配置してOK**（自社アセット） |
| **微調整オフセット** | 旧 `Piece.tsx` のオフセット値を参照して新 Piece コンポーネントに反映<br>例: King sente {x:-1, y:-7}, Pawn sente {x:-5, y:0} |
| **フォールバック** | スプライト読み込み失敗時は漢字テキスト表示 |

---

## 参照ルール早見表

| 行為 | OK? | 例 |
|------|-----|----|
| 概念的な学習設計パターンを参考にする | OK | 「1レッスン1概念」の原則を採用 |
| データ構造・型定義の設計思想を参考にする | OK | LessonEngine分離パターンを参考に新規実装 |
| 教え方の順序・概念分類を参考にする | OK | 「頭金→尻金→腹金」の順序を採用 |
| 旧コードの関数シグネチャを参考にする | OK | startLesson/submitMove/advanceStep の命名・引数構造 |
| 旧コードのデザイントークン構造を参考にする | OK | spacing(xs/sm/md/lg/xl)の段階構造 |
| 旧コードの自動進行タイマー値を参考にする | OK | 正解600ms/不正解700msの体験値 |
| 旧コードをコピペする | NG | sfen.tsの実装をそのまま新プロジェクトに貼り付け |
| 旧アプリの駒スプライト画像を使う | **OK** | pieces.png は自社アセット。新プロジェクトにコピーして利用可 |
| 旧アプリの駒オフセット微調整値を参照する | **OK** | Piece.tsx のオフセット値を参考に新規実装 |
| 旧アプリのその他の画像素材を使う | NG | character-ojii.png 等はオリジナルキャラとして作り直す |
| Duolingo のUI画面を写す | NG | ロードマップ画面のレイアウトを pixel単位で模倣 |
| 公開サイトの問題文を使う | NG | 説明文を一字一句同じに書く |
| 自分で書いた説明文 | OK | 同じ概念を自分の言葉で書く |
| 自分で作った盤面配置 | OK | 歩を5五に置くSFENを自分で作成 |

---

## 調査から判明した設計上の重要知見

### 1. 旧appのレッスン規模
- **44本のネイティブレッスン**（basics 1 + tesuji 27 + castle 7 + opening 8）
- 新計画は **World 1 で 18本**。旧appは basics が1本（歩のみ）に対し、新計画は5駒で15本（+概要3本）。**十分な粒度**

### 2. 旧appのライフ制
- **5ライフ制**があった（LessonState.lives）。game-over alert で強制終了
- 新計画では **Q5: v1なし推奨**。旧appの体験から学び、初心者の離脱防止を優先

### 3. 旧appの WebView 問題
- PawnLessonRemakeScreen は WebView 経由でレッスン表示。LAN IP設定が必要
- 新計画は **ネイティブ一本**。この判断は正しい

### 4. Commentary AI の Encouraging Style
- 具体的な3スタイル定義（technical/encouraging/neutral）が存在
- Content Creator に渡すガイドラインに直接活用可能

### 5. SFENパーサーの差分
- Mobile版: 71行、9x9パディング、シンプル
- Commentary版(Python): より高機能（apply_usi_move, find_king, attacked_squares）
- 新プロジェクト v1: Mobile版の範囲で十分。将来拡張時にCommentary版を参考
