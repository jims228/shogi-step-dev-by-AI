/**
 * Tests for LessonEngine pure functions.
 */

import type { Lesson, LessonStep, Position } from '../src/types/lesson';
import {
  advanceStep,
  canAdvance,
  createInitialState,
  getCurrentStep,
  handleMove,
  handleQuizAnswer,
  handleTapSquare,
  resetStepResult,
  selectSquare,
} from '../src/engine/LessonEngine';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const explainStep: LessonStep = {
  type: 'explain',
  text: 'This is an explanation.',
  coachText: 'Let me explain.',
};

const tapStep: LessonStep = {
  type: 'tap_square',
  instruction: 'Tap the correct square.',
  sfen: '9/9/9/9/4P4/9/9/9/9',
  correctSquares: [{ row: 4, col: 4 }],
  successText: 'Correct!',
  failText: 'Try again.',
};

const moveStep: LessonStep = {
  type: 'move',
  instruction: 'Move the piece.',
  sfen: '9/9/9/9/4P4/9/9/9/9',
  correctMove: { from: { row: 4, col: 4 }, to: { row: 3, col: 4 } },
  successText: 'Great move!',
  failText: 'Wrong move.',
};

const quizStep: LessonStep = {
  type: 'quiz',
  question: 'What is this piece?',
  choices: ['Pawn', 'Gold', 'Silver'],
  correctIndex: 0,
  explanation: 'It is a pawn.',
};

const boardQuizStep: LessonStep = {
  type: 'board_quiz',
  question: 'Which board is correct?',
  boardOptions: [
    { sfen: '9/9/9/9/4P4/9/9/9/9', label: 'A' },
    { sfen: '9/9/9/4P4/9/9/9/9/9', label: 'B' },
  ],
  correctIndex: 0,
  explanation: 'Board A is correct.',
};

const reviewStep: LessonStep = {
  type: 'review',
  source: 'mistakes_in_lesson',
  count: 3,
};

function makeLesson(steps: LessonStep[]): Lesson {
  return {
    id: 'test-lesson',
    title: 'Test Lesson',
    unitId: 'u1',
    worldId: 'w1',
    order: 1,
    steps,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createInitialState', () => {
  it('initializes with index 0 and no completion', () => {
    const lesson = makeLesson([explainStep]);
    const state = createInitialState(lesson);

    expect(state.currentStepIndex).toBe(0);
    expect(state.completed).toBe(false);
    expect(state.stepResult).toBeNull();
    expect(state.mistakes).toHaveLength(0);
    expect(state.selectedSquare).toBeNull();
    expect(state.lesson).toBe(lesson);
  });
});

describe('getCurrentStep', () => {
  it('returns the step at currentStepIndex', () => {
    const lesson = makeLesson([explainStep, tapStep]);
    const state = createInitialState(lesson);
    expect(getCurrentStep(state)).toBe(explainStep);
  });

  it('returns the last step and marks completed when advanced past end', () => {
    const lesson = makeLesson([explainStep]);
    let state = createInitialState(lesson);
    state = advanceStep(state);
    expect(state.completed).toBe(true);
    // currentStepIndex stays at last valid index
    expect(getCurrentStep(state)).toBe(explainStep);
  });
});

describe('canAdvance', () => {
  it('returns true for explain steps', () => {
    const state = createInitialState(makeLesson([explainStep]));
    expect(canAdvance(state)).toBe(true);
  });

  it('returns false for tap_square step without correct answer', () => {
    const state = createInitialState(makeLesson([tapStep]));
    expect(canAdvance(state)).toBe(false);
  });

  it('returns true for tap_square step after correct answer', () => {
    let state = createInitialState(makeLesson([tapStep]));
    state = handleTapSquare(state, { row: 4, col: 4 });
    expect(canAdvance(state)).toBe(true);
  });

  it('returns false when completed', () => {
    let state = createInitialState(makeLesson([explainStep]));
    state = advanceStep(state);
    expect(state.completed).toBe(true);
    expect(canAdvance(state)).toBe(false);
  });

  it('returns true for review steps', () => {
    const state = createInitialState(makeLesson([reviewStep]));
    expect(canAdvance(state)).toBe(true);
  });
});

describe('advanceStep', () => {
  it('increments currentStepIndex', () => {
    let state = createInitialState(makeLesson([explainStep, tapStep]));
    state = advanceStep(state);
    expect(state.currentStepIndex).toBe(1);
    expect(state.completed).toBe(false);
  });

  it('marks completed when advancing past last step', () => {
    let state = createInitialState(makeLesson([explainStep]));
    state = advanceStep(state);
    expect(state.completed).toBe(true);
  });

  it('resets stepResult and selectedSquare', () => {
    let state = createInitialState(makeLesson([tapStep, explainStep]));
    state = handleTapSquare(state, { row: 4, col: 4 });
    expect(state.stepResult).toBe('correct');
    state = advanceStep(state);
    expect(state.stepResult).toBeNull();
    expect(state.selectedSquare).toBeNull();
  });
});

