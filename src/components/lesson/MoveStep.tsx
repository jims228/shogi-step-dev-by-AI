/**
 * MoveStep — two-tap move interaction.
 *
 * 1st tap: select a piece (orange highlight + blue movable hints).
 * 2nd tap: select destination. Engine checks against correctMove.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type {
  HighlightedSquare,
  MoveStep as MoveStepType,
  Position,
} from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';
import { ShogiBoard } from '../board/ShogiBoard';
import { FeedbackOverlay } from '../common/FeedbackOverlay';

interface Props {
  step: MoveStepType;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  selectedSquare: Position | null;
  onSquarePress: (pos: Position) => void;
}

export function MoveStepView({
  step,
  stepResult,
  selectedSquare,
  onSquarePress,
}: Props) {
  const highlights: HighlightedSquare[] = [
    ...(step.highlights?.map((pos) => ({
      position: pos,
      color: 'movable' as const,
    })) ?? []),
  ];

  if (stepResult === 'correct') {
    highlights.push({ position: step.correctMove.to, color: 'correct' });
  }

  return (
    <View style={styles.container}>
      {step.coachText && <CoachBubble text={step.coachText} />}
      <Text style={styles.instruction}>{step.instruction}</Text>
      <View style={styles.boardWrap}>
        <ShogiBoard
          sfen={step.sfen}
          highlights={highlights}
          selectedSquare={selectedSquare}
          onSquarePress={onSquarePress}
          interactive={stepResult !== 'correct'}
        />
      </View>
      {stepResult === 'correct' && (
        <FeedbackOverlay type="correct" message={step.successText} />
      )}
      {stepResult === 'incorrect' && (
        <FeedbackOverlay type="incorrect" message={step.failText} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 12,
    fontWeight: '600',
  },
  boardWrap: {
    alignItems: 'center',
    marginTop: 4,
  },
});
