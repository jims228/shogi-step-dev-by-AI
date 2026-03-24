# Builder-A Prompt — App Foundation

あなたは「shogi-step」の Builder-A（アプリ基盤担当）です。

## プロジェクト概要
将棋初心者向けモバイル学習アプリ。Expo + React Native + TypeScript。
reference-driven clean-room rebuild: 旧リポジトリを調査してパターンを抽出するが、コードはコピペしない。

## 最重要ルール
- **ctx が source of truth**: docs/context/ 内のファイルが正式仕様
- 旧コードのコピペ禁止。パターン参照のみ
- Vite / Tailwind / localStorage は使わない（D1で破棄済み）
- portrait orientation のみ

## 事前参照（実装前に読むこと）
1. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-05-build-context.md` → 技術仕様・ディレクトリ構造
2. `/home/jimjace/shogi-step-dev-by-AI/docs/context/ctx-00-master-context.md` → プロジェクト方針
3. `/home/jimjace/shogi-step-mobile/src/ui/theme.ts` → デザイントークン参考
4. `/home/jimjace/shogi-step-mobile/src/screens/RoadmapHomeScreen.tsx` → ロードマップUI参考
5. `/home/jimjace/shogi-step-mobile/src/state/progress.tsx` → 進捗管理パターン参考
6. `/home/jimjace/shogi-step-mobile/app.config.ts` → Expo設定参考

## ブランチ
`feat/app-shell`

## タスク

### 1. Expo プロジェクト初期化
- `npx create-expo-app@latest . --template blank-typescript` （現ディレクトリに）
- Expo Router セットアップ
- 依存追加: `@react-native-async-storage/async-storage`, `react-native-safe-area-context`, `react-native-screens`, `expo-router`
- Jest + `@testing-library/react-native` セットアップ
- TypeScript strict mode 有効化
- `.gitignore` に node_modules, .expo, dist, *.local を含める

### 2. ディレクトリ構造作成
ctx-05 に記載の構造に従う。空ディレクトリには `.gitkeep`。

### 3. テーマトークン（src/theme/index.ts）
旧 theme.ts を参考に新規作成:
```typescript
export const colors = {
  primary: '#5B8DEF',        // 落ち着いた青（仮。後で変更可能）
  primaryDark: '#3A6FD8',
  background: '#FFFFFF',
  backgroundTint: '#F5F7FA',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  boardBg: '#DEB887',
  border: '#E5E7EB',
};
export const spacing = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 };
export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };
export const typography = {
  h1: { fontSize: 22, fontWeight: '900' as const },
  h2: { fontSize: 16, fontWeight: '800' as const },
  body: { fontSize: 14, fontWeight: '600' as const },
  sub: { fontSize: 12, fontWeight: '700' as const },
};
```

### 4. ルートレイアウト（app/_layout.tsx）
- SafeAreaProvider でラップ
- ProgressProvider でラップ（src/state/ProgressContext.tsx）
- Stack navigator 設定

### 5. ロードマップ画面（app/index.tsx）
- World 1 の Unit 一覧をカードで表示
- 各 UnitCard: タイトル、レッスン数、進捗バッジ（完了数/全数）
- カードタップ → 最初の未完了レッスンに遷移 `router.push('/lesson/[id]')`
- ScrollView でスクロール
- ヘッダー: 「将棋ステップ」タイトル
- Unit データは src/data/roadmap.ts から読み込み（Builder-B が型定義、仮データは自分で作る）

### 6. レッスン画面枠組み（app/lesson/[id].tsx）
- ctx-05 Section 4 のレイアウトに従う
- ヘッダー: [X] 閉じるボタン + ProgressBar + ステップ番号
- コンテンツエリア: プレースホルダー（「ステップ内容がここに表示されます」）
- フッター: 「次へ →」ボタン
- Builder-B の StepRenderer と後で接続

### 7. 進捗管理（src/state/ProgressContext.tsx + src/hooks/useProgress.ts）
- AsyncStorage で保存。Key: `@shogi-step/progress`
- ctx-05 Section 8 のデータ構造に従う
- Context Provider パターン
- getProgress / saveProgress / markComplete / getAllProgress

### 8. CLAUDE.md 作成
プロジェクトルートに作成:
- プロジェクト概要
- 技術スタック
- 開発コマンド（dev, build, test, lint）
- ディレクトリ構造の説明
- ブランチ戦略
- 「docs/context/ が source of truth」の明記

### コミット粒度
1. `init: Expo + TypeScript プロジェクト初期化`
2. `feat(theme): デザイントークン設定`
3. `feat(layout): ルートレイアウトと ProgressProvider`
4. `feat(roadmap): ロードマップ画面`
5. `feat(lesson): レッスン画面枠組み`
6. `feat(progress): AsyncStorage 進捗管理`
7. `docs: CLAUDE.md 追加`

各コミット前に `npx tsc --noEmit` で型チェック。
最後に `git push origin feat/app-shell`。

### 完了条件
- [ ] Expo Go で起動してロードマップ画面が表示される
- [ ] Unit カードをタップしてレッスン画面に遷移する
- [ ] 閉じるボタンでロードマップに戻る
- [ ] 型エラーなし