describe('handleTapSquare', () => {
  it('returns correct on matching square', () => {
    let state = createInitialState(makeLesson([tapStep]));
    state = handleTapSquare(state, { row: 4, col: 4 });
    expect(state.stepResult).toBe('correct');
    expect(state.mistakes).toHaveLength(0);
  });

  it('returns incorrect on wrong square', () => {
    let state = createInitialState(makeLesson([tapStep]));
    state = handleTapSquare(state, { row: 0, col: 0 });
    expect(state.stepResult).toBe('incorrect');
    expect(state.mistakes).toHaveLength(1);
    expect(state.mistakes[0].stepIndex).toBe(0);
  });

  it('does nothing for non-tap steps', () => {
    const state = createInitialState(makeLesson([explainStep]));
    const result = handleTapSquare(state, { row: 0, col: 0 });
    expect(result).toBe(state);
  });
});

describe('handleMove', () => {
  it('returns correct on matching move', () => {
    let state = createInitialState(makeLesson([moveStep]));
    state = handleMove(state, { row: 4, col: 4 }, { row: 3, col: 4 });
    expect(state.stepResult).toBe('correct');
    expect(state.mistakes).toHaveLength(0);
  });

  it('returns incorrect on wrong move', () => {
    let state = createInitialState(makeLesson([moveStep]));
    state = handleMove(state, { row: 4, col: 4 }, { row: 5, col: 4 });
    expect(state.stepResult).toBe('incorrect');
    expect(state.mistakes).toHaveLength(1);
  });

  it('returns incorrect when from is wrong', () => {
    let state = createInitialState(makeLesson([moveStep]));
    state = handleMove(state, { row: 0, col: 0 }, { row: 3, col: 4 });
    expect(state.stepResult).toBe('incorrect');
  });
});

describe('handleQuizAnswer', () => {
  it('returns correct for quiz with right answer', () => {
    let state = createInitialState(makeLesson([quizStep]));
    state = handleQuizAnswer(state, 0);
    expect(state.stepResult).toBe('correct');
  });

  it('returns incorrect for quiz with wrong answer', () => {
    let state = createInitialState(makeLesson([quizStep]));
    state = handleQuizAnswer(state, 1);
    expect(state.stepResult).toBe('incorrect');
    expect(state.mistakes).toHaveLength(1);
  });

  it('works for board_quiz steps too', () => {
    let state = createInitialState(makeLesson([boardQuizStep]));
    state = handleQuizAnswer(state, 0);
    expect(state.stepResult).toBe('correct');

    let state2 = createInitialState(makeLesson([boardQuizStep]));
    state2 = handleQuizAnswer(state2, 1);
    expect(state2.stepResult).toBe('incorrect');
  });
});

describe('selectSquare', () => {
  it('sets selectedSquare and clears stepResult', () => {
    let state = createInitialState(makeLesson([moveStep]));
    const pos: Position = { row: 4, col: 4 };
    state = selectSquare(state, pos);
    expect(state.selectedSquare).toEqual(pos);
    expect(state.stepResult).toBeNull();
  });
});

describe('resetStepResult', () => {
  it('clears stepResult and selectedSquare', () => {
    let state = createInitialState(makeLesson([tapStep]));
    state = handleTapSquare(state, { row: 0, col: 0 }); // wrong
    expect(state.stepResult).toBe('incorrect');
    state = resetStepResult(state);
    expect(state.stepResult).toBeNull();
    expect(state.selectedSquare).toBeNull();
  });
});

describe('full lesson flow', () => {
  it('completes a multi-step lesson', () => {
    const lesson = makeLesson([explainStep, tapStep, quizStep]);
    let state = createInitialState(lesson);

    // Step 0: explain — just advance
    expect(canAdvance(state)).toBe(true);
    state = advanceStep(state);
    expect(state.currentStepIndex).toBe(1);

    // Step 1: tap — wrong then right
    state = handleTapSquare(state, { row: 0, col: 0 });
    expect(state.stepResult).toBe('incorrect');
    expect(state.mistakes).toHaveLength(1);
    state = resetStepResult(state);
    state = handleTapSquare(state, { row: 4, col: 4 });
    expect(state.stepResult).toBe('correct');
    state = advanceStep(state);
    expect(state.currentStepIndex).toBe(2);

    // Step 2: quiz — correct
    state = handleQuizAnswer(state, 0);
    expect(state.stepResult).toBe('correct');
    state = advanceStep(state);
    expect(state.completed).toBe(true);

    // Mistakes accumulated
    expect(state.mistakes).toHaveLength(1);
  });
});
