# Gitワークフロー

## ブランチ命名規則

```
main                  ← Session 1 の初期セットアップのみ直接
feat/app-shell        ← Session 2
feat/board            ← Session 3
feat/content          ← Session 4
feat/tests            ← Session 5
```

## コミット粒度

**1コミット = 1つの明確な変更**

### Session 1 のコミット例
1. `init: Vite + React + TypeScript プロジェクト初期化`
2. `feat(types): レッスンスキーマ型定義（参照監査結果を反映）`
3. `docs: CLAUDE.md プロジェクト規約・参照ポリシー追加`
4. `feat(app): 最小アプリシェルとルーティング設定`

### Session 2 のコミット例
1. `feat(engine): レッスンエンジン純粋ロジック実装（参照: mobile版LessonEngine分離パターン）`
2. `feat(lesson): レッスン一覧・詳細コンポーネント実装`
3. `feat(quiz): クイズステップコンポーネント実装`
4. `feat(progress): localStorage進捗管理フック実装`
5. `feat(app): ルーティング接続・モックデータ追加`

### Session 3 のコミット例
1. `feat(sfen): SFENパーサー実装（参照: mobile版71行パーサー + commentary-ai座標変換）`
2. `feat(piece): 駒表示名マッピング（参照: commentary-ai版move_to_japanese）`
3. `feat(board): 盤面コンポーネント実装（参照: mobile版ShogiBoard + ハイライト色体系）`
4. `test(sfen): SFENパーサーユニットテスト`

### Session 4 のコミット例
1. `docs(content): レッスン執筆ガイドライン追加`
2. `content: レッスン01「将棋ってなに？」（参照: mobile版rules系レッスン構成）`
3. `content: レッスン02「歩の動き」（参照: mobile版basics_pawn.tsのSFEN・構成）`
4. `content: レッスン03「金将の動き」（参照: mobile版basics_gold.tsのSFEN・構成）`
5. `feat(data): レッスンインデックスモジュール`

### Session 5 のコミット例
1. `test: テスト基盤セットアップ（setup.ts, vitest設定確認）`
2. `feat(validation): レッスンスキーマバリデーション関数（旧リポジトリのバリデーション欠如を解決）`
3. `test(schema): スキーマバリデーションテスト`
4. `test(sfen): SFEN形式バリデーションテスト`
5. `test(content): レッスンデータ品質・初心者レビューテスト`
6. `test: テストユーティリティ・モックファクトリ`

## コミット前の確認事項

1. `npx tsc --noEmit` — 型エラーなし
2. `npm test` — 既存テストがパス（テストがある場合）
3. `npm run build` — ビルド成功（UIがある場合）
