'use client';

import { useState, useCallback } from 'react';

export interface GenerationProgress {
  requestId: string | null;
  status: 'idle' | 'processing' | 'completed' | 'error';
  message: string;
  progress: number;
}

export const useProjectGeneration = () => {
  const [progress, setProgress] = useState<GenerationProgress>({
    requestId: null,
    status: 'idle',
    message: '',
    progress: 0
  });

  const resetProgress = useCallback(() => {
    setProgress({
      requestId: null,
      status: 'idle',
      message: '',
      progress: 0
    });
  }, []);

  const updateProgress = useCallback((updates: Partial<GenerationProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  }, []);

  const isGenerating = progress.status === 'processing';
  const hasError = progress.status === 'error';
  const isCompleted = progress.status === 'completed';

  return {
    progress,
    resetProgress,
    updateProgress,
    isGenerating,
    hasError,
    isCompleted
  };
};