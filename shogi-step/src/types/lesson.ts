/**
 * Core type definitions for Shogi Step lessons.
 * These types are shared across Builder-B, Content Creator, and Reviewer.
 */

export interface Position {
  row: number;
  col: number;
}

export type StepType = 'explain' | 'tap_square' | 'move' | 'quiz' | 'board_quiz' | 'review';

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
