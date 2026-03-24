# 並列実行計画（5セッション）

## Session 1 — Architect / Schema + Reference Audit（アーキテクト + 参照監査）

| 項目 | 内容 |
|------|------|
| **Phase 1** | 旧リポジトリの型定義・スキーマ・ディレクトリ構造を調査し、採用/不採用を判断 |
| **Phase 2** | Vite + React + TS、Tailwind CSS v4、Vitest でプロジェクト初期化 |
| **Phase 3** | 旧スキーマの知見を踏まえた lesson.ts 型定義 |
| **Phase 4** | 参照ポリシーを含む CLAUDE.md 作成 |
| **成果物** | `package.json`, `tsconfig.json`, `vite.config.ts`, `src/types/lesson.ts`, `CLAUDE.md`, `.gitignore` |
| **ブランチ** | `main` |
| **依存** | なし（最初に実行必須） |

## Session 2 — Frontend App（フロントエンド）

| 項目 | 内容 |
|------|------|
| **参照調査** | mobile版の画面レイアウト、ナビゲーション、LessonEngine分離パターン |
| **実装** | レッスンエンジン（純粋ロジック）、レッスン一覧、レッスン詳細、ステップレンダラー、クイズ、進捗、モックデータ |
| **成果物** | `lessonEngine.ts`, `useLessonEngine.ts`, `LessonList.tsx`, `LessonDetail.tsx`, `StepRenderer.tsx`, `QuizStep.tsx`, `useProgress.ts`, モックデータ |
| **ブランチ** | `feat/app-shell` |
| **依存** | Session 1 完了後。Session 3, 4 と並列可 |
| **モックデータ** | 自前のモックデータで進行。Session 4 を待たない |

## Session 3 — Board / Interaction（盤面）

| 項目 | 内容 |
|------|------|
| **参照調査** | 両リポジトリのSFEN実装、ハイライト色体系、座標系設計 |
| **実装** | SFENパーサー、駒表示マッピング、盤面コンポーネント |
| **成果物** | `sfen.ts`, `piece.ts`, `ShogiBoard.tsx`, `tests/sfen.test.ts` |
| **ブランチ** | `feat/board` |
| **依存** | Session 1 完了後。Session 2, 4 と並列可 |

## Session 4 — Content / Curriculum（コンテンツ）

| 項目 | 内容 |
|------|------|
| **参照調査** | mobile版レッスンの構成・文言・SFEN使用例、commentary-aiの encouraging スタイル |
| **実装** | 3レッスンJSON、執筆ガイドライン、レッスンインデックス |
| **成果物** | `01-intro.json`, `02-pawn.json`, `03-gold.json`, `AUTHORING_GUIDE.md`, `index.ts` |
| **ブランチ** | `feat/content` |
| **依存** | Session 1 完了後。Session 2, 3 と並列可 |

## Session 5 — Reviewer / Tests（レビュー・テスト）

| 項目 | 内容 |
|------|------|
| **参照調査** | 旧リポジトリのバリデーション欠如箇所、エッジケース |
| **実装** | バリデーション関数、スキーマテスト、SFEN形式テスト、品質テスト、テストユーティリティ |
| **成果物** | `validation.ts`, `schema.test.ts`, `sfen-validation.test.ts`, `content-quality.test.ts`, `content-review.test.ts`, `test-utils.tsx` |
| **ブランチ** | `feat/tests` |
| **依存** | Session 1 完了後。Session 2〜4 と並列可 |

## 依存関係図

```
Session 1 (Architect + Reference Audit)
    ├──→ Session 2 (Frontend)  ──┐
    ├──→ Session 3 (Board)     ──┼──→ 統合・マージ
    ├──→ Session 4 (Content)   ──┤
    └──→ Session 5 (Tests)     ──┘
```

## 起動順序

| 順序 | アクション |
|------|-----------|
| **1** | Session 1 を起動（参照監査 + プロジェクト初期化） |
| **2** | Session 1 完了確認（`main` にプッシュ済み、`npm install && npx tsc --noEmit` 成功） |
| **3** | Session 2, 3, 4, 5 を**同時起動** |
| **4** | 各セッション完了後、PRまたはマージ |
| **5** | マージ順: tests → board → content → app-shell |
| **6** | 全マージ後 `npm run build && npm test` で最終確認 |

## 進行チェックポイント

- [ ] Session 1完了: `npm install` が通り、`src/types/lesson.ts` が存在する
- [ ] Session 2完了: `npm run dev` でアプリが起動し、レッスン一覧が表示される
- [ ] Session 3完了: SFENパーサーのテストが全パスする
- [ ] Session 4完了: 3レッスンのJSONがスキーマに準拠している
- [ ] Session 5完了: `npm test` で全テストがパスする
