# Architecture Lanes

## Lane 1: App（本線）

将棋初心者向けモバイル学習アプリ。

| 項目 | 内容 |
|------|------|
| 目的 | 初心者が1日5分で将棋の基本を学べるアプリ |
| スタック | Expo + React Native + TypeScript + Expo Router + AsyncStorage |
| 進行方式 | World > Unit > Lesson のロードマップ |
| MVP | World 1（6 Unit, 18 Lesson） |
| コーチ | おじい（テキスト吹き出し） |
| 駒表示 | スプライト画像 + 漢字フォールバック |
| 状態 | **実装中。Metro 起動確認済み。実機確認待ち** |

### 含まれるもの
- ロードマップ画面
- レッスン画面（StepRenderer + LessonEngine）
- 盤面コンポーネント（ShogiBoard + Piece スプライト）
- 6 ステップタイプ（explain, tap_square, move, quiz, board_quiz, review）
- 進捗管理（AsyncStorage）
- World 1 レッスンデータ（18本）
- テスト基盤（Jest + jest-expo）

### 含まれないもの
- AI 解説生成
- 対局機能
- サーバーサイド
- ユーザー認証
- 課金

---

## Lane 2: Explanation Engine（将来構想）

将棋解説AI。棋譜や局面から初心者向け解説を自動生成する。

| 項目 | 内容 |
|------|------|
| 目的 | レッスンコンテンツの自動生成・復習問題の個別最適化 |
| 参照元 | `/home/jimjace/shogi-commentary-ai`（5段階パイプライン） |
| 構成要素 | Engine → Retrieval → Planner → Generator → Verifier |
| 状態 | **構想のみ。v1 では未着手** |

### 将来的に App Lane に接続する候補
- 苦手パターン分析 → 復習問題の自動選定
- レッスンテキストの AI 生成補助
- 棋譜解説の初心者向け要約

### v1 では触らない理由
- App Lane の World 1 完成が最優先
- AI 解説は教育コアが安定してから導入すべき
- 静的コンテンツで十分なフェーズ

---

## Lane 間の関係

```
App Lane (本線)          Explanation Engine Lane (将来)
  │                           │
  │  World 1-8 を             │  AI 解説パイプラインを
  │  手動コンテンツで構築      │  構築
  │                           │
  └──── v3+ で接続 ───────────┘
         │
    苦手分析・問題生成・解説自動化
```

**原則: App Lane が安定するまで Explanation Engine Lane には着手しない。**
