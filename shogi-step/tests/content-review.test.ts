/**
 * Content review tests: coach tone ("ojii" style) checks.
 * Ensures coachText follows the warm, grandfatherly tone guidelines.
 */

import * as fs from 'fs';
import * as path from 'path';
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

// ─── Tone check helpers ──────────────────────────────

/**
 * Check if text ends with a soft/friendly ending.
 * Acceptable endings: hiragana, katakana, punctuation like "!" "?" "..." etc.
 * Unacceptable: ending with kanji that sounds stiff/formal.
 */
function hasSoftEnding(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  const lastChar = trimmed[trimmed.length - 1];

  // Ends with friendly punctuation
  if (/[!！?？。…~〜♪]/.test(lastChar)) return true;

  // Ends with hiragana (soft)
  if (/[\u3040-\u309F]/.test(lastChar)) return true;

  // Ends with katakana (acceptable for exclamation style)
  if (/[\u30A0-\u30FF]/.test(lastChar)) return true;

  return false;
}

/**
 * Check if text contains imperative/commanding expressions.
 * These are inappropriate for the warm "ojii" coach character.
 */
const IMPERATIVE_PATTERNS = [
  /しなさい/,
  /しろ[。！!]?$/,
  /やれ[。！!]?$/,
  /覚えろ/,
  /考えろ/,
  /答えろ/,
  /動かせ[。！!]?$/,
  /打て[。！!]?$/,
  /指せ[。！!]?$/,
];

function containsImperative(text: string): boolean {
  return IMPERATIVE_PATTERNS.some((p) => p.test(text));
}

// ─── Tests ────────────────────────────────────────────

const describeIfLessons = hasLessons ? describe : describe.skip;

describeIfLessons('Coach tone review (ojii-kuchi check)', () => {
  for (const { filename, data } of lessonFiles) {
    const lesson = data as Lesson;

    describe(filename, () => {
      const stepsWithCoachText = lesson.steps
        .map((step, index) => ({ step, index }))
        .filter(({ step }) => 'coachText' in step && typeof step.coachText === 'string' && step.coachText.length > 0);

      if (stepsWithCoachText.length > 0) {
        test.each(stepsWithCoachText)(
          'steps[$index].coachText has soft/friendly ending',
          ({ step }) => {
            const coachText = (step as { coachText: string }).coachText;
            expect(hasSoftEnding(coachText)).toBe(true);
          }
        );

        test.each(stepsWithCoachText)(
          'steps[$index].coachText does not use imperative form',
          ({ step }) => {
            const coachText = (step as { coachText: string }).coachText;
            expect(containsImperative(coachText)).toBe(false);
          }
        );
      }

      // Check that explanation fields are non-empty
      const stepsWithExplanation = lesson.steps
        .map((step, index) => ({ step, index }))
        .filter(({ step }) => step.type === 'quiz' || step.type === 'board_quiz');

      if (stepsWithExplanation.length > 0) {
        test.each(stepsWithExplanation)(
          'steps[$index].explanation is non-empty',
          ({ step }) => {
            const explanation = (step as { explanation: string }).explanation;
            expect(typeof explanation).toBe('string');
            expect(explanation.trim().length).toBeGreaterThan(0);
          }
        );
      }
    });
  }
});

// ─── Unit tests for tone helpers (always run) ─────────

describe('Tone check helpers', () => {
  describe('hasSoftEnding', () => {
    test('hiragana ending is soft', () => {
      expect(hasSoftEnding('よくできたのう')).toBe(true);
    });

    test('exclamation ending is soft', () => {
      expect(hasSoftEnding('すごいぞ！')).toBe(true);
    });

    test('question ending is soft', () => {
      expect(hasSoftEnding('わかるかな？')).toBe(true);
    });

    test('katakana ending is soft', () => {
      expect(hasSoftEnding('ナイス')).toBe(true);
    });

    test('empty string is not soft', () => {
      expect(hasSoftEnding('')).toBe(false);
    });
  });

  describe('containsImperative', () => {
    test('"しなさい" is imperative', () => {
      expect(containsImperative('早くしなさい')).toBe(true);
    });

    test('"しろ" at end is imperative', () => {
      expect(containsImperative('勉強しろ')).toBe(true);
    });

    test('"覚えろ" is imperative', () => {
      expect(containsImperative('これを覚えろ')).toBe(true);
    });

    test('friendly phrasing is not imperative', () => {
      expect(containsImperative('やってみるのじゃ')).toBe(false);
    });

    test('suggestion is not imperative', () => {
      expect(containsImperative('考えてみよう！')).toBe(false);
    });
  });
});
