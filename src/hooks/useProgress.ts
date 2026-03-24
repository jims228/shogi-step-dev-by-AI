import { useMemo } from 'react';
import { useProgressContext } from '../state/ProgressContext';
import type { LessonProgress } from '../state/ProgressContext';

/**
 * Convenience hook wrapping ProgressContext.
 * Provides helpers for common progress queries.
 */
export function useProgress() {
  const ctx = useProgressContext();

  const helpers = useMemo(() => {
    const isCompleted = (lessonId: string): boolean => {
      return ctx.progress.lessons[lessonId]?.completed === true;
    };

    const completedCount = (lessonIds: string[]): number => {
      return lessonIds.filter((id) => isCompleted(id)).length;
    };

    const getLesson = (lessonId: string): LessonProgress | undefined => {
      return ctx.progress.lessons[lessonId];
    };

    const getAllProgress = () => ctx.progress;

    return { isCompleted, completedCount, getLesson, getAllProgress };
  }, [ctx.progress]);

  return {
    ...ctx,
    ...helpers,
  };
}
