// ===== 인증 관련 타입 =====
export interface AuthUser {
  id: string;
  nickname: string;
  profileImage?: string;
  email?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponse {
  success: boolean;
  token: AuthToken | string;
  user: AuthUser;
  error?: string;
}

// ===== 퀴즈 관련 타입 =====
export interface QuizStatusResponse {
  isStatus: boolean;
  quizId: number | null;
  quizRecordId: number | null;
  imageId: number | null;
  imageUrl: string | null;
  audioUrl: string | null;
  quizNumber: number | null;
}

export interface QuizData {
  quizId: number;
  quizRecordId: number;
  imageId: number;
  imageUrl: string;
  audioUrl: string;
}

export interface QuizAnswerRequest {
  quizId: number;
  imageId: number;
  answer1: string;
  answer2: string;
  time: string; // Duration 형식 (예: "PT1M30S")
}

export interface QuizAnswerResponse {
  answer: boolean;
  audioUrl: string;
}

// ===== 퀴즈 기록 관련 타입 =====
export interface QuizEndingResponse {
  allTime: string;
  quiz1: number;
  quiz2: number;
  quiz3: number;
  quiz4: number;
  quiz5: number;
}

export interface QuizRecordListItem {
  createdAt: string;
  average: number;
  quizRecordId: number;
}

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

export interface AIAnalysisItem {
  content: string;
}

// ===== 마이페이지 관련 타입 =====
export interface MyPageResponse {
  name: string;
  profile: string;
  allTime: string;
  allCnt: number;
}

// ===== 레거시 호환 타입 =====
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