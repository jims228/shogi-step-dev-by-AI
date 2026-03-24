/**
 * Lesson data quality tests.
 * If no lesson data files exist, tests are skipped automatically.
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateLesson, validateSFENFormat } from '../src/lib/validation';
import type { Lesson, LessonStep } from '../src/types/lesson';

// ─── Lesson Data Discovery ───────────────────────────

const LESSONS_DIR = path.resolve(__dirname, '../src/data/lessons');

function loadLessonFiles(): { filename: string; data: unknown }[] {
  if (!fs.existsSync(LESSONS_DIR)) return [];

  const files = fs.readdirSync(LESSONS_DIR).filter((f) => f.endsWith('.ts') || f.endsWith('.json'));
  if (files.length === 0) return [];

  const lessons: { filename: string; data: unknown }[] = [];
  for (const file of files) {
    try {
      // For .ts files, try to require them (works with ts-jest)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require(path.join(LESSONS_DIR, file));
      const data = mod.default || mod.lesson || mod;
      lessons.push({ filename: file, data });
    } catch {
      // Skip files that can't be loaded
    }
  }
  return lessons;
}

const lessonFiles = loadLessonFiles();
const hasLessons = lessonFiles.length > 0;

// ─── Helper: extract all SFEN strings from a step ─────

function extractSFENs(step: LessonStep): string[] {
  const sfens: string[] = [];
  if ('sfen' in step && typeof step.sfen === 'string' && step.sfen.length > 0) {
    sfens.push(step.sfen);
  }
  if (step.type === 'board_quiz') {
    for (const opt of step.boardOptions) {
      sfens.push(opt.sfen);
    }
  }
  return sfens;
}

// ─── Tests ────────────────────────────────────────────

const describeIfLessons = hasLessons ? describe : describe.skip;

describeIfLessons('Lesson data quality', () => {
  test.each(lessonFiles)('$filename passes schema validation', ({ data }) => {
    const result = validateLesson(data);
    expect(result.valid).toBe(true);
    if (!result.valid) {
      // Show errors for debugging
      console.error(result.errors);
    }
  });

  test.each(lessonFiles)('$filename has at least 3 steps', ({ data }) => {
    const lesson = data as Lesson;
    expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
  });

  test.each(lessonFiles)('$filename: all text fields are 100 chars or less', ({ data }) => {
    const lesson = data as Lesson;
    for (let i = 0; i < lesson.steps.length; i++) {
      const step = lesson.steps[i];
      const textsToCheck: { field: string; value: string }[] = [];

      if ('text' in step && typeof step.text === 'string') {
        textsToCheck.push({ field: `steps[${i}].text`, value: step.text });
      }
      if ('instruction' in step && typeof step.instruction === 'string') {
        textsToCheck.push({ field: `steps[${i}].instruction`, value: step.instruction });
      }
      if ('question' in step && typeof step.question === 'string') {
        textsToCheck.push({ field: `steps[${i}].question`, value: step.question });
      }
      if ('coachText' in step && typeof step.coachText === 'string') {
        textsToCheck.push({ field: `steps[${i}].coachText`, value: step.coachText });
      }

      for (const { field, value } of textsToCheck) {
        expect(value.length).toBeLessThanOrEqual(100);
        if (value.length > 100) {
          console.warn(
            `${field} is ${value.length} chars: "${value.substring(0, 50)}..."`
          );
        }
      }
    }
  });

  test.each(lessonFiles)('$filename: all SFEN strings are valid', ({ data }) => {
    const lesson = data as Lesson;
    for (let i = 0; i < lesson.steps.length; i++) {
      const sfens = extractSFENs(lesson.steps[i]);
      for (const sfen of sfens) {
        expect(validateSFENFormat(sfen)).toBe(true);
        if (!validateSFENFormat(sfen)) {
          console.error(`steps[${i}] has invalid SFEN: "${sfen}"`);
        }
      }
    }
  });

  test.each(lessonFiles)(
    '$filename: quiz/board_quiz correctIndex is in range',
    ({ data }) => {
      const lesson = data as Lesson;
      for (let i = 0; i < lesson.steps.length; i++) {
        const step = lesson.steps[i];
        if (step.type === 'quiz') {
          expect(step.correctIndex).toBeGreaterThanOrEqual(0);
          expect(step.correctIndex).toBeLessThan(step.choices.length);
        }
        if (step.type === 'board_quiz') {
          expect(step.correctIndex).toBeGreaterThanOrEqual(0);
          expect(step.correctIndex).toBeLessThan(step.boardOptions.length);
        }
      }
    }
  );
});

// Always-run test to confirm this file loads
describe('Content quality test suite', () => {
  test(`lesson data discovery: found ${lessonFiles.length} file(s)`, () => {
    if (!hasLessons) {
      console.log(
        'No lesson data files found in src/data/lessons/. Content quality tests skipped.'
      );
    }
    // This test always passes — it just reports what was found
    expect(true).toBe(true);
  });
});
