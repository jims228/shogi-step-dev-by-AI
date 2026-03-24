/**
 * Piece mapping utilities — alphabet to kanji and display names.
 */

import type { PieceType } from '../types/lesson';

/** Kanji display for each piece type (unpromoted). */
export const PIECE_KANJI: Record<PieceType, string> = {
  fu: '歩',
  ky: '香',
  ke: '桂',
  gi: '銀',
  ki: '金',
  ka: '角',
  hi: '飛',
  ou: '王',
};

/** Kanji display for promoted pieces. */
export const PROMOTED_KANJI: Partial<Record<PieceType, string>> = {
  fu: 'と',
  ky: '杏',
  ke: '圭',
  gi: '全',
  ka: '馬',
  hi: '龍',
};

/**
 * Get the kanji character for a piece.
 * Returns the promoted kanji when promoted=true and the piece is promotable.
 */
export function pieceToKanji(type: PieceType, promoted: boolean): string {
  if (promoted) {
    const promotedKanji = PROMOTED_KANJI[type];
    if (promotedKanji) return promotedKanji;
  }
  return PIECE_KANJI[type];
}
