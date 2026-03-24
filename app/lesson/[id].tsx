import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, radius, typography, shadow } from '../../src/theme';

const TOTAL_STEPS = 6; // Placeholder; real value comes from lesson data

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  const handleClose = () => {
    router.back();
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Lesson complete - go back to roadmap
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Close button */}
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={12}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>

        {/* Step counter */}
        <Text style={styles.stepCounter}>
          {currentStep}/{TOTAL_STEPS}
        </Text>
      </View>

      {/* Content area - placeholder */}
      <View style={styles.content}>
        <Text style={styles.lessonId}>Lesson: {id}</Text>
        <Text style={styles.placeholderText}>
          ステップ内容がここに表示されます
        </Text>
        <Text style={styles.placeholderSub}>
          (Builder-B の StepRenderer と接続予定)
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentStep < TOTAL_STEPS ? '次へ' : '完了'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    ...typography.h2,
    color: colors.textMuted,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  stepCounter: {
    ...typography.sub,
    color: colors.textMuted,
    minWidth: 36,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  lessonId: {
    ...typography.sub,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  placeholderText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  placeholderSub: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow.button,
  },
  nextButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  nextButtonText: {
    ...typography.h2,
    color: colors.background,
  },
});
