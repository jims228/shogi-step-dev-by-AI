import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, radius, typography, shadow } from '../../src/theme';
import { getLessonById } from '../../src/data/roadmap';
import { useLessonEngine } from '../../src/hooks/useLessonEngine';
import { StepRenderer } from '../../src/components/lesson/StepRenderer';
import { FeedbackOverlay } from '../../src/components/common/FeedbackOverlay';
import { useProgressContext } from '../../src/state/ProgressContext';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { markComplete, updateStep, addMistake } = useProgressContext();

  const lesson = getLessonById(id ?? '');

  if (!lesson) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          <Text style={styles.errorText}>
            レッスンが見つかりません (id: {id})
          </Text>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>もどる</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const {
    state,
    currentStep,
    selectedAnswerIndex,
    onSquarePress,
    onAnswer,
    onAdvance,
    canAdvance: isAdvanceable,
  } = useLessonEngine(lesson);

  const totalSteps = lesson.steps.length;
  const currentStepNum = state.currentStepIndex + 1;
  const progressPercent = state.completed
    ? 100
    : (state.currentStepIndex / totalSteps) * 100;

  // Sync progress to persistent storage
  React.useEffect(() => {
    updateStep(lesson.id, state.currentStepIndex);
  }, [state.currentStepIndex]);

  React.useEffect(() => {
    if (state.stepResult === 'incorrect') {
      addMistake(lesson.id);
    }
  }, [state.stepResult, state.currentStepIndex]);

  React.useEffect(() => {
    if (state.completed) {
      markComplete(lesson.id);
    }
  }, [state.completed]);

  const handleClose = () => {
    router.back();
  };

  // Completed screen
  if (state.completed) {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.completeEmoji}>&#x1F389;</Text>
          <Text style={styles.completeTitle}>レッスン完了！</Text>
          <Text style={styles.completeSubtitle}>{lesson.title}</Text>
          {state.mistakes.length > 0 && (
            <Text style={styles.mistakeCount}>
              まちがい: {state.mistakes.length}回
            </Text>
          )}
        </View>
        <View style={styles.footer}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.nextButton,
              pressed && styles.nextButtonPressed,
            ]}
          >
            <Text style={styles.nextButtonText}>ロードマップにもどる</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={12}
        >
          <Text style={styles.closeButtonText}>X</Text>
        </Pressable>

        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>

        <Text style={styles.stepCounter}>
          {currentStepNum}/{totalSteps}
        </Text>
      </View>

      {/* Step content */}
      <View style={styles.content}>
        {currentStep && (
          <StepRenderer
            step={currentStep}
            stepResult={state.stepResult}
            selectedSquare={state.selectedSquare}
            selectedAnswerIndex={selectedAnswerIndex}
            mistakeCount={state.mistakes.length}
            onSquarePress={onSquarePress}
            onAnswer={onAnswer}
          />
        )}
      </View>

      {/* Feedback overlay */}
      {state.stepResult === 'correct' && (
        <FeedbackOverlay type="correct" />
      )}
      {state.stepResult === 'incorrect' && (
        <FeedbackOverlay type="incorrect" />
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Pressable
          onPress={onAdvance}
          disabled={!isAdvanceable}
          style={({ pressed }) => [
            styles.nextButton,
            !isAdvanceable && styles.nextButtonDisabled,
            pressed && isAdvanceable && styles.nextButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.nextButtonText,
              !isAdvanceable && styles.nextButtonTextDisabled,
            ]}
          >
            次へ
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
    paddingHorizontal: spacing.md,
  },
  errorText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: 'center',
  },
  backButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '700',
  },
  completeEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  completeTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  completeSubtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  mistakeCount: {
    ...typography.sub,
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
  nextButtonDisabled: {
    backgroundColor: colors.border,
  },
  nextButtonText: {
    ...typography.h2,
    color: colors.background,
  },
  nextButtonTextDisabled: {
    color: colors.textMuted,
  },
});
