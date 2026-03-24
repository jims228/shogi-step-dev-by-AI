# Shogi Step — Session Status Board v1.1
> Last updated: 2026-03-24 (旧リポジトリ調査完了後)

---

## Role Status

| Role | Current Task | Last Output | Blocked By | Next Action | Confidence |
|------|-------------|-------------|------------|-------------|-----------|
| **Orchestrator** | Master Plan v2 作成完了。ロール配分済み | docs/20-master-plan-v2.md | **Q1-Q7 の決定** | Open Questions を決定し、P1+P2 を同時送信 | HIGH |
| **Researcher** | 未着手 | — | Prompt P1 未送信 | P1 プロンプトを受け取り、旧リポジトリ調査開始 | — |
| **Builder-A** | 未着手 | — | Prompt P2 未送信 | P2 プロンプトを受け取り、Expo初期化 | — |
| **Builder-B** | 未着手 | — | Prompt P3 未送信 | P3 プロンプトを受け取り、型定義作成 | — |
| **Content Creator** | 未着手 | — | P3 の型定義確定 + Prompt P4 | 型定義ドラフトを読んでレッスンデータ下書き開始可 | — |
| **Reviewer** | 未着手 | — | Prompt P5 未送信 | P5 プロンプトを受け取り、テスト基盤構築 | — |
| **Context Manager** | **ctx-00〜09 全完了** | ctx-00〜09 + 調査結果反映済み | なし | Orchestrator の決定を待ち、ドキュメント更新 | HIGH |

---

## Pipeline Status

```
[DONE] M0-1: Master Plan v2 作成
[DONE] M0-2: Context Manager ドキュメント作成 (ctx-00〜09)
[DONE] M0-3: 旧リポジトリ調査（shogi-step-mobile + shogi-commentary-ai）
[DONE] M0-4: 調査結果の ctx-03 Reference Mapping 反映
[NEXT] M0-5: Orchestrator が Q1-Q7 を決定
[NEXT] M0-6: P1(Researcher) + P2(Builder-A) 同時送信
[TODO] M1-1: Expo初期化 (Builder-A)
[TODO] M1-2: 型定義 + LessonEngine (Builder-B)
[TODO] M1-3: 旧リポジトリ調査メモ (Researcher)
[TODO] M1-4: レッスンデータ下書き (Content Creator)
[TODO] M1-5: テスト基盤 (Reviewer)
```

---

## Blockers & Risks

| # | Blocker | Impact | Mitigation | Owner | Status |
|---|---------|--------|-----------|-------|--------|
| B1 | ~~旧リポジトリ調査未完了~~ | ~~Reference Mapping が不完全~~ | 調査完了、ctx-03 更新済み | Context Manager | **RESOLVED** |
| B2 | Open Questions Q1-Q7 が未解決 | Builder/Content Creator の着手に影響 | Orchestrator が Day 1 開始前に決定 | Orchestrator | **ACTIVE** |
| B3 | 型定義の最終確定が Builder-B 依存 | Content Creator が型に沿ったデータを書けない | docs/20 のドラフト型定義で先行着手可能 | Builder-B | ACTIVE |

---

## 旧リポジトリ調査で判明した重要事項（新規）

| # | 発見 | 影響 | 対応 |
|---|------|------|------|
| F1 | 旧appには44本のネイティブレッスンが存在（basics 1 + tesuji 27 + castle 7 + opening 8） | 新W1の18本は妥当な粒度 | 情報として記録。Q6の判断材料 |
| F2 | 旧appには5ライフ制があった（game-over alert付き） | Q5の推奨「v1なし」を強化 | ctx-02 に反映済み |
| F3 | 旧appのコーチは「おじいちゃん」キャラ（Rive/絵文字） | Q1の参考。新プロジェクトは別キャラ必須 | ctx-02 に反映済み |
| F4 | 旧appのWebView二重レンダリングが問題だった | 新計画のネイティブ一本方針は正しい | 確認済み |
| F5 | Commentary AIに3スタイル定義（technical/encouraging/neutral）あり | Content Creator のガイドラインに活用可能 | ctx-03 に反映済み |
| F6 | 旧appの自動進行タイマー: 正解600ms/不正解700ms | Builder-B の実装参考値 | ctx-03, ctx-05 に反映 |
| F7 | 旧appの盤面はスプライトシート（1040x520, 8x4, PIECE_SCALE=1.3） | v1は漢字テキスト。v2で新画像作成 | Q2の判断材料 |

---

## Communication Log

| Date | From | To | Content | Action Required |
|------|------|----|---------|----------------|
| 2026-03-24 | Orchestrator | All | Master Plan v2 (docs/20) 作成 | 全ロール読むこと |
| 2026-03-24 | Context Manager | All | ctx-00〜09 全完了 + 調査結果反映 | 参照可能 |
| 2026-03-24 | Context Manager | Orchestrator | **Q1-Q7 の決定を要請** | 即決定してください |
