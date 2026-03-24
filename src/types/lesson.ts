/**
 * Core type definitions for the shogi-step lesson system.
 *
 * ctx-05 Section 7 is the source of truth for these types.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** A position on the 9x9 board (0-indexed). */
export interface Position {
  row: number;
  col: number;
}

// ---------------------------------------------------------------------------
// Step types
// ---------------------------------------------------------------------------

export type StepType =
  | 'explain'
  | 'tap_square'
  | 'move'
  | 'quiz'
  | 'board_quiz'
  | 'review';

export interface ExplainStep {
  type: 'explain';
  text: string;
  coachText?: string;
  sfen?: string;
  highlights?: Position[];
}

export interface TapSquareStep {
  type: 'tap_square';
  instruction: string;
  coachText?: string;
  sfen: string;
  correctSquares: Position[];
  highlights?: Position[];
  successText: string;
  failText: string;
}

export interface MoveStep {
  type: 'move';
  instruction: string;
  coachText?: string;
  sfen: string;
  correctMove: { from: Position; to: Position };
  highlights?: Position[];
  successText: string;
  failText: string;
}

export interface QuizStep {
  type: 'quiz';
  question: string;
  coachText?: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface BoardQuizStep {
  type: 'board_quiz';
  question: string;
  coachText?: string;
  boardOptions: { sfen: string; label?: string }[];
  correctIndex: number;
  explanation: string;
}

export interface ReviewStep {
  type: 'review';
  source: 'mistakes_in_lesson' | 'mistakes_in_unit';
  count: number;
}

export type LessonStep =
  | ExplainStep
  | TapSquareStep
  | MoveStep
  | QuizStep
  | BoardQuizStep
  | ReviewStep;

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

export interface Lesson {
  id: string;
  title: string;
  unitId: string;
  worldId: string;
  order: number;
  steps: LessonStep[];
}

export interface Unit {
  id: string;
  title: string;
  worldId: string;
  order: number;
  lessonIds: string[];
}

export interface World {
  id: string;
  title: string;
  order: number;
  unitIds: string[];
}

// ---------------------------------------------------------------------------
// Engine state (used by LessonEngine)
// ---------------------------------------------------------------------------

export interface LessonState {
  lesson: Lesson;
  currentStepIndex: number;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  mistakes: { stepIndex: number; step: LessonStep }[];
  completed: boolean;
  selectedSquare: Position | null;
}

// ---------------------------------------------------------------------------
// Board types (used by ShogiBoard / SFEN parser)
// ---------------------------------------------------------------------------

export type PieceType = 'fu' | 'ky' | 'ke' | 'gi' | 'ki' | 'ka' | 'hi' | 'ou';
export type Side = 'sente' | 'gote';

export interface CellPiece {
  piece: PieceType;
  side: Side;
  promoted: boolean;
}

/** A cell is either a piece or null (empty). */
export type CellContent = CellPiece | null;

// ---------------------------------------------------------------------------
// Board component types
// ---------------------------------------------------------------------------

export type HighlightColor = 'movable' | 'correct' | 'wrong' | 'selected';

export interface HighlightedSquare {
  position: Position;
  color: HighlightColor;
}

// ---------------------------------------------------------------------------
// Progress persistence
// ---------------------------------------------------------------------------

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  currentStepIndex: number;
  mistakeCount: number;
  completedAt?: string;
}

export interface AppProgress {
  lessons: Record<string, LessonProgress>;
  lastPlayedLessonId?: string;
  totalCompletedCount: number;
}
