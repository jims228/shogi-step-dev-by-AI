/**
 * CoachBubble — text bubble for the coach character "おじい".
 *
 * v1: text-only (no avatar image). Friendly, short, hiragana-heavy tone.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  text: string;
}

export function CoachBubble({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>おじい</Text>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  name: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
    marginLeft: 12,
    fontWeight: '600',
  },
  bubble: {
    backgroundColor: '#F5F0E8',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
});
