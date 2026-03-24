/**
 * Schema validation functions for Shogi Step lesson data.
 * Hand-written type guards — no external validation libraries (Zod etc.).
 */

import type { Lesson, LessonStep, Position } from '../types/lesson';

// ─── Helpers ──────────────────────────────────────────

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !Number.isNaN(v);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isValidPosition(v: unknown): v is Position {
  if (!isObject(v)) return false;
  return (
    isNumber(v.row) &&
    isNumber(v.col) &&
    v.row >= 0 &&
    v.row <= 8 &&
    v.col >= 0 &&
    v.col <= 8
  );
}

// ─── SFEN Validation ──────────────────────────────────

const VALID_SFEN_PIECE_CHARS = /^[1-9KRBGSNLPkrbgsnlp+]*$/;

/**
 * Validate SFEN board string format.
 * Rules:
 *  - 9 ranks separated by '/'
 *  - Each rank must sum to exactly 9 squares
 *  - Valid chars: piece letters, digits 1-9, '+' (promoted)
 */
export function validateSFENFormat(sfen: string): boolean {
  if (typeof sfen !== 'string' || sfen.trim().length === 0) return false;

  // Take only the board part (before first space if any)
  const boardPart = sfen.split(' ')[0];
  const ranks = boardPart.split('/');

  if (ranks.length !== 9) return false;

  for (const rank of ranks) {
    if (!VALID_SFEN_PIECE_CHARS.test(rank)) return false;

    let width = 0;
    let i = 0;
    while (i < rank.length) {
      const ch = rank[i];
      if (ch === '+') {
        // '+' must be followed by a piece letter
        i++;
        if (i >= rank.length) return false;
        const next = rank[i];
        if (!/^[KRBGSNLPkrbgsnlp]$/.test(next)) return false;
        width += 1;
      } else if (/^[1-9]$/.test(ch)) {
        width += parseInt(ch, 10);
      } else {
        // Regular piece letter
        width += 1;
      }
      i++;
    }

    if (width !== 9) return false;
  }

  return true;
}

// ─── Step Validation ──────────────────────────────────

const VALID_STEP_TYPES = ['explain', 'tap_square', 'move', 'quiz', 'board_quiz', 'review'] as const;

/**
 * Validate a single lesson step. Returns an array of error messages.
 */
