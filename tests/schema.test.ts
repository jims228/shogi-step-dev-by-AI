/**
 * Schema validation tests for Shogi Step lesson data.
 */

import { validateLesson, validateStep } from '../src/lib/validation';
import {
  createMockLesson,
  createMockExplainStep,
  createMockTapSquareStep,
  createMockMoveStep,
  createMockQuizStep,
  createMockBoardQuizStep,
  createMockReviewStep,
  SFEN_INITIAL,
} from './test-utils';

// ─── Valid Data ───────────────────────────────────────

describe('validateLesson — valid data', () => {
  test('valid lesson returns valid: true with no errors', () => {
    const lesson = createMockLesson();
    const result = validateLesson(lesson);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('lesson with all step types is valid', () => {
    const lesson = createMockLesson({
      steps: [
        createMockExplainStep(),
        createMockTapSquareStep(),
        createMockMoveStep(),
        createMockQuizStep(),
        createMockBoardQuizStep(),
        createMockReviewStep(),
      ],
    });
    const result = validateLesson(lesson);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('explain step with optional sfen is valid', () => {
    const lesson = createMockLesson({
      steps: [createMockExplainStep({ sfen: SFEN_INITIAL })],
    });
    const result = validateLesson(lesson);
    expect(result.valid).toBe(true);
  });
});

// ─── Invalid Lesson Top-Level Fields ──────────────────

describe('validateLesson — invalid top-level fields', () => {
  test('null input returns error', () => {
    const result = validateLesson(null);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Lesson must be an object');
  });

  test('non-object input returns error', () => {
    const result = validateLesson('not an object');
    expect(result.valid).toBe(false);
  });

  test('missing id returns error', () => {
    const lesson = createMockLesson();
    (lesson as unknown as Record<string, unknown>).id = '';
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('id must be a non-empty string');
  });

  test('missing title returns error', () => {
    const lesson = createMockLesson();
    (lesson as unknown as Record<string, unknown>).title = '';
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('title must be a non-empty string');
  });

  test('missing unitId returns error', () => {
    const lesson = createMockLesson();
    (lesson as unknown as Record<string, unknown>).unitId = '';
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('unitId must be a non-empty string');
  });

  test('missing worldId returns error', () => {
    const lesson = createMockLesson();
    (lesson as unknown as Record<string, unknown>).worldId = '';
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('worldId must be a non-empty string');
  });

  test('empty steps array returns error', () => {
    const lesson = createMockLesson({ steps: [] });
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('steps must have at least 1 step');
  });

  test('missing steps returns error', () => {
    const lesson = createMockLesson();
    delete (lesson as unknown as Record<string, unknown>).steps;
    const result = validateLesson(lesson);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('steps must be an array');
  });
});

// ─── Invalid Steps ────────────────────────────────────

describe('validateStep — invalid step data', () => {
  test('non-object step returns error', () => {
    const errors = validateStep('not an object', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must be an object');
  });

  test('unknown step type returns error', () => {
    const errors = validateStep({ type: 'unknown_type' }, 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('invalid step type');
  });

  test('explain step without text returns error', () => {
    const errors = validateStep({ type: 'explain', text: '' }, 0);
    expect(errors).toContain('steps[0]: explain step must have non-empty text');
  });

  test('tap_square step without sfen returns error', () => {
    const step = { ...createMockTapSquareStep(), sfen: '' };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: tap_square step must have non-empty sfen');
  });

  test('tap_square step with empty correctSquares returns error', () => {
    const step = { ...createMockTapSquareStep(), correctSquares: [] };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: tap_square step must have at least 1 correctSquare');
  });

  test('tap_square step with invalid position returns error', () => {
    const step = { ...createMockTapSquareStep(), correctSquares: [{ row: -1, col: 0 }] };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: tap_square step has invalid position in correctSquares');
  });

  test('move step without sfen returns error', () => {
    const step = { ...createMockMoveStep(), sfen: '' };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: move step must have non-empty sfen');
  });

  test('move step with invalid correctMove returns error', () => {
    const step = { ...createMockMoveStep(), correctMove: { from: { row: -1, col: 0 }, to: { row: 0, col: 0 } } };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: move step correctMove.from is invalid');
  });

  test('quiz step with less than 2 choices returns error', () => {
    const step = { ...createMockQuizStep(), choices: ['only one'] };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: quiz step must have at least 2 choices');
  });

  test('quiz step with out-of-range correctIndex returns error', () => {
    const step = { ...createMockQuizStep(), correctIndex: 10 };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: quiz step correctIndex 10 out of range');
  });

  test('quiz step with empty explanation returns error', () => {
    const step = { ...createMockQuizStep(), explanation: '' };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: quiz step must have non-empty explanation');
  });

  test('board_quiz step with less than 2 boardOptions returns error', () => {
    const step = {
      ...createMockBoardQuizStep(),
      boardOptions: [{ sfen: SFEN_INITIAL }],
    };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: board_quiz step must have at least 2 boardOptions');
  });

  test('board_quiz step with out-of-range correctIndex returns error', () => {
    const step = { ...createMockBoardQuizStep(), correctIndex: 5 };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: board_quiz step correctIndex 5 out of range');
  });

  test('board_quiz step with empty explanation returns error', () => {
    const step = { ...createMockBoardQuizStep(), explanation: '' };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: board_quiz step must have non-empty explanation');
  });

  test('review step with invalid source returns error', () => {
    const step = { ...createMockReviewStep(), source: 'invalid' };
    const errors = validateStep(step, 0);
    expect(errors).toContain("steps[0]: review step source must be 'mistakes_in_lesson' or 'mistakes_in_unit'");
  });

  test('review step with count 0 returns error', () => {
    const step = { ...createMockReviewStep(), count: 0 };
    const errors = validateStep(step, 0);
    expect(errors).toContain('steps[0]: review step count must be a positive number');
  });
});
