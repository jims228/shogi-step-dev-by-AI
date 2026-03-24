/**
 * ShogiBoard — 9x9 interactive shogi board component.
 *
 * Renders a board from a SFEN string with optional highlights and
 * tap interaction.  See ctx-05 Section 5 for the full spec.
 */

import React, { useMemo, useRef } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { CellContent, HighlightedSquare, Position } from '../../types/lesson';
import { parseSFEN } from '../../lib/sfen';
import { Piece } from './Piece';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BOARD_BG = '#DEB887';
const GRID_LINE = '#333333';
const BORDER_COLOR = '#5D4037';

const HIGHLIGHT_COLORS: Record<string, string> = {
  movable: 'rgba(66,133,244,0.25)',
  correct: 'rgba(34,197,94,0.3)',
  wrong: 'rgba(239,68,68,0.3)',
  selected: 'rgba(245,158,11,0.3)',
};

const COL_LABELS = ['9', '8', '7', '6', '5', '4', '3', '2', '1'];
const ROW_LABELS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

const MIN_CELL_SIZE = 44;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ShogiBoardProps {
  sfen: string;
  highlights?: HighlightedSquare[];
  onSquarePress?: (pos: Position) => void;
  selectedSquare?: Position | null;
  interactive?: boolean;
  size?: 'full' | 'small';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ShogiBoard({
  sfen,
  highlights = [],
  onSquarePress,
  selectedSquare,
  interactive = true,
  size = 'full',
}: ShogiBoardProps) {
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = size === 'small' ? 8 : 24;

  const cellSize = Math.max(
    MIN_CELL_SIZE,
    Math.floor((screenWidth - boardPadding * 2) / 9),
  );
  const effectiveCellSize = size === 'small' ? Math.floor(cellSize * 0.45) : cellSize;
  const boardPixels = effectiveCellSize * 9;
  const labelFontSize = effectiveCellSize * 0.3;

  // Parse SFEN
  const board: CellContent[][] = useMemo(() => {
    try {
      return parseSFEN(sfen);
    } catch {
      // Return an empty board on parse failure
      return Array.from({ length: 9 }, () => Array(9).fill(null) as CellContent[]);
    }
  }, [sfen]);

  // Build highlight lookup for O(1) access
  const highlightMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const h of highlights) {
      map.set(`${h.position.row}-${h.position.col}`, h.color);
    }
    if (selectedSquare) {
      map.set(`${selectedSquare.row}-${selectedSquare.col}`, 'selected');
    }
    return map;
  }, [highlights, selectedSquare]);

  // Stable callback ref to avoid Pressable re-mounts
  const onPressRef = useRef(onSquarePress);
  onPressRef.current = onSquarePress;

  const rows = useMemo(() => {
    const result: React.ReactNode[] = [];
    for (let r = 0; r < 9; r++) {
      const cells: React.ReactNode[] = [];
      for (let c = 0; c < 9; c++) {
        const cell = board[r]?.[c] ?? null;
        const hlColor = highlightMap.get(`${r}-${c}`);

        cells.push(
          <Pressable
            key={c}
            disabled={!interactive}
            onPress={() => onPressRef.current?.({ row: r, col: c })}
            style={[
              styles.cell,
              {
                width: effectiveCellSize,
                height: effectiveCellSize,
                borderRightWidth: c < 8 ? StyleSheet.hairlineWidth : 0,
                borderBottomWidth: r < 8 ? StyleSheet.hairlineWidth : 0,
              },
            ]}
          >
            {hlColor && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: HIGHLIGHT_COLORS[hlColor] },
                ]}
              />
            )}
            {cell && (
              <Piece
                piece={cell.piece}
                side={cell.side}
                promoted={cell.promoted}
                size={effectiveCellSize}
              />
            )}
          </Pressable>,
        );
      }
      result.push(
        <View key={r} style={styles.row}>
          {cells}
        </View>,
      );
    }
    return result;
  }, [board, effectiveCellSize, highlightMap, interactive]);

  return (
    <View style={styles.container}>
      {/* Column labels (top): 9 .. 1 */}
      <View style={[styles.colLabels, { width: boardPixels }]}>
        {COL_LABELS.map((label, i) => (
          <Text
            key={i}
            style={[
              styles.label,
              { width: effectiveCellSize, fontSize: labelFontSize },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.boardRow}>
        {/* 9x9 grid */}
        <View
          style={[
            styles.board,
            { width: boardPixels + 4, backgroundColor: BOARD_BG },
          ]}
        >
          {rows}
        </View>

        {/* Row labels (right): 一 .. 九 */}
        <View style={styles.rowLabels}>
          {ROW_LABELS.map((label, i) => (
            <Text
              key={i}
              style={[
                styles.rowLabel,
                {
                  height: effectiveCellSize,
                  lineHeight: effectiveCellSize,
                  fontSize: labelFontSize,
                },
              ]}
            >
              {label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  colLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  boardRow: {
    flexDirection: 'row',
  },
  board: {
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: GRID_LINE,
  },
  rowLabels: {
    marginLeft: 3,
  },
  label: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '700',
  },
  rowLabel: {
    textAlign: 'center',
    color: '#666',
    fontWeight: '700',
  },
});
