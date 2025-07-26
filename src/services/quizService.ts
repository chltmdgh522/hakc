import { api } from '../utils/apiClient';
import type {
  QuizStatusResponse,
  QuizData,
  QuizAnswerRequest,
  QuizAnswerResponse,
  QuizEndingResponse,
  QuizRecordListItem,
  QuizAnalysisResponse,
  AIAnalysisItem
} from '../types/api';

// 퀴즈 서비스 클래스
export class QuizService {
  // 퀴즈 상태 확인
  static async checkStatus(): Promise<QuizStatusResponse | null> {
    try {
      return await api.get<QuizStatusResponse>('/quiz/status');
    } catch (error) {
      console.error('퀴즈 상태 확인 실패:', error);
      return null;
    }
  }

  // 퀴즈 데이터 불러오기
  static async fetchQuizData(quizId: number, quizRecordId?: number): Promise<QuizData | null> {
    try {
      let endpoint: string;
      if (quizId === 1) {
        endpoint = '/quiz/0';
      } else if (quizRecordId) {
        endpoint = `/quiz/${quizRecordId}`;
      } else {
        endpoint = `/quiz/${quizId}`;
      }

      return await api.get<QuizData>(endpoint);
    } catch (error) {
      console.error('퀴즈 데이터 불러오기 실패:', error);
      return null;
    }
  }

  // 퀴즈 다시하기
  static async retryQuiz(quizId: number, imageId: number): Promise<QuizData | null> {
    try {
      return await api.get<QuizData>(`/quiz/return/${quizId}?imageId=${imageId}`);
    } catch (error) {
      console.error('퀴즈 다시하기 실패:', error);
      return null;
    }
  }

  // 퀴즈 정답 확인
  static async checkAnswer(request: QuizAnswerRequest): Promise<QuizAnswerResponse | null> {
    try {
      return await api.post<QuizAnswerResponse>('/quiz', request);
    } catch (error) {
      console.error('퀴즈 정답 확인 실패:', error);
      return null;
    }
  }

  // 퀴즈 종료 처리
  static async endQuiz(quizRecordId: string): Promise<QuizEndingResponse | null> {
    try {
      return await api.get<QuizEndingResponse>(`/record/ending/${quizRecordId}`);
    } catch (error) {
      console.error('퀴즈 종료 처리 실패:', error);
      return null;
    }
  }

  // 퀴즈 기록 리스트 조회
  static async fetchRecords(): Promise<QuizRecordListItem[]> {
    try {
      return await api.get<QuizRecordListItem[]>('/record');
    } catch (error) {
      console.error('퀴즈 기록 조회 실패:', error);
      return [];
    }
  }

  // 개별 퀴즈 분석 결과 조회
  static async fetchAnalysis(quizRecordId: string): Promise<QuizAnalysisResponse | null> {
    try {
      return await api.get<QuizAnalysisResponse>(`/record/${quizRecordId}`);
    } catch (error) {
      console.error('퀴즈 분석 결과 조회 실패:', error);
      return null;
    }
  }

  // AI 분석 결과 조회
  static async fetchAIAnalysis(quizRecordId: string): Promise<AIAnalysisItem[]> {
    try {
      return await api.get<AIAnalysisItem[]>(`/record/ai/${quizRecordId}`);
    } catch (error) {
      console.error('AI 분석 결과 조회 실패:', error);
      return [];
    }
  }
} 