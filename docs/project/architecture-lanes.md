# Project Scope

## このリポジトリは何か

将棋初心者向けモバイル学習アプリ（Expo + React Native）。

| 項目 | 内容 |
|------|------|
| 目的 | 初心者が1日5分で将棋の基本を学べるアプリ |
| スタック | Expo + React Native + TypeScript + Expo Router + AsyncStorage |
| 進行方式 | World > Unit > Lesson のロードマップ |
| MVP | World 1（6 Unit, 18 Lesson） |
| コーチ | おじい（テキスト吹き出し） |
| 駒表示 | スプライト画像 + 漢字フォールバック |
| 状態 | **実装中。Metro 起動確認済み。実機確認待ち** |

## スコープに含まれるもの

- レッスンフロー（LessonEngine + StepRenderer）
- 盤面UI（ShogiBoard + Piece スプライト）
- ロードマップUI
- 進捗管理（AsyncStorage）
- レッスンデータ（静的コンテンツ）
- テスト基盤

## スコープに含まれないもの

- AI 解説生成（別プロジェクト）
- 対局機能
- サーバーサイド
- ユーザー認証
- 課金

## 外部リポジトリからの参照ルール

| 参照元 | 参照してよいもの |
|--------|---------------|
| shogi-step-mobile | 駒スプライト画像、駒オフセット値、UIレイアウト、LessonEngineパターン |
| Shogi_AI_Learning | 盤面コンポーネント設計、SFEN解析パターン |
| shogi-commentary-ai | encouraging スタイルの語調のみ |

**コード直接コピペ禁止。AI/エンジン/サーバー関連コードは持ち込まない。**
