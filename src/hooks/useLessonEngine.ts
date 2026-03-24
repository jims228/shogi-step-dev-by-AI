/**
 * useLessonEngine — React hook wrapping LessonEngine pure functions.
 *
 * Manages state with useState and provides auto-advance timers
 * (correct: 600ms, incorrect: 700ms).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Lesson, LessonState, Position } from '../types/lesson';
import {
  advanceStep,
  canAdvance,
  createInitialState,
  getCurrentStep,
  handleMove,
  handleQuizAnswer,
  handleTapSquare,
  resetStepResult,
  selectSquare,
} from '../engine/LessonEngine';

/** Delay before auto-advancing after correct answer (ms). */
const CORRECT_DELAY = 600;
/** Delay before resetting after incorrect answer (ms). */
const INCORRECT_DELAY = 700;

export function useLessonEngine(lesson: Lesson) {
  const [state, setState] = useState<LessonState>(() =>
    createInitialState(lesson),
  );

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null,
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto-advance / auto-reset when stepResult changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (state.stepResult === 'correct') {
      timerRef.current = setTimeout(() => {
        setState((prev) => advanceStep(prev));
        setSelectedAnswerIndex(null);
      }, CORRECT_DELAY);
    } else if (state.stepResult === 'incorrect') {
      timerRef.current = setTimeout(() => {
        setState((prev) => resetStepResult(prev));
        setSelectedAnswerIndex(null);
      }, INCORRECT_DELAY);
    }
  }, [state.stepResult, state.currentStepIndex]);

  // Auto-skip review steps with no mistakes
  useEffect(() => {
    const step = getCurrentStep(state);
    if (step?.type === 'review' && state.mistakes.length === 0) {
      setState((prev) => advanceStep(prev));
    }
  }, [state.currentStepIndex, state.mistakes.length]);

  const onSquarePress = useCallback(
    (pos: Position) => {
      const step = getCurrentStep(state);
      if (!step) return;

      if (step.type === 'tap_square') {
        setState((prev) => handleTapSquare(prev, pos));
        return;
      }

      if (step.type === 'move') {
        if (!state.selectedSquare) {
          // First tap — select piece
          setState((prev) => selectSquare(prev, pos));
        } else {
          // Second tap — attempt move
          setState((prev) => handleMove(prev, prev.selectedSquare!, pos));
        }
        return;
      }
    },
    [state.selectedSquare],
  );

  const onAnswer = useCallback((index: number) => {
    setSelectedAnswerIndex(index);
    setState((prev) => handleQuizAnswer(prev, index));
  }, []);

  const onAdvance = useCallback(() => {
    if (canAdvance(state)) {
      setState((prev) => advanceStep(prev));
      setSelectedAnswerIndex(null);
    }
  }, [state]);

  const currentStep = getCurrentStep(state);

  return {
    state,
    currentStep,
    selectedAnswerIndex,
    onSquarePress,
    onAnswer,
    onAdvance,
    canAdvance: canAdvance(state),
  };
}
