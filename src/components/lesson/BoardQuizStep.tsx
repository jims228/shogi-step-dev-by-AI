/**
 * BoardQuizStep — select the correct board from small thumbnails.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BoardQuizStep as BoardQuizStepType } from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';
import { ShogiBoard } from '../board/ShogiBoard';

interface Props {
  step: BoardQuizStepType;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
}

export function BoardQuizStepView({
  step,
  stepResult,
  selectedIndex,
  onAnswer,
}: Props) {
  const answered = stepResult === 'correct' || stepResult === 'incorrect';

  return (
    <View style={styles.container}>
      {step.coachText && <CoachBubble text={step.coachText} />}
      <Text style={styles.question}>{step.question}</Text>

      <View style={styles.optionsGrid}>
        {step.boardOptions.map((opt, i) => {
          let borderColor = '#E5E7EB';
          if (answered) {
            if (i === step.correctIndex) borderColor = '#22C55E';
            else if (i === selectedIndex && stepResult === 'incorrect')
              borderColor = '#EF4444';
          }

          return (
            <Pressable
              key={i}
              style={[styles.option, { borderColor }]}
              onPress={() => !answered && onAnswer(i)}
              disabled={answered}
            >
              <ShogiBoard sfen={opt.sfen} interactive={false} size="small" />
              {opt.label && <Text style={styles.optLabel}>{opt.label}</Text>}
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanation}>{step.explanation}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  question: {
    fontSize: 17,
    lineHeight: 26,
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 12,
    fontWeight: '700',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 12,
  },
  option: {
    borderWidth: 3,
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
  },
  optLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  explanationBox: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEF9C3',
    borderRadius: 8,
  },
  explanation: {
    fontSize: 14,
    lineHeight: 22,
    color: '#713F12',
  },
});
