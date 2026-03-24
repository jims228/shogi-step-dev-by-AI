# Shogi Step — Decision Log v1
> Last updated: 2026-03-24

決定事項を時系列で管理する。各決定は不可逆性と影響範囲を明示する。

---

| ID | Decision | Reason | Alternatives Considered | Impact | Owner | Status | Date |
|----|----------|--------|------------------------|--------|-------|--------|------|
| D1 | Web(Vite+React)からMobile(Expo+RN)に変更 | プロダクト要件がmobile-first installable app。Web SPAでは「気軽にダウンロード」を満たせない | Bare RN（セットアップ重い）、Flutter（Dart学習コスト、旧資産参照不可） | **破壊的**: docs/00-11の全計画がobsolete。Stack全面変更 | Orchestrator | confirmed | 2026-03-24 |
| D2 | Expo SDK + Expo Router を採用 | 旧appがExpo。参照互換性、3日beta目標、EAS Build/Update | Bare RN（自由だが遅い）、Flutter（別言語） | Builder-A/B の実装方針を決定 | Orchestrator | confirmed | 2026-03-24 |
| D3 | World構造を8段階に設計 | Duolingo方式（Section>Unit>Lesson）+ 将棋教育定番順序の統合 | フラットリスト（見通し悪い）、3段階（粗すぎ） | カリキュラム全体の骨格 | Orchestrator | confirmed | 2026-03-24 |
| D4 | MVP = World 1（6 Unit, 18 Lesson） | 3〜5日で完成可能な最小有意義単位。歩・金・銀・飛・角の5駒で初期配置の大部分カバー | World 1-2（36L: 多すぎ）、World 1の半分（9L: 少なすぎ） | スコープの上限を固定 | Orchestrator | confirmed | 2026-03-24 |
| D5 | 駒の教え順: 歩→金→銀→飛→角（W1）→ 香→桂→王（W2） | 将棋教育定番 + 初期配置カバー率。歩が最もシンプル、金銀で比較学習、飛角で大駒導入 | 歩→飛→角→金→銀（大駒先行: 派手だが比較学習しにくい） | Content Creator のレッスン順序を決定 | Orchestrator | confirmed | 2026-03-24 |
| D6 | v1で6つのステップタイプを実装 | explain, tap_square, move, quiz, board_quiz, review。旧4型を拡張。board_quizは盤面認識、reviewは定着に必須 | 旧4型のまま（board_quiz/review不足）、8型（v1に過剰） | Builder-B の StepRenderer 設計を決定 | Orchestrator | confirmed | 2026-03-24 |
| D7 | LessonEngine分離パターン継続 | 旧appの良パターン。純粋ロジックとUI分離でテスタビリティ確保 | Hooks直接実装（テストしにくい）、Redux（過剰） | Builder-B のアーキテクチャ方針 | Orchestrator | confirmed | 2026-03-24 |
| D8 | 旧docs/のVite系計画は凍結 | mobile-first方針と矛盾。docs/00-11は参考資料として残すが実行しない | 削除（参考情報も失う）、並行維持（混乱の元） | 全ロールが参照すべきドキュメントが明確化 | Orchestrator | confirmed | 2026-03-24 |
| D9 | 5ロール+Context Manager体制 | Orchestrator, Researcher, Builder(x2), Content Creator, Reviewer + Context Manager | 3ロール（並列度不足）、7ロール（管理コスト過剰） | 並列開発の粒度を決定 | Orchestrator | confirmed | 2026-03-24 |
| D10 | コーチキャラはv1でテキスト吹き出しのみ | アバター画像はv2。テキストだけでも教育効果あり。画像制作は3日planに不適合 | v1から画像（時間不足）、コーチなし（体験が薄い） | Content/UI両方に影響 | Orchestrator | confirmed | 2026-03-24 |
| D11 | コーチキャラ: 名前「おじい」、やさしい・励ます・押しつけない、短文・ひらがな多め | ユーザー直接指定。旧appの「おじいちゃん」コンセプトを継承しつつオリジナル表現 | しょうた先生（仮名）、動物キャラ | Content Creator全テキストの口調を決定 | Orchestrator | confirmed | 2026-03-24 |
| D12 | 駒表示: 既存スプライト画像(pieces.png)を直接利用 + 漢字フォールバック | 自社アセットが利用可能。3日planでも画像品質を確保できる | 漢字テキストのみ（見た目劣る）、新規画像制作（時間不足） | Builder-Bの盤面実装方針を決定 | Orchestrator | confirmed | 2026-03-24 |

---

## 旧計画との矛盾解消マップ

| 項目 | 旧計画（docs/00-11） | 新計画（docs/20-） | 対応状態 |
|------|---------------------|-------------------|---------|
| フレームワーク | Vite + React | Expo + React Native | **obsolete** |
| スタイリング | Tailwind CSS | StyleSheet + テーマトークン | **obsolete** |
| テスト | Vitest + RTL | Jest + RNTL | **obsolete** |
| ストレージ | localStorage | AsyncStorage | **obsolete** |
| ルーティング | React Router v7 | Expo Router | **obsolete** |
| デプロイ | 静的ホスティング | EAS Build → App Store / Google Play | **obsolete** |
| レッスン型 | 3型（explanation, board, quiz） | 6型（+tap_square, move, board_quiz, review） | **拡張** |
| 盤面表示 | 漢字テキスト | v1漢字、v2画像 | **継続** |
| レッスン数 | 3レッスン | 18レッスン（World 1） | **拡張** |
| セッション | 5セッション並列 | 5ロール（内Builder 2並列）+ Context Manager | **再編** |

---

## 次の決定予定

| ID | 要決定事項 | 期限 | 依存 |
|----|-----------|------|------|
| ~~D11~~ | ~~コーチキャラの名前・性格~~ | **決定済み** | — |
| ~~D12~~ | ~~駒表示方法~~ | **決定済み** | — |
| D13 | Expo SDK バージョン（54 or 最新） | Day 1 | Builder-A |
| D14 | テーマカラー（sakura pink 継続 or 新） | Day 1 | Builder-A |
| D15 | ハート制（v1有無） | Day 1 | Builder-B, Content |
| D16 | レッスンデータ形式: JSON or TS定数 | Day 1 | Builder, Content |
