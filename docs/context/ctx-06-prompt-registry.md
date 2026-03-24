# Shogi Step — Prompt Registry v1
> Last updated: 2026-03-24

各ロールに送った/送る予定のプロンプトを管理する。

---

## Prompt一覧

| # | Prompt Name | Target Role | Purpose | Expected Output | Status | Superseded By | Notes |
|---|------------|-------------|---------|----------------|--------|---------------|-------|
| P1 | Researcher Initial Audit | Researcher | 旧リポジトリ調査 + レッスン順序検証 + 著作権ガードレール | `docs/research-notes.md` | **drafted** | — | docs/20 Section L に完全テキストあり |
| P2 | Builder-A Day 1 | Builder-A | Expo初期化、ナビゲーション、テーマ、ロードマップ画面、進捗管理 | 動作するExpoプロジェクト + 5コミット | **drafted** | — | docs/20 Section L に完全テキストあり |
| P3 | Builder-B Day 1-2 | Builder-B | 型定義、LessonEngine、SFENパーサー、盤面、StepRenderer | エンジン + 盤面 + 全StepRenderer + テスト + 7コミット | **drafted** | — | docs/20 Section L に完全テキストあり |
| P4 | Content Creator W1 | Content Creator | World 1 全18レッスンのデータ作成 | 18個のレッスンTSファイル + roadmap.ts + 7コミット | **drafted** | — | docs/20 Section L に完全テキストあり |
| P5 | Reviewer Setup | Reviewer | テスト基盤、バリデーション、品質チェック | テストスイート + レビューレポート | **drafted** | — | docs/20 Section L に完全テキストあり |
| P6 | Context Manager Init | Context Manager | Master Context + 全管理ドキュメント作成 | ctx-00〜09ドキュメント群 | **sent** | — | 本プロンプト |

---

## Prompt依存関係

```
P6 (Context Manager) ← 先行（コンテキスト整備）
    ↓
P1 (Researcher) ← 参考資料調査
    ↓
P2 (Builder-A) ← 並列起動可
P3 (Builder-B) ← 並列起動可（ただしP2のExpo初期化完了後にmerge）
    ↓
P4 (Content Creator) ← P3の型定義が確定してから
    ↓
P5 (Reviewer) ← P4の成果物が来てからフルレビュー（テスト基盤はP2/P3と並列可）
```

---

## 送信推奨順序

1. **P1 (Researcher)** → 即時送信可。旧リポジトリ調査は他のロールのブロッカーにならない
2. **P2 (Builder-A)** → P1と同時送信可。Expo初期化はResearcherの結果を待たない
3. **P3 (Builder-B)** → P2と同時送信可。ただしExpoプロジェクトが存在する前提
4. **P4 (Content Creator)** → P3の型定義が確定してから。ただし型定義はdocs/20にドラフト済みなので、型確定を待たずにドラフト着手も可能
5. **P5 (Reviewer)** → テスト基盤構築はP2/P3と同時。レッスンレビューはP4の後

---

## Day 2 以降に必要なプロンプト（未起草）

| # | Prompt Name | Target Role | Purpose | Status |
|---|------------|-------------|---------|--------|
| P7 | Builder-A Day 2 Integration | Builder-A | データ接続、進捗バー、コーチUI | not drafted |
| P8 | Builder-B Day 2 Interaction | Builder-B | tap_square/move実装、フィードバック | not drafted |
| P9 | Content Revision | Content Creator | Reviewerフィードバック反映 | not drafted |
| P10 | Full Review | Reviewer | 全レッスン通しプレイ + バグ報告 | not drafted |
| P11 | Day 3 Beta Prep | Builder-A/B | バグ修正、UI調整、EAS Build | not drafted |
