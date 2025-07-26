// 게임 결과 데이터 인터페이스
export interface GameResult {
  playTime: string; // "00:00:00" 형식
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  score: number; // 0-100 점수
}

// 백엔드에서 받아온 원시 데이터를 GameResult 형식으로 변환
export const formatGameResult = (rawData: any): GameResult => {
  return {
    playTime: formatPlayTime(rawData.playTimeSeconds || 0),
    correctCount: rawData.correctCount || 0,
    wrongCount: rawData.wrongCount || 0,
    totalQuestions: rawData.totalQuestions || 10,
    score: calculateScore(rawData.correctCount || 0, rawData.totalQuestions || 10)
  };
};

// 초 단위를 "HH:MM:SS" 형식으로 변환
export const formatPlayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 점수 계산 (0-100점)
export const calculateScore = (correctCount: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
};

// 별점 계산 (점수 기반)
export const getStarRating = (score: number): number => {
  if (score >= 90) return 3;
  if (score >= 70) return 2;
  if (score >= 50) return 1;
  return 0;
};

// 성취도 메시지
export const getAchievementMessage = (score: number): string => {
  if (score >= 90) return "완벽한 감정 마스터!";
  if (score >= 70) return "훌륭한 감정 탐험가!";
  if (score >= 50) return "좋은 감정 여행!";
  return "다음엔 더 잘할 수 있어요!";
};

// 성취도 색상
export const getAchievementColor = (score: number): string => {
  if (score >= 90) return "#fbbf24"; // gold
  if (score >= 70) return "#34d399"; // green
  if (score >= 50) return "#60a5fa"; // blue
  return "#f87171"; // red
};

// 차트 데이터 생성
export const generateChartData = (correctCount: number, wrongCount: number) => {
  return [
    { name: '정답', value: correctCount, color: '#4ade80' },
    { name: '오답', value: wrongCount, color: '#f87171' }
  ];
}; 