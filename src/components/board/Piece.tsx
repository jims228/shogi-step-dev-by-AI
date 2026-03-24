/**
 * Piece component — renders a single shogi piece using a sprite sheet.
 *
 * Sprite sheet layout (pieces.png — 1040x520, 8 cols x 4 rows, 130px tiles):
 *   Row 0: sente unpromoted  (P, L, N, S, G, B, R, K)
 *   Row 1: sente promoted    (+P, +L, +N, +S, _, +B, +R, _)
 *   Row 2: gote unpromoted
 *   Row 3: gote promoted
 *
 * Falls back to kanji Text when the image fails to load.
 */

import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { PieceType, Side } from '../../types/lesson';
import { pieceToKanji } from '../../lib/piece';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PIECES_IMG = require('../../../assets/pieces.png');

const TILE = 130;
const COLS = 8;
const ROWS = 4;

/** Column index in the sprite sheet for each unpromoted piece. */
const PIECE_COL: Record<PieceType, number> = {
  fu: 0,
  ky: 1,
  ke: 2,
  gi: 3,
  ki: 4,
  ka: 5,
  hi: 6,
  ou: 7,
};

/** Column index for promoted variants. Gold and King cannot promote. */
const PROMOTED_COL: Partial<Record<PieceType, number>> = {
  fu: 0,
  ky: 1,
  ke: 2,
  gi: 3,
  ka: 5,
  hi: 6,
};

/**
 * Per-piece fine-tuning offsets (in tile-coordinate pixels).
 * Referenced from the old Piece.tsx offset values.
 */
const SENTE_OFFSETS: Record<PieceType, { x: number; y: number }> = {
  fu: { x: -5, y: -6 },
  ky: { x: -3, y: -4 },
  ke: { x: 1, y: -4 },
  gi: { x: -2, y: -4 },
  ki: { x: -4, y: -4 },
  ka: { x: -2, y: -6 },
  hi: { x: -2, y: -6 },
  ou: { x: -1, y: -7 },
};

const GOTE_OFFSETS: Record<PieceType, { x: number; y: number }> = {
  fu: { x: -5, y: -8 },
  ky: { x: -3, y: -9.3 },
  ke: { x: 1, y: -9.3 },
  gi: { x: -2, y: -9.4 },
  ki: { x: -4, y: -9.4 },
  ka: { x: -2, y: -7 },
  hi: { x: -2, y: -7 },
  ou: { x: -1, y: -7.4 },
};

/** Scale factor so the piece artwork fills the cell (tiles have padding). */
const PIECE_SCALE = 1.3;

interface Props {
  piece: PieceType;
  side: Side;
  promoted: boolean;
  /** Cell size in dp. */
  size: number;
}

export function Piece({ piece, side, promoted, size }: Props) {
  const [imgError, setImgError] = useState(false);

  const isGote = side === 'gote';
  const isPromoted = promoted && piece in PROMOTED_COL;

  // Kanji fallback
  if (imgError) {
    return (
      <View style={[styles.fallback, { width: size, height: size }]}>
        <Text
          style={[
            styles.kanjiText,
            {
              fontSize: size * 0.55,
              color: isPromoted ? '#C62828' : '#333',
              transform: isGote ? [{ rotate: '180deg' }] : [],
            },
          ]}
        >
          {pieceToKanji(piece, promoted)}
        </Text>
      </View>
    );
  }

  const col = isPromoted ? PROMOTED_COL[piece]! : PIECE_COL[piece];
  const row = (isGote ? 2 : 0) + (isPromoted ? 1 : 0);

  const offsets = isGote ? GOTE_OFFSETS[piece] : SENTE_OFFSETS[piece];
  const renderSize = size * PIECE_SCALE;
  const scale = renderSize / TILE;
  const imgW = COLS * TILE * scale;
  const imgH = ROWS * TILE * scale;
  const centerOffset = (renderSize - size) / 2;

  return (
    <View pointerEvents="none" style={[styles.wrap, { width: size, height: size }]}>
      <Image
        source={PIECES_IMG}
        style={{
          width: imgW,
          height: imgH,
          marginLeft: -col * TILE * scale - centerOffset - offsets.x * scale,
          marginTop: -row * TILE * scale - centerOffset + offsets.y * scale,
        }}
        resizeMode="stretch"
        onError={() => setImgError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kanjiText: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
