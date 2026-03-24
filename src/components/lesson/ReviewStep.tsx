/**
 * ReviewStep — re-presents mistaken questions from the current lesson.
 *
 * If no mistakes were made, the step is auto-skipped (handled by the hook).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ReviewStep as ReviewStepType } from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';

interface Props {
  step: ReviewStepType;
  mistakeCount: number;
}

export function ReviewStepView({ step, mistakeCount }: Props) {
  if (mistakeCount === 0) {
    return (
      <View style={styles.container}>
        <CoachBubble text="まちがいなし! すごいね!" />
        <Text style={styles.text}>
          このレッスンでは まちがいが ありませんでした。
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CoachBubble text="まちがえた もんだいを もういちど やってみよう!" />
      <Text style={styles.text}>
        {`ふくしゅう: ${mistakeCount}もん`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
    marginHorizontal: 16,
    marginVertical: 12,
    textAlign: 'center',
  },
});
