import { useState, useEffect, useCallback } from 'react';
import { useTimerStore } from '@/stores/timerStore';

export function useTimer() {
  const { status, startedAt, durationMs, start, complete, reset } = useTimerStore();
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (status !== 'running' || !startedAt) {
      if (status === 'completed') {
        setElapsedMs(durationMs);
      }
      return;
    }

    const updateElapsed = () => {
      setElapsedMs(Date.now() - startedAt);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [status, startedAt, durationMs]);

  const startTimer = useCallback(() => {
    start();
    setElapsedMs(0);
  }, [start]);

  const completeTimer = useCallback(() => {
    complete();
  }, [complete]);

  const resetTimer = useCallback(() => {
    reset();
    setElapsedMs(0);
  }, [reset]);

  return {
    status,
    startedAt,
    elapsedMs: status === 'completed' ? durationMs : elapsedMs,
    durationMs,
    start: startTimer,
    complete: completeTimer,
    reset: resetTimer,
  };
}
