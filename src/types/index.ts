// 공통 타입 정의

export interface QuizData {
  id: number;
  questionImage: string;
  correctAnswer: string;
  choices: string[];
}

export interface QuizObject {
  id: number;
  image: string;
  name?: string;
  position?: string;
}

export interface RecordData {
  session: number;
  score: number;
  date: string;
}

export interface RecordDetail {
  nickname: string;
  date: string;
  playTime: string;
  crowns: number;
  scores: {
    [key: string]: number;
  };
}

export interface AnalysisContent {
  title: string;
  content: string;
}

// 인증 관련 타입 - api.ts에서 재export
export type { AuthUser, AuthToken, LoginResponse } from './api';

// 컴포넌트 Props 타입들
export interface PageProps {
  onBack?: () => void;
  onComplete?: () => void;
  onGoHome?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// 애니메이션 관련 타입
export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 게임 상태 타입
export interface GameState {
  currentQuest: number;
  score: number;
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

// 사용자 정보 타입
export interface UserInfo {
  id: string;
  nickname: string;
  playCount: number;
  totalPlayTime: string;
  lastPlayDate?: string;
} 