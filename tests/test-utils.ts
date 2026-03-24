/**
 * Mock factory functions for Shogi Step tests.
 * Create valid test data that can be overridden per-test.
 */

import type {
  Lesson,
  ExplainStep,
  TapSquareStep,
  MoveStep,
  QuizStep,
  BoardQuizStep,
  ReviewStep,
  LessonStep,
} from '../src/types/lesson';

// ─── SFEN Constants ───────────────────────────────────

/** Standard shogi initial position */
export const SFEN_INITIAL =
  'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL';

/** Empty board */
export const SFEN_EMPTY = '9/9/9/9/9/9/9/9/9';

/** Board with a single pawn on 5-5 (row 4, col 4) */
export const SFEN_SINGLE_PAWN = '9/9/9/9/4P4/9/9/9/9';

// ─── Step Factories ───────────────────────────────────

export function createMockExplainStep(
  overrides?: Partial<ExplainStep>
): ExplainStep {
  return {
    type: 'explain',
    text: 'これは将棋の盤面じゃよ。',
    ...overrides,
  };
}

export function createMockTapSquareStep(
  overrides?: Partial<TapSquareStep>
): TapSquareStep {
  return {
    type: 'tap_square',
    instruction: '歩のあるマスをタップしてみよう',
    sfen: SFEN_SINGLE_PAWN,
    correctSquares: [{ row: 4, col: 4 }],
    successText: 'よくできたのう！',
    failText: 'もう一度やってみるのじゃ',
    ...overrides,
  };
}

export function createMockMoveStep(
  overrides?: Partial<MoveStep>
): MoveStep {
  return {
    type: 'move',
    instruction: '歩を一つ前に進めてみよう',
    sfen: SFEN_SINGLE_PAWN,
    correctMove: {
      from: { row: 4, col: 4 },
      to: { row: 3, col: 4 },
    },
    successText: 'その通りじゃ！',
    failText: 'おっと、もう一度じゃ',
    ...overrides,
  };
}

export function createMockQuizStep(
  overrides?: Partial<QuizStep>
): QuizStep {
  return {
    type: 'quiz',
    question: '将棋の駒は全部で何種類あるかな？',
    choices: ['6種類', '8種類', '10種類'],
    correctIndex: 1,
    explanation: '将棋の駒は8種類あるんじゃよ。',
    ...overrides,
  };
}

export function createMockBoardQuizStep(
  overrides?: Partial<BoardQuizStep>
): BoardQuizStep {
  return {
    type: 'board_quiz',
    question: '正しい初期配置はどちらかな？',
    boardOptions: [
      { sfen: SFEN_INITIAL, label: 'A' },
      { sfen: SFEN_EMPTY, label: 'B' },
    ],
    correctIndex: 0,
    explanation: 'これが正しい初期配置じゃよ。',
    ...overrides,
  };
}

export function createMockReviewStep(
  overrides?: Partial<ReviewStep>
): ReviewStep {
  return {
    type: 'review',
    source: 'mistakes_in_lesson',
    count: 3,
    ...overrides,
  };
}

// ─── Lesson Factory ───────────────────────────────────

export function createMockLesson(
  overrides?: Partial<Lesson> & { steps?: LessonStep[] }
): Lesson {
  return {
    id: 'w1-u1-l1',
    title: '将棋の盤面を見てみよう',
    unitId: 'u1',
    worldId: 'w1',
    order: 1,
    steps: [
      createMockExplainStep(),
      createMockTapSquareStep(),
      createMockQuizStep(),
    ],
    ...overrides,
  };
}
