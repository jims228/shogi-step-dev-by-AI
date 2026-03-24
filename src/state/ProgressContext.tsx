import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types (ctx-05 Section 8) ──

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  currentStepIndex: number;
  mistakeCount: number;
  completedAt?: string;
}

export interface AppProgress {
  lessons: Record<string, LessonProgress>;
  lastPlayedLessonId?: string;
  totalCompletedCount: number;
}

// ── Constants ──

const STORAGE_KEY = '@shogi-step/progress';

const EMPTY_PROGRESS: AppProgress = {
  lessons: {},
  totalCompletedCount: 0,
};

// ── Context ──

interface ProgressContextValue {
  progress: AppProgress;
  isLoaded: boolean;
  markComplete: (lessonId: string) => void;
  updateStep: (lessonId: string, stepIndex: number) => void;
  addMistake: (lessonId: string) => void;
  setLastPlayed: (lessonId: string) => void;
  getLesson: (lessonId: string) => LessonProgress | undefined;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

// ── Provider ──

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<AppProgress>(EMPTY_PROGRESS);
  const [isLoaded, setLoaded] = useState(false);

  // Load from AsyncStorage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && 'lessons' in parsed) {
            setProgress(parsed as AppProgress);
          }
        }
      } catch {
        // Ignore read errors; start fresh
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: AppProgress) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore write errors
    }
  }, []);

  const markComplete = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        const existing = prev.lessons[lessonId];
        if (existing?.completed) return prev;
        const lesson: LessonProgress = {
          ...(existing ?? {
            lessonId,
            currentStepIndex: 0,
            mistakeCount: 0,
          }),
          lessonId,
          completed: true,
          completedAt: new Date().toISOString(),
        };
        const next: AppProgress = {
          ...prev,
          lessons: { ...prev.lessons, [lessonId]: lesson },
          lastPlayedLessonId: lessonId,
          totalCompletedCount: prev.totalCompletedCount + 1,
        };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const updateStep = useCallback(
    (lessonId: string, stepIndex: number) => {
      setProgress((prev) => {
        const existing = prev.lessons[lessonId];
        const lesson: LessonProgress = {
          ...(existing ?? {
            lessonId,
            completed: false,
            mistakeCount: 0,
          }),
          lessonId,
          currentStepIndex: stepIndex,
          completed: existing?.completed ?? false,
          mistakeCount: existing?.mistakeCount ?? 0,
        };
        const next: AppProgress = {
          ...prev,
          lessons: { ...prev.lessons, [lessonId]: lesson },
          lastPlayedLessonId: lessonId,
        };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const addMistake = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        const existing = prev.lessons[lessonId];
        const lesson: LessonProgress = {
          ...(existing ?? {
            lessonId,
            completed: false,
            currentStepIndex: 0,
          }),
          lessonId,
          completed: existing?.completed ?? false,
          currentStepIndex: existing?.currentStepIndex ?? 0,
          mistakeCount: (existing?.mistakeCount ?? 0) + 1,
        };
        const next: AppProgress = {
          ...prev,
          lessons: { ...prev.lessons, [lessonId]: lesson },
        };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const setLastPlayed = useCallback(
    (lessonId: string) => {
      setProgress((prev) => {
        const next: AppProgress = {
          ...prev,
          lastPlayedLessonId: lessonId,
        };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const getLesson = useCallback(
    (lessonId: string): LessonProgress | undefined => {
      return progress.lessons[lessonId];
    },
    [progress.lessons],
  );

  const reset = useCallback(() => {
    setProgress(EMPTY_PROGRESS);
    void persist(EMPTY_PROGRESS);
  }, [persist]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      isLoaded,
      markComplete,
      updateStep,
      addMistake,
      setLastPlayed,
      getLesson,
      reset,
    }),
    [progress, isLoaded, markComplete, updateStep, addMistake, setLastPlayed, getLesson, reset],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

// ── Hook ──

export function useProgressContext(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgressContext must be used within ProgressProvider');
  }
  return ctx;
}
