/**
 * TapSquareStep — user taps a correct square on the board.
 *
 * Correct: green highlight + successText.
 * Incorrect: red highlight + failText + retry.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type {
  HighlightedSquare,
  Position,
  TapSquareStep as TapSquareStepType,
} from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';
import { ShogiBoard } from '../board/ShogiBoard';
import { FeedbackOverlay } from '../common/FeedbackOverlay';

interface Props {
  step: TapSquareStepType;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  onSquarePress: (pos: Position) => void;
}

export function TapSquareStepView({ step, stepResult, onSquarePress }: Props) {
  const highlights: HighlightedSquare[] = [
    ...(step.highlights?.map((pos) => ({
      position: pos,
      color: 'movable' as const,
    })) ?? []),
  ];

  // Show correct / wrong highlight after answer
  if (stepResult === 'correct') {
    for (const sq of step.correctSquares) {
      highlights.push({ position: sq, color: 'correct' });
    }
  }

  return (
    <View style={styles.container}>
      {step.coachText && <CoachBubble text={step.coachText} />}
      <Text style={styles.instruction}>{step.instruction}</Text>
      <View style={styles.boardWrap}>
        <ShogiBoard
          sfen={step.sfen}
          highlights={highlights}
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
