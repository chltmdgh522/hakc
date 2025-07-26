import config from '../config';
import { getAuthHeaders } from './auth';

// 퀴즈 상태 확인 응답 타입
export interface QuizStatusResponse {
  isStatus: boolean;
  quizId: number | null;
  quizRecordId: number | null;
  imageId: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  quizNumber: number | null;
}

// 퀴즈 정보 응답 타입
export interface QuizData {
  quizId: number;
  quizRecordId: number;
  imageId: number;
  imageUrl: string;
  audioUrl: string;
}

// 퀴즈 정답 확인 요청 타입
export interface QuizAnswerRequest {
  quizId: number;
  imageId: number;
  answer1: string;
  answer2: string;
  time: string; // Duration 형식 (예: "PT1M30S")
}

// 퀴즈 정답 확인 응답 타입
export interface QuizAnswerResponse {
  answer: boolean;
  audioUrl: string;
}

// 퀴즈 종료 응답 타입
export interface QuizEndingResponse {
  allTime: string;
  quiz1: number;
  quiz2: number;
  quiz3: number;
  quiz4: number;
  quiz5: number;
}

// 퀴즈 기록 리스트 타입
export interface QuizRecordListItem {
  createdAt: string;
  average: number;
  quizRecordId: number;
}

// 개별 퀴즈 분석 결과 타입
export interface QuizAnalysisResponse {
  name: string;
  createdAt: string;
  timeRes: {
    allTime: string;
    quiz1Time: string;
    quiz2Time: string;
    quiz3Time: string;
    quiz4Time: string;
    quiz5Time: string;
  };
  pointRes: {
    emotionPoint: number;
    interestPoint: number;
    contextPoint: number;
    sympathyPoint: number;
    emotionCnt: number;
    interestCnt: number;
    contextCnt: number;
    sympathyCnt: number;
  };
}

// AI 분석 결과 타입 (리스트 형태)
export interface AIAnalysisItem {
  content: string;
}

// 기존 타입들 (하위 호환성을 위해 유지)
export interface QuizRecord {
  id: string;
  date: string;
  score: number;
  playTime: string;
  totalQuestions: number;
  correctCount: number;
}

export interface AIRecord {
  quizRecordId: string;
  analysis: string;
  recommendations: string[];
  emotionalPattern: string;
}

// 퀴즈 상태 확인 (새로운 API)
export const checkQuizStatus = async (): Promise<QuizStatusResponse | null> => {
  try {
    console.log('퀴즈 상태 확인 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/quiz/status`);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(`${config.api.baseUrl}/quiz/status`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('퀴즈 상태 확인 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 상태 확인 실패:', error);
    return null;
  }
};

// 퀴즈 정보 불러오기 (새로운 API)
export const fetchQuizData = async (quizNumber: number, quizRecordId?: number): Promise<QuizData | null> => {
  try {
    let url: string;

    if (quizNumber === 1) {
      // 퀴즈 1번: /api/quiz/0?quizNumber=1
      console.log('fetchQuizData: 퀴즈 1번 호출');
      url = `${config.api.baseUrl}/quiz/0?quizNumber=1`;
    } else if (quizRecordId > 0) {
      // 퀴즈 2~5번: quizRecordId가 있으면 사용
      console.log('fetchQuizData: 퀴즈 2-5 호출');
      url = `${config.api.baseUrl}/quiz/${quizRecordId}?quizNumber=${quizNumber}`;
    } else {
      console.log('fetchQuizData: 퀴즈 187687S번 호출');
      // 퀴즈 2~5번: quizRecordId가 없으면 기본값 사용
      url = `${config.api.baseUrl}/quiz/0?quizNumber=${quizNumber}`;
    }
    
    console.log('fetchQuizData: 퀴즈 ID:', quizNumber);
    console.log('fetchQuizData: quizRecordId:', quizRecordId);
    console.log('fetchQuizData: 최종 URL:', url);
    
    console.log('퀴즈 정보 불러오기 API 호출...');
    console.log('API 요청 URL:', url);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('퀴즈 정보 불러오기 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 정보 불러오기 실패:', error);
    return null;
  }
};

// 퀴즈 다시하기 (새로운 API)
export const retryQuiz = async (quizId: number, imageId: number): Promise<QuizData | null> => {
  try {
    const url = `${config.api.baseUrl}/quiz/return/${quizId}?imageId=${imageId}`;
    
    console.log('퀴즈 다시하기 API 호출...');
    console.log('API 요청 URL:', url);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('퀴즈 다시하기 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 다시하기 실패:', error);
    return null;
  }
};

// 퀴즈 정답 확인 (새로운 API)
export const checkQuizAnswer = async (request: QuizAnswerRequest): Promise<QuizAnswerResponse | null> => {
  try {
    console.log('퀴즈 정답 확인 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/quiz`);
    console.log('API 요청 헤더:', getAuthHeaders());
    console.log('API 요청 바디:', JSON.stringify(request));
    
    const response = await fetch(`${config.api.baseUrl}/quiz`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request)
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('퀴즈 정답 확인 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 정답 확인 실패:', error);
    return null;
  }
};

// 퀴즈 종료 처리
export const endQuiz = async (quizRecordId: string): Promise<QuizEndingResponse | null> => {
  try {
    console.log('퀴즈 종료 처리 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/record/ending/${quizRecordId}`);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(`${config.api.baseUrl}/record/ending/${quizRecordId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('퀴즈 종료 처리 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 종료 처리 실패:', error);
    return null;
  }
};

// 퀴즈 기록 리스트 조회
export const fetchQuizRecords = async (): Promise<QuizRecordListItem[]> => {
  try {
    console.log('퀴즈 기록 리스트 조회 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/record`);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(`${config.api.baseUrl}/record`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('퀴즈 기록 리스트 조회 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 기록 조회 실패:', error);
    return [];
  }
};

// 개별 퀴즈 분석 결과 조회
export const fetchQuizAnalysis = async (quizRecordId: string): Promise<QuizAnalysisResponse | null> => {
  try {
    console.log('개별 퀴즈 분석 결과 조회 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/record/${quizRecordId}`);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(`${config.api.baseUrl}/record/${quizRecordId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('개별 퀴즈 분석 결과 조회 응답:', data);
    return data;
  } catch (error) {
    console.error('퀴즈 분석 결과 조회 실패:', error);
    return null;
  }
};

// AI 분석 결과 조회
export const fetchAIAnalysis = async (quizRecordId: string): Promise<AIAnalysisItem[]> => {
  try {
    console.log('AI 분석 결과 조회 API 호출...');
    console.log('API 요청 URL:', `${config.api.baseUrl}/record/ai/${quizRecordId}`);
    console.log('API 요청 헤더:', getAuthHeaders());
    
    const response = await fetch(`${config.api.baseUrl}/record/ai/${quizRecordId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 상태 텍스트:', response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('AI 분석 결과 조회 응답:', data);
    return data;
  } catch (error) {
    console.error('AI 분석 결과 조회 실패:', error);
    return [];
  }
};

 