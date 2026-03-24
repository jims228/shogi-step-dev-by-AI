/**
 * SFEN format validation tests.
 */

import { validateSFENFormat } from '../src/lib/validation';

describe('validateSFENFormat — valid SFEN strings', () => {
  test('standard initial position', () => {
    expect(
      validateSFENFormat('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL')
    ).toBe(true);
  });

  test('empty board (all 9s)', () => {
    expect(validateSFENFormat('9/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('single piece on board', () => {
    // King at center
    expect(validateSFENFormat('9/9/9/9/4K4/9/9/9/9')).toBe(true);
  });

  test('promoted pieces (+P, +R, etc.)', () => {
    // Promoted pawn at row 0, col 0
    expect(validateSFENFormat('+P8/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('multiple promoted pieces', () => {
    expect(validateSFENFormat('+P+P+P+P+P+P+P+P+P/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('mixed promoted and normal pieces', () => {
    expect(validateSFENFormat('+P1+R1+B1+S1+N/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('full row of consecutive empty squares (9)', () => {
    expect(validateSFENFormat('9/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('SFEN with space-separated metadata (board part only validated)', () => {
    // Real SFEN has: board w/b - hands movecount
    expect(
      validateSFENFormat('lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1')
    ).toBe(true);
  });

  test('consecutive small digits adding to 9', () => {
    // 2+3+4 = 9
    expect(validateSFENFormat('234/9/9/9/9/9/9/9/9')).toBe(true);
  });
});

describe('validateSFENFormat — invalid SFEN strings', () => {
  test('empty string', () => {
    expect(validateSFENFormat('')).toBe(false);
  });

  test('too few ranks (8 instead of 9)', () => {
    expect(validateSFENFormat('9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('too many ranks (10)', () => {
    expect(validateSFENFormat('9/9/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('rank width less than 9', () => {
    // 8 = 8 empty squares, total width 8, not 9 -> invalid
    expect(validateSFENFormat('8/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('rank width more than 9', () => {
    // K + 9 empty = 10
    expect(validateSFENFormat('K9/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('invalid piece character', () => {
    expect(validateSFENFormat('X8/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('0 is not a valid digit in SFEN', () => {
    expect(validateSFENFormat('0/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('+ at end of rank without following piece', () => {
    expect(validateSFENFormat('8+/9/9/9/9/9/9/9/9')).toBe(false);
  });

  test('null-ish input', () => {
    expect(validateSFENFormat(undefined as unknown as string)).toBe(false);
    expect(validateSFENFormat(null as unknown as string)).toBe(false);
  });

  test('whitespace-only string', () => {
    expect(validateSFENFormat('   ')).toBe(false);
  });
});

describe('validateSFENFormat — edge cases', () => {
  test('all promoted pieces filling a rank', () => {
    // 9 promoted pawns
    expect(
      validateSFENFormat('+P+P+P+P+P+P+P+P+P/9/9/9/9/9/9/9/9')
    ).toBe(true);
  });

  test('lower-case pieces (gote/opponent)', () => {
    expect(validateSFENFormat('lnsgkgsnl/9/9/9/9/9/9/9/9')).toBe(true);
  });

  test('promoted lower-case piece', () => {
    expect(validateSFENFormat('+p8/9/9/9/9/9/9/9/9')).toBe(true);
  });
});
