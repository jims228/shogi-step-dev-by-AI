/**
 * LessonEngine — pure-function lesson state machine.
 *
 * React-independent (D7). Every function takes state + input and returns a
 * new state value with no side-effects.
 */

import type {
  Lesson,
  LessonState,
  LessonStep,
  Position,
} from '../types/lesson';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function posEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Create the initial state for a lesson. */
export function createInitialState(lesson: Lesson): LessonState {
  return {
    lesson,
    currentStepIndex: 0,
    stepResult: null,
    mistakes: [],
    completed: false,
    selectedSquare: null,
  };
}

/** Return the current step, or undefined if the index is out of range. */
export function getCurrentStep(state: LessonState): LessonStep | undefined {
  return state.lesson.steps[state.currentStepIndex];
}

/**
 * Whether the user can advance to the next step.
 *
 * - explain: always true (no judgement).
 * - tap_square / move / quiz / board_quiz: only after a correct answer.
 * - review: always true (handled externally or auto-skipped).
 */
export function canAdvance(state: LessonState): boolean {
  if (state.completed) return false;

  const step = getCurrentStep(state);
  if (!step) return false;

  switch (step.type) {
    case 'explain':
    case 'review':
      return true;
    case 'tap_square':
    case 'move':
    case 'quiz':
    case 'board_quiz':
      return state.stepResult === 'correct';
    default:
      return false;
  }
}

/** Advance to the next step. Marks completed when past the last step. */
export function advanceStep(state: LessonState): LessonState {
  const nextIndex = state.currentStepIndex + 1;

  if (nextIndex >= state.lesson.steps.length) {
    return {
      ...state,
      completed: true,
      stepResult: null,
      selectedSquare: null,
    };
  }

  return {
    ...state,
    currentStepIndex: nextIndex,
    stepResult: null,
    selectedSquare: null,
  };
}

// ---------------------------------------------------------------------------
// Interaction handlers
// ---------------------------------------------------------------------------

/**
 * Handle a tap on a board square (for tap_square steps).
 * Returns the new state with stepResult set.
 */
export function handleTapSquare(
  state: LessonState,
  tapped: Position,
): LessonState {
  const step = getCurrentStep(state);
  if (!step || step.type !== 'tap_square') return state;

  const isCorrect = step.correctSquares.some((sq) => posEqual(sq, tapped));

  if (isCorrect) {
    return { ...state, stepResult: 'correct', selectedSquare: null };
  }

  return {
    ...state,
    stepResult: 'incorrect',
    selectedSquare: null,
    mistakes: [
      ...state.mistakes,
      { stepIndex: state.currentStepIndex, step },
    ],
  };
}

/**
 * Handle a two-tap move (for move steps).
 *
 * Call with {from, to}. The engine checks against correctMove.
 */
export function handleMove(
  state: LessonState,
  from: Position,
  to: Position,
): LessonState {
  const step = getCurrentStep(state);
  if (!step || step.type !== 'move') return state;

  const isCorrect =
    posEqual(from, step.correctMove.from) &&
    posEqual(to, step.correctMove.to);

  if (isCorrect) {
    return { ...state, stepResult: 'correct', selectedSquare: null };
  }

  return {
    ...state,
    stepResult: 'incorrect',
    selectedSquare: null,
    mistakes: [
      ...state.mistakes,
      { stepIndex: state.currentStepIndex, step },
    ],
  };
}

/**
 * Handle a quiz answer (for quiz and board_quiz steps).
 */
export function handleQuizAnswer(
  state: LessonState,
  answerIndex: number,
): LessonState {
  const step = getCurrentStep(state);
  if (!step) return state;

  if (step.type !== 'quiz' && step.type !== 'board_quiz') return state;

  const isCorrect = answerIndex === step.correctIndex;

  if (isCorrect) {
    return { ...state, stepResult: 'correct', selectedSquare: null };
  }

  return {
    ...state,
    stepResult: 'incorrect',
    selectedSquare: null,
    mistakes: [
      ...state.mistakes,
      { stepIndex: state.currentStepIndex, step },
    ],
  };
}

/**
 * Select a square (first tap of a two-tap move).
 */
export function selectSquare(
  state: LessonState,
  position: Position,
): LessonState {
  return { ...state, selectedSquare: position, stepResult: null };
}

/**
 * Reset the step result to pending (for retry after incorrect).
 */
export function resetStepResult(state: LessonState): LessonState {
  return { ...state, stepResult: null, selectedSquare: null };
}
