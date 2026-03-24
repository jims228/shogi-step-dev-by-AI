/**
 * StepRenderer — dispatches rendering to the appropriate step component
 * based on currentStep.type.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

import type { LessonStep, Position } from '../../types/lesson';
import { ExplainStepView } from './ExplainStep';
import { TapSquareStepView } from './TapSquareStep';
import { MoveStepView } from './MoveStep';
import { QuizStepView } from './QuizStep';
import { BoardQuizStepView } from './BoardQuizStep';
import { ReviewStepView } from './ReviewStep';

interface Props {
  step: LessonStep;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  selectedSquare: Position | null;
  selectedAnswerIndex: number | null;
  mistakeCount: number;
  onSquarePress: (pos: Position) => void;
  onAnswer: (index: number) => void;
}

export function StepRenderer({
  step,
  stepResult,
  selectedSquare,
  selectedAnswerIndex,
  mistakeCount,
  onSquarePress,
  onAnswer,
}: Props) {
  const content = (() => {
    switch (step.type) {
      case 'explain':
        return <ExplainStepView step={step} />;

      case 'tap_square':
        return (
          <TapSquareStepView
            step={step}
            stepResult={stepResult}
            onSquarePress={onSquarePress}
          />
        );

      case 'move':
        return (
          <MoveStepView
            step={step}
            stepResult={stepResult}
            selectedSquare={selectedSquare}
            onSquarePress={onSquarePress}
          />
        );

      case 'quiz':
        return (
          <QuizStepView
            step={step}
            stepResult={stepResult}
            selectedIndex={selectedAnswerIndex}
            onAnswer={onAnswer}
          />
        );

      case 'board_quiz':
        return (
          <BoardQuizStepView
            step={step}
            stepResult={stepResult}
            selectedIndex={selectedAnswerIndex}
            onAnswer={onAnswer}
          />
        );

      case 'review':
        return <ReviewStepView step={step} mistakeCount={mistakeCount} />;

      default:
        return null;
    }
  })();

  return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
