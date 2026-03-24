/**
 * FeedbackOverlay — shows a colored bar with text for correct / incorrect.
 *
 * Correct:  green bar  + positive message
 * Incorrect: red bar   + encouraging retry message
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  type: 'correct' | 'incorrect';
  message?: string;
}

const DEFAULTS = {
  correct: 'せいかい!',
  incorrect: 'おしいね もういっかい やってみよう',
};

export function FeedbackOverlay({ type, message }: Props) {
  const isCorrect = type === 'correct';
  const displayMessage = message ?? DEFAULTS[type];

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: isCorrect ? '#22C55E' : '#EF4444' },
      ]}
    >
      <Text style={styles.text}>{displayMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
