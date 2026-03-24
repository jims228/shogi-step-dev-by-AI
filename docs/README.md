# docs/ ナビゲーション

## Source of Truth（正式ドキュメント）

### `context/` — 運用ドキュメント（常に最新を維持）

| ファイル | 内容 | 更新頻度 |
|---------|------|---------|
| `ctx-00-master-context.md` | プロジェクトの北極星。ビジョン・対象・スタック・ロール・方針 | 方針変更時 |
| `ctx-01-decision-log.md` | 全意思決定の記録（D1〜）。理由・代替案・影響 | 決定のたび |
| `ctx-02-open-questions.md` | 未解決事項（Q1〜）。優先度・推奨・ブロック関係 | 解決のたび |
| `ctx-03-reference-mapping.md` | 参照元ごとの OK/NG 一覧。駒スプライト利用方針を含む | 参照元追加時 |
| `ctx-04-curriculum-context.md` | 学習ロードマップ。World 1 全18レッスンの詳細 | カリキュラム変更時 |
| `ctx-05-build-context.md` | 技術仕様。ディレクトリ構造・型定義・画面設計・盤面仕様 | 仕様変更時 |
| `ctx-06-prompt-registry.md` | 各ロールへ送るプロンプトの管理 | プロンプト送信時 |
| `ctx-07-session-status.md` | 各ロールの現在状態・ブロッカー・次アクション | 随時 |
| `ctx-08-daily-sync.md` | 日次進捗ログ | 毎日 |
| `ctx-09-guardrail-checklist.md` | 法務・品質・スコープのガードレール | レビュー時 |

### `20-master-plan-v2.md` — 全体像の親文書（参照用）

ctx-00〜09 の元となった包括的な計画書。全体像を一気に把握したいときに参照する。
ctx-系と矛盾がある場合は **ctx-系が正**。

---

## `archive/` — 旧計画（参考資料のみ）

Vite + React Web 時代の計画ドキュメント（00〜12）。
D1 決定（Web → Mobile）により **破棄済み**。歴史的参考としてのみ保持。

**実装時にこれらを参照しないこと。**

---

## どのファイルを見ればいいか（ロール別）

| ロール | まず読む | 次に読む |
|--------|---------|---------|
| **全員** | `ctx-00` | `ctx-01`, `ctx-09` |
| **Builder-A** | `ctx-05` | `ctx-03` (Source 3: 旧mobile) |
| **Builder-B** | `ctx-05` | `ctx-03` (Source 3, 6: 駒スプライト), `ctx-04` |
| **Content Creator** | `ctx-04` | `ctx-03` (Source 2, 4), `ctx-02` (Q1) |
| **Reviewer** | `ctx-09` | `ctx-04`, `ctx-02` |
| **Researcher** | `ctx-03` | `ctx-04`, `ctx-02` |
| **Context Manager** | 全部 | `ctx-07`, `ctx-08` |

---

## 参照可能な外部リポジトリ

| リポジトリ | パス | 参照範囲 |
|-----------|------|---------|
| shogi-step-mobile | `/home/jimjace/shogi-step-mobile` | 駒スプライト（直接利用OK）、駒オフセット微調整値、LessonEngine設計、UIレイアウト |
| Shogi_AI_Learning | `/home/jimjace/Shogi_AI_Learning` | 盤面コンポーネント設計、レッスンデータ構造、SFEN解析 |
| shogi-commentary-ai | `/home/jimjace/shogi-commentary-ai` | encouraging スタイル定義、guided/practice/review 構造 |

**駒スプライト**: `shogi-step-mobile/assets/pieces.png` を新プロジェクトの `assets/` にコピーして利用する。詳細は `ctx-03` Source 6 参照。
