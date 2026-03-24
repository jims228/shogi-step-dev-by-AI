import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, typography, shadow } from '../src/theme';
import { WORLD_1, W1_UNITS, getLessonsByUnitId } from '../src/data/roadmap';
import type { Unit } from '../src/types/lesson';
import { useProgress } from '../src/hooks/useProgress';

export default function RoadmapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoaded, isCompleted, completedCount } = useProgress();

  const handleUnitPress = (unit: Unit) => {
    const lessons = getLessonsByUnitId(unit.id);
    const target = lessons.find((l) => !isCompleted(l.id)) ?? lessons[0];
    if (target) {
      router.push(`/lesson/${target.id}`);
    }
  };

  if (!isLoaded) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>将棋ステップ</Text>
      </View>

      {/* World title */}
      <Text style={styles.worldTitle}>{WORLD_1.title}</Text>

      {/* Unit cards */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {W1_UNITS.map((unit) => {
          const lessons = getLessonsByUnitId(unit.id);
          const lessonIds = lessons.map((l) => l.id);
          const done = completedCount(lessonIds);
          const total = lessons.length;

          return (
            <Pressable
              key={unit.id}
              onPress={() => handleUnitPress(unit)}
              style={({ pressed }) => [
                styles.unitCard,
                pressed && styles.unitCardPressed,
              ]}
            >
              <View style={styles.unitCardBody}>
                <Text style={styles.unitTitle}>{unit.title}</Text>
                <Text style={styles.unitLessonCount}>
                  {total} レッスン
                </Text>
              </View>

              {/* Progress badge */}
              <View
                style={[
                  styles.progressBadge,
                  done === total && total > 0 && styles.progressBadgeComplete,
                ]}
              >
                <Text
                  style={[
                    styles.progressBadgeText,
                    done === total && total > 0 && styles.progressBadgeTextComplete,
                  ]}
                >
                  {done}/{total}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  worldTitle: {
    ...typography.h2,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  unitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundTint,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    ...shadow.card,
  },
  unitCardPressed: {
    opacity: 0.7,
  },
  unitCardBody: {
    flex: 1,
  },
  unitTitle: {
    ...typography.h2,
    color: colors.text,
  },
  unitLessonCount: {
    ...typography.sub,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  progressBadge: {
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minWidth: 48,
    alignItems: 'center',
  },
  progressBadgeComplete: {
    backgroundColor: colors.success,
  },
  progressBadgeText: {
    ...typography.sub,
    color: colors.textMuted,
  },
  progressBadgeTextComplete: {
    color: colors.background,
  },
});
