/**
 * QuizStep — multiple-choice text quiz.
 *
 * Correct: button turns green + explanation shown.
 * Incorrect: button turns red, correct button turns green + explanation.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { QuizStep as QuizStepType } from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';

interface Props {
  step: QuizStepType;
  stepResult: 'pending' | 'correct' | 'incorrect' | null;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
}

export function QuizStepView({
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

      <View style={styles.choices}>
        {step.choices.map((choice, i) => {
          let bgColor = '#F3F4F6';
          if (answered) {
            if (i === step.correctIndex) bgColor = '#BBF7D0';
            else if (i === selectedIndex && stepResult === 'incorrect')
              bgColor = '#FECACA';
          }

          return (
            <Pressable
              key={i}
              style={[styles.choiceBtn, { backgroundColor: bgColor }]}
              onPress={() => !answered && onAnswer(i)}
              disabled={answered}
            >
              <Text style={styles.choiceText}>{choice}</Text>
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
  choices: {
    marginHorizontal: 16,
    gap: 10,
  },
  choiceBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  choiceText: {
    fontSize: 15,
    color: '#333',
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
