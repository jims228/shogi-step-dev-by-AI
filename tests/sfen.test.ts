/**
 * Tests for the SFEN parser.
 */

import { parseSFEN } from '../src/lib/sfen';

describe('parseSFEN', () => {
  it('parses the standard initial position', () => {
    const sfen =
      'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL';
    const board = parseSFEN(sfen);

    // 9 rows, each 9 cols
    expect(board).toHaveLength(9);
    for (const row of board) {
      expect(row).toHaveLength(9);
    }

    // Row 0 (gote back rank): l n s g k g s n l
    expect(board[0][0]).toEqual({ piece: 'ky', side: 'gote', promoted: false });
    expect(board[0][1]).toEqual({ piece: 'ke', side: 'gote', promoted: false });
    expect(board[0][4]).toEqual({ piece: 'ou', side: 'gote', promoted: false });
    expect(board[0][8]).toEqual({ piece: 'ky', side: 'gote', promoted: false });

    // Row 1 (gote rook + bishop)
    expect(board[1][0]).toBeNull();
    expect(board[1][1]).toEqual({ piece: 'hi', side: 'gote', promoted: false });
    expect(board[1][7]).toEqual({ piece: 'ka', side: 'gote', promoted: false });
    expect(board[1][8]).toBeNull();

    // Row 2 (gote pawns)
    for (let c = 0; c < 9; c++) {
      expect(board[2][c]).toEqual({ piece: 'fu', side: 'gote', promoted: false });
    }

    // Rows 3-5 (empty)
    for (let r = 3; r <= 5; r++) {
      for (let c = 0; c < 9; c++) {
        expect(board[r][c]).toBeNull();
      }
    }

    // Row 6 (sente pawns)
    for (let c = 0; c < 9; c++) {
      expect(board[6][c]).toEqual({ piece: 'fu', side: 'sente', promoted: false });
    }

    // Row 7 (sente bishop + rook)
    expect(board[7][1]).toEqual({ piece: 'ka', side: 'sente', promoted: false });
    expect(board[7][7]).toEqual({ piece: 'hi', side: 'sente', promoted: false });

    // Row 8 (sente back rank)
    expect(board[8][0]).toEqual({ piece: 'ky', side: 'sente', promoted: false });
    expect(board[8][4]).toEqual({ piece: 'ou', side: 'sente', promoted: false });
    expect(board[8][8]).toEqual({ piece: 'ky', side: 'sente', promoted: false });
  });

  it('parses an empty board', () => {
    const sfen = '9/9/9/9/9/9/9/9/9';
    const board = parseSFEN(sfen);

    expect(board).toHaveLength(9);
    for (const row of board) {
      expect(row).toHaveLength(9);
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });

  it('parses promoted pieces', () => {
    // A promoted pawn (と) at 5e sente, promoted rook (龍) at 2b gote
    const sfen = '9/1+r7/9/9/4+P4/9/9/9/9';
    const board = parseSFEN(sfen);

    expect(board[1][1]).toEqual({ piece: 'hi', side: 'gote', promoted: true });
    expect(board[4][4]).toEqual({ piece: 'fu', side: 'sente', promoted: true });
  });

  it('parses a board with mixed pieces and spaces', () => {
    // Single pawn at 5e
    const sfen = '9/9/9/9/4P4/9/9/9/9';
    const board = parseSFEN(sfen);

    expect(board[4][4]).toEqual({ piece: 'fu', side: 'sente', promoted: false });
    // Everything else null
    expect(board[0][0]).toBeNull();
    expect(board[4][3]).toBeNull();
    expect(board[4][5]).toBeNull();
  });

  it('handles SFEN with trailing fields (side/move/hands)', () => {
    const sfen = 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1';
    const board = parseSFEN(sfen);

    // Should still parse correctly (only board part used)
    expect(board).toHaveLength(9);
    expect(board[0][0]).toEqual({ piece: 'ky', side: 'gote', promoted: false });
  });

  it('throws on invalid SFEN with wrong number of ranks', () => {
    expect(() => parseSFEN('9/9/9')).toThrow(/expected 9 ranks/);
  });

  it('throws on unknown piece character', () => {
    expect(() => parseSFEN('9/9/9/9/4X4/9/9/9/9')).toThrow(/unknown piece/);
  });

  it('throws on rank with wrong cell count', () => {
    expect(() => parseSFEN('PPPPPPPPPP/9/9/9/9/9/9/9/9')).toThrow(
      /has 10 cells/,
    );
  });

  it('throws when promoting a non-promotable piece (King)', () => {
    expect(() => parseSFEN('9/9/9/9/4+K4/9/9/9/9')).toThrow(/cannot be promoted/);
  });

  it('throws when promoting Gold', () => {
    expect(() => parseSFEN('9/9/9/9/4+G4/9/9/9/9')).toThrow(/cannot be promoted/);
  });

  it('parses all promotable pieces', () => {
    // +P, +L, +N, +S, +B, +R on row 4
    const sfen = '9/9/9/9/+P+L+N+S1+B+R2/9/9/9/9';
    const board = parseSFEN(sfen);

    expect(board[4][0]).toEqual({ piece: 'fu', side: 'sente', promoted: true });
    expect(board[4][1]).toEqual({ piece: 'ky', side: 'sente', promoted: true });
    expect(board[4][2]).toEqual({ piece: 'ke', side: 'sente', promoted: true });
    expect(board[4][3]).toEqual({ piece: 'gi', side: 'sente', promoted: true });
    expect(board[4][4]).toBeNull();
    expect(board[4][5]).toEqual({ piece: 'ka', side: 'sente', promoted: true });
    expect(board[4][6]).toEqual({ piece: 'hi', side: 'sente', promoted: true });
  });
});
