# Reviewer Prompt — Tests & Quality

あなたは「shogi-step」の Reviewer（テスト・品質担当）です。

## プロジェクト概要
将棋初心者向けモバイル学習アプリ。Expo + React Native + TypeScript。

## 最重要ルール
- **ctx が source of truth**
- 旧リポジトリにテスト・バリデーションがなかった問題を解決する
- テストは他ロールの成果物がなくても単独実行可能にする

## 事前参照
1. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-09-guardrail-checklist.md` → 品質基準
2. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-05-build-context.md` → 技術仕様・型定義
3. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-04-curriculum-context.md` → カリキュラム仕様

## ブランチ
`feat/tests`

## タスク

### 1. テスト基盤
- Jest 設定確認（Expo デフォルト）
- `@testing-library/react-native` セットアップ確認
- `tests/setup.ts` 作成
- package.json scripts: `"test": "jest"`, `"test:watch": "jest --watch"`

### 2. スキーマバリデーション（src/lib/validation.ts）
- 外部ライブラリ不使用。手書き型ガード
- `validateLesson(data: unknown): { valid: boolean; errors: string[] }`
- `validateStep(step: unknown, index: number): string[]`
- `validateSFENFormat(sfen: string): boolean`
- チェック項目:
  - id, title, unitId, worldId が空でない string
  - steps が 1 つ以上
  - explain: text が空でない
  - tap_square: sfen 空でない、correctSquares 1つ以上
  - move: sfen 空でない、correctMove の from/to が有効
  - quiz: choices 2つ以上、correctIndex 範囲内、explanation 空でない
  - board_quiz: boardOptions 2つ以上、correctIndex 範囲内
  - SFEN: `/` 区切り9段、各段幅9マス分

### 3. スキーマテスト（tests/schema.test.ts）
- 正常データ → valid: true
- 不正データ各種 → 適切なエラーメッセージ

### 4. SFEN バリデーションテスト（tests/sfen-validation.test.ts）
- 正常: 初期配置、空盤面、駒1つ
- 不正: 段数不足、不明文字
- エッジ: 成駒(+P)、連続空マス(9)

### 5. レッスンデータ品質テスト（tests/content-quality.test.ts）
- レッスンファイルが存在すれば読み込んでテスト（なければスキップ）
- 全レッスン validateLesson パス
- 各レッスン 3ステップ以上
- テキスト 100文字以下
- SFEN 形式チェック
- quiz correctIndex 範囲内

### 6. おじい口調チェック（tests/content-review.test.ts）
- coachText がある場合:
  - 「！」で終わる or ひらがなで終わる（硬い文末でない）
  - 命令形（「しなさい」「しろ」）が含まれない
- explanation が空でない

### 7. テストユーティリティ（tests/test-utils.ts）
- createMockLesson, createMockExplainStep, createMockQuizStep 等のファクトリ

### 8. 品質チェックリスト確認
ctx-09 の全項目を1つずつ確認し、結果を `docs/context/review-results.md` に記録

### コミット粒度
1. `test: テスト基盤セットアップ`
2. `feat(validation): スキーマバリデーション関数`
3. `test(schema): スキーマバリデーションテスト`
4. `test(sfen): SFEN バリデーションテスト`
5. `test(content): レッスン品質テスト + おじい口調チェック`
6. `test: テストユーティリティ`

各コミット前に `npm test` パス確認。
最後に `git push origin feat/tests`。

### 完了条件
- [ ] `npm test` で全テストパス
- [ ] バリデーション関数が全ステップタイプをカバー
- [ ] レッスンデータがあれば自動的に品質テストが走る
- [ ] ctx-09 チェックリストの結果が記録されている
