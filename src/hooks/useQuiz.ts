import { useState, useCallback, useRef } from 'react';
import { api } from '../utils/apiClient';
import type { 
  QuizData, 
  QuizAnswerRequest, 
  QuizAnswerResponse,
  QuizStatusResponse 
} from '../types/api';

// 시간 측정 유틸리티
export const formatDuration = (startTime: Date, endTime: Date): string => {
  const diffMs = endTime.getTime() - startTime.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  return `PT${minutes}M${seconds}S`;
};

// 퀴즈 상태 관리 훅
export const useQuiz = (quizId: number) => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const startTimeRef = useRef<Date | null>(null);

  // 퀴즈 데이터 로드
  const loadQuizData = useCallback(async (quizRecordId?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      let endpoint: string;
      if (quizId === 1) {
        endpoint = '/quiz/0';
      } else if (quizRecordId) {
        endpoint = `/quiz/${quizRecordId}`;
      } else {
        endpoint = `/quiz/${quizId}`;
      }

      const data = await api.get<QuizData>(endpoint);
      setCurrentQuiz(data);
      startTimeRef.current = new Date();
    } catch (err) {
      setError('퀴즈 데이터를 불러오는데 실패했습니다.');
      console.error('퀴즈 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  // 정답 확인
  const checkAnswer = useCallback(async (
    answer1: string, 
    answer2: string = "",
    onSuccess?: (result: QuizAnswerResponse) => void
  ) => {
    if (!currentQuiz || !startTimeRef.current) {
      console.error('퀴즈 데이터 또는 시작 시간이 없습니다.');
      return;
    }

    try {
      const endTime = new Date();
      const timeSpent = formatDuration(startTimeRef.current, endTime);

      const request: QuizAnswerRequest = {
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1,
        answer2,
        time: timeSpent
      };

      const result = await api.post<QuizAnswerResponse>('/quiz', request);
      
      setIsCorrect(result.answer);
      setShowResult(true);
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      setError('정답 확인에 실패했습니다.');
      console.error('정답 확인 실패:', err);
      return null;
    }
  }, [currentQuiz]);

  // 다시 시도
  const retryQuiz = useCallback(async () => {
    if (!currentQuiz) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await api.get<QuizData>(`/quiz/return/${currentQuiz.quizId}?imageId=${currentQuiz.imageId}`);
      
      setCurrentQuiz(data);
      setShowResult(false);
      setIsCorrect(null);
      startTimeRef.current = new Date();
    } catch (err) {
      setError('퀴즈 다시하기에 실패했습니다.');
      console.error('퀴즈 다시하기 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentQuiz]);

  // 퀴즈 상태 초기화
  const resetQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setIsLoading(false);
    setError(null);
    setIsCorrect(null);
    setShowResult(false);
    startTimeRef.current = null;
  }, []);

  return {
    // 상태
    currentQuiz,
    isLoading,
    error,
    isCorrect,
    showResult,
    startTime: startTimeRef.current,
    
    // 액션
    loadQuizData,
    checkAnswer,
    retryQuiz,
    resetQuiz,
    
    // 유틸리티
    formatDuration: (endTime: Date) => 
      startTimeRef.current ? formatDuration(startTimeRef.current, endTime) : 'PT0S'
  };
};

// 퀴즈 상태 확인 훅
export const useQuizStatus = () => {
  const [status, setStatus] = useState<QuizStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await api.get<QuizStatusResponse>('/quiz/status');
      setStatus(data);
      return data;
    } catch (err) {
      setError('퀴즈 상태 확인에 실패했습니다.');
      console.error('퀴즈 상태 확인 실패:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    isLoading,
    error,
    checkStatus
  };
}; 