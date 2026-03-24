# Shogi Step — Master Context v1
> Last updated: 2026-03-24

---

## 1. One-Sentence Vision

将棋初心者が「わかった！」「できた！」を繰り返しながら、1日5分ずつ将棋の基本を身につけられるモバイルアプリ。

---

## 2. Target User

| 属性 | 値 |
|------|-----|
| 将棋経験 | 完全初心者（ルールを知らない） |
| 年齢層 | 10代〜40代（小3が読めるテキスト水準） |
| デバイス | スマートフォン（iOS / Android） |
| 利用時間 | 通勤・休憩・寝る前の5分 |
| モチベーション | 将棋に興味はあるが「難しそう」で手が出ない |

---

## 3. Core Experience

```
盤面を触って → 即座にフィードバック → 「できた！」 → 次の一歩
```

- **やって覚える**: 説明を読むだけではなく、タップ・移動・クイズで体験する
- **bite-sized**: 1レッスン2〜5分、5〜8ステップ、1概念
- **character-guided**: コーチキャラが横で励ましながら教える
- **roadmap-driven**: World > Unit > Lesson の構造で「今どこにいるか」が常に分かる

---

## 4. Product Pillars

| # | Pillar | 意味 |
|---|--------|------|
| P1 | Interaction-First | 読むより触る。盤面操作が主体 |
| P2 | Bite-Sized | 1レッスン=1概念、2〜5分で完結 |
| P3 | Encouraging | 間違えても励まされる。恐怖心の除去 |
| P4 | Mobile-Native | 片手操作、タップ中心、オフライン動作 |
| P5 | Roadmap Clarity | 学習全体の地図が見え、達成感が積み重なる |

---

## 5. Legal Guardrails

| カテゴリ | OK | NG |
|----------|----|----|
| Duolingo Chess | 学習設計パターン、問題タイプ、進行構造の概念的参考 | 名称、ロゴ、色、キャラ、文章、画像、UI直写し |
| 公開将棋サイト | 教え方の順序、概念分類の参考 | 問題図、盤面配置、説明文の転載 |
| 旧リポジトリ | アーキテクチャ、設計パターン、データ構造の参考 | コードのコピペ |
| 最終成果物 | すべてオリジナル | 上記いずれかの直接流用 |

---

## 6. Stack Decision

| 要素 | 選択 | 理由 |
|------|------|------|
| フレームワーク | Expo + React Native | 旧app参照互換、3日beta、EAS Build |
| 言語 | TypeScript (strict) | 型安全 |
| ルーティング | Expo Router | ファイルベース、ディープリンク |
| ストレージ | AsyncStorage | ローカル優先、将来クラウド同期 |
| スタイリング | StyleSheet + テーマトークン | RN標準、外部依存なし |
| テスト | Jest + React Native Testing Library | Expo標準 |
| データ | 静的JSON/TS（型付き） | DB不要、スキーマ検証可能 |
| ビルド | EAS Build | クラウドビルド、ストア配信 |

**旧計画（破棄）**: Vite + React + Tailwind + localStorage → すべて obsolete

---

## 7. Content Policy

- テキスト: です・ます調、親しみやすく前向き、1ステップ100文字以下
- 専門用語: 初出時にひらがな読み＋簡単な説明
- コーチ台詞: フレンドリーで少しおちゃめ、先生というより年上の友達
- クイズ: 選択肢3つ、明らかな不正解1つ含む、正解後に解説
- SFEN盤面: 駒1〜5個の最小配置、正しい将棋盤面であること
- 問題: すべてオリジナル作成、公開サイトからの転載禁止

---

## 8. Roadmap Policy

| World | テーマ | Lesson数 | ステータス |
|-------|--------|---------|-----------|
| W1 | 将棋の世界へようこそ（歩・金・銀・飛・角） | 18 | **MVP scope** |
| W2 | 駒の動きをマスターしよう（香・桂・王） | 18 | planned |
| W3 | 取る・成る・打つ | 15 | planned |
| W4 | 王手と詰みを理解しよう | 15 | planned |
| W5 | はじめての1手詰 | 18 | planned |
| W6 | もっと1手詰 & 3手詰の入口 | 15 | planned |
| W7 | 手筋を覚えよう | 18 | planned |
| W8 | 囲いと戦法の入口 | 15 | planned |

**MVP = World 1 のみ。3〜5日で beta 配布。**

---

## 9. Role Map

| Role | 責務 | 並列数 |
|------|------|--------|
| Orchestrator | プロダクト定義維持、全ロール指示、意思決定、マージ判断 | 1 |
| Researcher | 参考資料調査、レッスン順序検証、著作権チェック | 1 |
| Builder-A | アプリ基盤（Expo初期化、ナビゲーション、ロードマップUI、進捗管理） | 1 |
| Builder-B | レッスンエンジン、盤面コンポーネント、StepRenderer、インタラクション | 1 |
| Content Creator | World 1 全18レッスンのデータ作成 | 1 |
| Reviewer | 教育品質・技術品質・著作権チェック、テスト作成 | 1 |
| Context Manager | 方針・決定・未解決事項・参照元の整理と最新化 | 1 |

---

## 10. Current Milestone

**M0: 計画確定 & コンテキスト整備**
- Status: IN PROGRESS
- 完了条件:
  - [ ] Master Context v1 完成
  - [ ] Decision Log v1 完成
  - [ ] Open Questions Register v1 完成
  - [ ] Reference Mapping v1 完成
  - [ ] Curriculum Context v1 完成
  - [ ] Build Context v1 完成
  - [ ] 各ロール向けプロンプト整備
  - [ ] 旧リポジトリ調査完了

---

## 11. Next Milestone

**M1: Foundation（Day 1）**
- Builder-A: Expo初期化、ナビゲーション、テーマ、ロードマップ画面
- Builder-B: 型定義、LessonEngine、SFENパーサー、盤面コンポーネント
- Content Creator: Unit 1-1〜1-4 レッスンデータ
- Reviewer: テスト基盤、スキーマバリデーション

---

## 12. Non-Goals (v1)

対局機能 / AI対戦 / オンライン対戦 / AIランタイム生成 / ユーザーアカウント・認証 / 課金・サブスク / 動画コンテンツ / SNS連携 / ランキング / 多言語対応
