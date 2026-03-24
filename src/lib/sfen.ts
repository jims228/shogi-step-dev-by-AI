/**
 * SFEN parser — converts the board portion of a SFEN string into a 9x9 grid.
 *
 * SFEN conventions:
 * - Uppercase letter = sente (first player)
 * - Lowercase letter = gote (second player)
 * - '+' prefix = promoted piece
 * - Digit = consecutive empty squares
 * - '/' separates ranks (rows), top to bottom
 * - Only the board field (before the first space) is parsed.
 */

import type { CellContent, PieceType } from '../types/lesson';

const ALPHA_TO_PIECE: Record<string, PieceType> = {
  P: 'fu',
  L: 'ky',
  N: 'ke',
  S: 'gi',
  G: 'ki',
  B: 'ka',
  R: 'hi',
  K: 'ou',
};

/**
 * Pieces that can be promoted.
 * Gold (ki) and King (ou) cannot promote.
 */
const PROMOTABLE = new Set<PieceType>(['fu', 'ky', 'ke', 'gi', 'ka', 'hi']);

/**
 * Parse the board portion of a SFEN string into a 9x9 CellContent grid.
 *
 * @throws {Error} if the SFEN string is malformed.
 */
export function parseSFEN(sfen: string): CellContent[][] {
  const boardField = sfen.split(' ')[0] ?? sfen;
  const ranks = boardField.split('/');

  if (ranks.length !== 9) {
    throw new Error(
      `Invalid SFEN: expected 9 ranks, got ${ranks.length}. Input: "${sfen}"`,
    );
  }

  const board: CellContent[][] = [];

  for (let r = 0; r < 9; r++) {
    const rank = ranks[r]!;
    const row: CellContent[] = [];
    let promoted = false;

    for (let i = 0; i < rank.length; i++) {
      const ch = rank[i]!;

      if (ch === '+') {
        promoted = true;
        continue;
      }

      const digit = parseInt(ch, 10);
      if (!isNaN(digit)) {
        if (digit < 1 || digit > 9) {
          throw new Error(
            `Invalid SFEN: digit out of range (${digit}) at rank ${r + 1}. Input: "${sfen}"`,
          );
        }
        for (let e = 0; e < digit; e++) {
          row.push(null);
        }
        promoted = false;
        continue;
      }

      const upper = ch.toUpperCase();
      const pieceType = ALPHA_TO_PIECE[upper];

      if (!pieceType) {
        throw new Error(
          `Invalid SFEN: unknown piece character '${ch}' at rank ${r + 1}. Input: "${sfen}"`,
        );
      }

      if (promoted && !PROMOTABLE.has(pieceType)) {
        throw new Error(
          `Invalid SFEN: ${pieceType} cannot be promoted at rank ${r + 1}. Input: "${sfen}"`,
        );
      }

      const side = ch === upper ? 'sente' : 'gote';
      row.push({ piece: pieceType, side, promoted } as const);
      promoted = false;
    }

    if (row.length !== 9) {
      throw new Error(
        `Invalid SFEN: rank ${r + 1} has ${row.length} cells, expected 9. Input: "${sfen}"`,
      );
    }

    board.push(row);
  }

  return board;
}
