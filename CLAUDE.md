# CLAUDE.md - Shogi Step

## Project Overview
Shogi Step is a mobile learning app for shogi (Japanese chess) beginners.
Built with Expo + React Native + TypeScript using a clean-room rebuild approach.

## Tech Stack
- **Runtime**: Expo + React Native (create-expo-app, SDK 52)
- **Language**: TypeScript (strict mode)
- **Routing**: Expo Router (file-based)
- **Storage**: @react-native-async-storage/async-storage
- **Styling**: React Native StyleSheet + theme tokens (no Tailwind)
- **Testing**: Jest + @testing-library/react-native

**NOT used**: Vite, Tailwind, localStorage, React Router, Vitest, Redux, Zustand, Supabase, Firebase

## Development Commands
- `npm start` - Start Expo dev server
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run typecheck` - TypeScript type check (tsc --noEmit)
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

## Directory Structure
```
app/                  # Expo Router pages (file-based routing)
  _layout.tsx         # Root layout (SafeAreaProvider, ProgressProvider)
  index.tsx           # Roadmap screen (home)
  lesson/[id].tsx     # Lesson screen (dynamic route)
  settings.tsx        # Settings (future)
src/
  components/         # Reusable UI components
    board/            # Shogi board components
    lesson/           # Lesson step components
    roadmap/          # Roadmap UI components
    common/           # Shared components
  engine/             # Lesson engine (pure logic, no React)
  types/              # TypeScript type definitions
  data/               # Lesson data and roadmap metadata
  hooks/              # Custom React hooks
  lib/                # Utility libraries (SFEN parser, etc.)
  theme/              # Design tokens
  state/              # Context providers
tests/                # Test files
assets/               # App icons, splash screens
```

## Branch Strategy
- `main` - Stable, production-ready
- `feat/app-shell` - App foundation (Builder-A)
- `feat/lesson-engine` - Lesson engine + components (Builder-B)

## Source of Truth
`docs/context/` contains all official specifications.
Always refer to ctx files for design decisions and implementation details.

## Key Constraints
- Portrait orientation only
- Light mode only (v1)
- Phone-first (no tablet optimization in v1)
- No cloud sync (AsyncStorage only in v1)