export function validateStep(step: unknown, index: number): string[] {
  const errors: string[] = [];
  const prefix = `steps[${index}]`;

  if (!isObject(step)) {
    errors.push(`${prefix}: step must be an object`);
    return errors;
  }

  const type = step.type;
  if (!isNonEmptyString(type) || !(VALID_STEP_TYPES as readonly string[]).includes(type)) {
    errors.push(`${prefix}: invalid step type "${String(type)}"`);
    return errors;
  }

  switch (type) {
    case 'explain':
      if (!isNonEmptyString(step.text)) {
        errors.push(`${prefix}: explain step must have non-empty text`);
      }
      if (step.sfen !== undefined && typeof step.sfen === 'string' && step.sfen.length > 0) {
        if (!validateSFENFormat(step.sfen as string)) {
          errors.push(`${prefix}: explain step has invalid SFEN "${step.sfen}"`);
        }
      }
      break;

    case 'tap_square':
      if (!isNonEmptyString(step.sfen)) {
        errors.push(`${prefix}: tap_square step must have non-empty sfen`);
      } else if (!validateSFENFormat(step.sfen as string)) {
        errors.push(`${prefix}: tap_square step has invalid SFEN "${step.sfen}"`);
      }
      if (!isArray(step.correctSquares) || (step.correctSquares as unknown[]).length < 1) {
        errors.push(`${prefix}: tap_square step must have at least 1 correctSquare`);
      } else {
        for (const sq of step.correctSquares as unknown[]) {
          if (!isValidPosition(sq)) {
            errors.push(`${prefix}: tap_square step has invalid position in correctSquares`);
            break;
          }
        }
      }
      if (!isNonEmptyString(step.instruction)) {
        errors.push(`${prefix}: tap_square step must have non-empty instruction`);
      }
      if (!isNonEmptyString(step.successText)) {
        errors.push(`${prefix}: tap_square step must have non-empty successText`);
      }
      if (!isNonEmptyString(step.failText)) {
        errors.push(`${prefix}: tap_square step must have non-empty failText`);
      }
      break;

    case 'move':
      if (!isNonEmptyString(step.sfen)) {
        errors.push(`${prefix}: move step must have non-empty sfen`);
      } else if (!validateSFENFormat(step.sfen as string)) {
        errors.push(`${prefix}: move step has invalid SFEN "${step.sfen}"`);
      }
      if (!isObject(step.correctMove)) {
        errors.push(`${prefix}: move step must have correctMove object`);
      } else {
        const cm = step.correctMove as Record<string, unknown>;
        if (!isValidPosition(cm.from)) {
          errors.push(`${prefix}: move step correctMove.from is invalid`);
        }
        if (!isValidPosition(cm.to)) {
          errors.push(`${prefix}: move step correctMove.to is invalid`);
        }
      }
      if (!isNonEmptyString(step.instruction)) {
        errors.push(`${prefix}: move step must have non-empty instruction`);
      }
      if (!isNonEmptyString(step.successText)) {
        errors.push(`${prefix}: move step must have non-empty successText`);
      }
      if (!isNonEmptyString(step.failText)) {
        errors.push(`${prefix}: move step must have non-empty failText`);
      }
      break;

    case 'quiz':
      if (!isNonEmptyString(step.question)) {
        errors.push(`${prefix}: quiz step must have non-empty question`);
      }
      if (!isArray(step.choices) || (step.choices as unknown[]).length < 2) {
        errors.push(`${prefix}: quiz step must have at least 2 choices`);
      }
      if (!isNumber(step.correctIndex)) {
        errors.push(`${prefix}: quiz step must have numeric correctIndex`);
      } else if (
        isArray(step.choices) &&
        ((step.correctIndex as number) < 0 || (step.correctIndex as number) >= (step.choices as unknown[]).length)
      ) {
        errors.push(`${prefix}: quiz step correctIndex ${step.correctIndex} out of range`);
      }
      if (!isNonEmptyString(step.explanation)) {
        errors.push(`${prefix}: quiz step must have non-empty explanation`);
      }
      break;

    case 'board_quiz':
      if (!isNonEmptyString(step.question)) {
        errors.push(`${prefix}: board_quiz step must have non-empty question`);
      }
      if (!isArray(step.boardOptions) || (step.boardOptions as unknown[]).length < 2) {
        errors.push(`${prefix}: board_quiz step must have at least 2 boardOptions`);
      } else {
        for (let i = 0; i < (step.boardOptions as unknown[]).length; i++) {
          const opt = (step.boardOptions as unknown[])[i];
          if (!isObject(opt) || !isNonEmptyString((opt as Record<string, unknown>).sfen)) {
            errors.push(`${prefix}: board_quiz boardOptions[${i}] must have non-empty sfen`);
          } else if (!validateSFENFormat((opt as Record<string, unknown>).sfen as string)) {
            errors.push(`${prefix}: board_quiz boardOptions[${i}] has invalid SFEN`);
          }
        }
      }
      if (!isNumber(step.correctIndex)) {
        errors.push(`${prefix}: board_quiz step must have numeric correctIndex`);
      } else if (
        isArray(step.boardOptions) &&
        ((step.correctIndex as number) < 0 || (step.correctIndex as number) >= (step.boardOptions as unknown[]).length)
      ) {
        errors.push(`${prefix}: board_quiz step correctIndex ${step.correctIndex} out of range`);
      }
      if (!isNonEmptyString(step.explanation)) {
        errors.push(`${prefix}: board_quiz step must have non-empty explanation`);
      }
      break;

    case 'review':
      if (step.source !== 'mistakes_in_lesson' && step.source !== 'mistakes_in_unit') {
        errors.push(`${prefix}: review step source must be 'mistakes_in_lesson' or 'mistakes_in_unit'`);
      }
      if (!isNumber(step.count) || (step.count as number) < 1) {
        errors.push(`${prefix}: review step count must be a positive number`);
      }
      break;
  }

  return errors;
}

// ─── Lesson Validation ────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a complete lesson object.
 */
export function validateLesson(data: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(data)) {
    return { valid: false, errors: ['Lesson must be an object'] };
  }

  if (!isNonEmptyString(data.id)) {
    errors.push('id must be a non-empty string');
  }
  if (!isNonEmptyString(data.title)) {
    errors.push('title must be a non-empty string');
  }
  if (!isNonEmptyString(data.unitId)) {
    errors.push('unitId must be a non-empty string');
  }
  if (!isNonEmptyString(data.worldId)) {
    errors.push('worldId must be a non-empty string');
  }
  if (!isNumber(data.order)) {
    errors.push('order must be a number');
  }

  if (!isArray(data.steps)) {
    errors.push('steps must be an array');
  } else if ((data.steps as unknown[]).length < 1) {
    errors.push('steps must have at least 1 step');
  } else {
    for (let i = 0; i < (data.steps as unknown[]).length; i++) {
      const stepErrors = validateStep((data.steps as unknown[])[i], i);
      errors.push(...stepErrors);
    }
  }

  return { valid: errors.length === 0, errors };
}
