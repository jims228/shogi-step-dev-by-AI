/**
 * ExplainStep — text explanation with optional board and coach bubble.
 * User action: tap "next".
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ExplainStep as ExplainStepType } from '../../types/lesson';
import { CoachBubble } from '../common/CoachBubble';
import { ShogiBoard } from '../board/ShogiBoard';

interface Props {
  step: ExplainStepType;
}

export function ExplainStepView({ step }: Props) {
  return (
    <View style={styles.container}>
      {step.coachText && <CoachBubble text={step.coachText} />}
      <Text style={styles.text}>{step.text}</Text>
      {step.sfen && (
        <View style={styles.boardWrap}>
          <ShogiBoard
            sfen={step.sfen}
            highlights={
              step.highlights?.map((pos) => ({
                position: pos,
                color: 'movable' as const,
              })) ?? []
            }
            interactive={false}
          />
        </View>
      )}
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
  },
  boardWrap: {
    alignItems: 'center',
    marginTop: 8,
  },
});
