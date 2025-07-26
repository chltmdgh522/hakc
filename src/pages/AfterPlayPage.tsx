import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Home } from "lucide-react";
import ProgressBar from '@ramonak/react-progress-bar';
import backgroundImg from "../assets/LastPage/배경.png";
import cardBackgroundImg from "../assets/마지막카드.png";
import SettingsModal from "../components/SettingsModal";
import RecordPage from "./RecordPage";
import { api } from "../utils/apiClient";
import { QuizEndingResponse } from "../types/api";

interface GameResult {
  playTime: string; // "00:00:00" 형식
  quizScores: {
    quiz1: number;
    quiz2: number;
    quiz3: number;
    quiz4: number;
    quiz5: number;
  };
  totalScore: number; // 총점
}

interface AfterPlayPageProps {
  onComplete?: () => void;
  onGoHome?: () => void;
  gameResult?: GameResult;
  sessionId?: string;
  quizRecordId?: number;
}

const AfterPlayPage: React.FC<AfterPlayPageProps> = ({ 
  onComplete, 
  onGoHome, 
  gameResult,
  sessionId,
  quizRecordId
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showRecordPage, setShowRecordPage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiGameResult, setApiGameResult] = useState<GameResult>({
    playTime: "00:00:00",
    quizScores: {
      quiz1: 0,
      quiz2: 0,
      quiz3: 0,
      quiz4: 0,
      quiz5: 0
    },
    totalScore: 0
  });

  console.log('AfterPlayPage 렌더링, onGoHome:', onGoHome, 'quizRecordId:', quizRecordId, 'sessionId:', sessionId);

  // API에서 퀴즈 엔딩 데이터 가져오기
  useEffect(() => {
    const fetchQuizEnding = async () => {
      if (!quizRecordId) {
        console.log('quizRecordId가 없어서 테스트 데이터 사용');
        // 테스트 데이터로 API 응답 시뮬레이션
        const testResponse = {
          allTime: "PT6M20S",
          quiz1: 2,
          quiz2: 3,
          quiz3: 3,
          quiz4: 4,
          quiz5: 0
        };
        
        console.log('테스트 데이터 사용:', testResponse);
        
        // PT6M20S 형식을 00:00:00 형식으로 변환
        const formatTime = (duration: string): string => {
          console.log('시간 형식 변환 입력:', duration);
          
          // ISO 8601 Duration 형식 파싱 (PT6M20S, PT1H30M45S 등)
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (!match) {
            console.log('시간 형식 파싱 실패, 기본값 반환');
            return "00:00:00";
          }
          
          const hours = parseInt(match[1] || "0");
          const minutes = parseInt(match[2] || "0");
          const seconds = parseInt(match[3] || "0");
          
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          console.log('변환된 시간:', formattedTime);
          
          return formattedTime;
        };
        
        // 퀴즈별 점수 처리
        const quizScores = {
          quiz1: testResponse.quiz1,
          quiz2: testResponse.quiz2,
          quiz3: testResponse.quiz3,
          quiz4: testResponse.quiz4,
          quiz5: testResponse.quiz5
        };
        
        // 총점 계산
        const totalScore = testResponse.quiz1 + testResponse.quiz2 + testResponse.quiz3 + testResponse.quiz4 + testResponse.quiz5;
        
        const result: GameResult = {
          playTime: formatTime(testResponse.allTime),
          quizScores,
          totalScore
        };
        
        console.log('테스트 데이터로 변환된 게임 결과:', result);
        setApiGameResult(result);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('퀴즈 엔딩 API 호출:', `/api/record/ending/${quizRecordId}`);
        const response: QuizEndingResponse = await api.get(`/api/record/ending/${quizRecordId}`);
        
        console.log('퀴즈 엔딩 전체 API 응답:', response);
        console.log('API 응답 타입:', typeof response);
        console.log('API 응답 키들:', Object.keys(response));
        
        // PT6M20S 형식을 00:00:00 형식으로 변환
        const formatTime = (duration: string): string => {
          console.log('시간 형식 변환 입력:', duration);
          
          // ISO 8601 Duration 형식 파싱 (PT6M20S, PT1H30M45S 등)
          const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (!match) {
            console.log('시간 형식 파싱 실패, 기본값 반환');
            return "00:00:00";
          }
          
          const hours = parseInt(match[1] || "0");
          const minutes = parseInt(match[2] || "0");
          const seconds = parseInt(match[3] || "0");
          
          const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          console.log('변환된 시간:', formattedTime);
          
          return formattedTime;
        };
        
        console.log('퀴즈 엔딩 시간 데이터:', {
          originalTime: response.allTime,
          formattedTime: formatTime(response.allTime)
        });
        console.log('개별 퀴즈 점수:', {
          quiz1: response.quiz1,
          quiz2: response.quiz2,
          quiz3: response.quiz3,
          quiz4: response.quiz4,
          quiz5: response.quiz5
        });
        
        // 퀴즈별 점수 처리
        const quizScores = {
          quiz1: response.quiz1,
          quiz2: response.quiz2,
          quiz3: response.quiz3,
          quiz4: response.quiz4,
          quiz5: response.quiz5
        };
        
        // 총점 계산
        const totalScore = response.quiz1 + response.quiz2 + response.quiz3 + response.quiz4 + response.quiz5;
        
        const result: GameResult = {
          playTime: formatTime(response.allTime),
          quizScores,
          totalScore
        };
        
        console.log('변환된 게임 결과:', result);
        setApiGameResult(result);
        
      } catch (err) {
        console.error('퀴즈 엔딩 API 호출 실패:', err);
        console.error('에러 상세:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          quizRecordId,
          url: `/api/record/ending/${quizRecordId}`
        });
        setError(`게임 결과를 불러오는데 실패했습니다. (ID: ${quizRecordId})`);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizEnding();
  }, [quizRecordId]);

  const handleViewResults = () => {
    setShowRecordPage(true);
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  const handleSettingsToggle = () => {
    setShowSettings(!showSettings);
  };

  // 최종 게임 결과 결정 (API 데이터 우선, 없으면 props 데이터, 없으면 기본값)
  const finalGameResult = apiGameResult.totalScore > 0 ? apiGameResult : (gameResult || {
    playTime: "00:00:00",
    quizScores: {
      quiz1: 0,
      quiz2: 0,
      quiz3: 0,
      quiz4: 0,
      quiz5: 0
    },
    totalScore: 0
  });

  if (showRecordPage) {
    return <RecordPage onBack={() => setShowRecordPage(false)} />;
  }

  if (showSettings) {
    return <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-blue-800">퀴즈 결과를 불러오는 중...</p>
          <p className="text-sm text-blue-600 mt-2">API: /api/record/ending/{quizRecordId}</p>
          <p className="text-sm text-blue-600">quizRecordId: {quizRecordId || '없음'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          height: '100vh'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 설정 버튼 - 우상단 */}
        <motion.button
          onClick={handleSettingsToggle}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors z-50 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ pointerEvents: 'auto' }}
        >
          <Settings className="w-6 h-6 text-white" />
        </motion.button>

        {/* 홈 버튼 - 좌상단 */}
        <motion.button
          onClick={handleGoHome}
          className="absolute top-6 left-6 p-3 rounded-full bg-white/30 hover:bg-white/50 transition-colors z-50 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ pointerEvents: 'auto' }}
        >
          <Home className="w-6 h-6 text-white" />
        </motion.button>

        {/* 메인 결과 카드 */}
        <div className="absolute inset-0 flex items-center justify-center px-4 z-20" style={{ paddingTop: '10vh' }}>
          <motion.div 
            className="relative max-w-sm w-full flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* PNG 이미지 전체 표시 */}
            <img 
              src={cardBackgroundImg} 
              alt="결과 카드" 
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
            
            {/* 오버레이 컨테이너 */}
            <div className="absolute inset-0 flex flex-col items-center justify-between px-8 py-8 z-30">
              {/* 플레이 시간 - 고정 위치 */}
              <motion.div 
                className="flex flex-col items-center justify-center mb-6 mt-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="text-center mb-2">
                  <span className="text-[20px] font-bold text-black">플레이 시간</span>
                </div>
                <div className="bg-[#FFF2B8] rounded-lg p-2 border-2 border-white shadow-sm flex items-center justify-center min-w-[140px]">
                  <span className="text-[20px] font-bold text-black">
                    {finalGameResult.playTime}
                  </span>
                </div>
              </motion.div>
              
              {/* 퀴즈별 점수 게이지바 */}
              <motion.div 
                className="flex flex-col items-center justify-center flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                                  <div className="text-center mb-4">
                    <span className="text-[18px] font-bold text-black">퀴즈별 점수</span>
                  </div>
                
                {/* 게이지바 컨테이너 */}
                <div className="w-full space-y-4 relative z-40">
                  {[1, 2, 3, 4, 5].map((quizNumber, index) => {
                    const quizScore = finalGameResult.quizScores?.[`quiz${quizNumber}`] || 0;
                    const maxScore = 5;
                    const percentage = Math.max(0, Math.min(100, (quizScore / maxScore) * 100));
                    
                    return (
                      <motion.div
                        key={quizNumber}
                        className="flex items-center space-x-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <div className="w-1 text-center">
                          <span className="text-[18px] font-bold text-black">{quizNumber}</span>
                        </div>
                        <div className="flex-1 bg-gray-300 rounded-full h-8 overflow-hidden relative z-50 border border-gray-400" style={{ minHeight: '12px', minWidth: '200px' }}>
                          <motion.div
                            className="h-full bg-gray-600 rounded-full relative z-60"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
              
              {/* 결과 보러가기 버튼 - 고정 위치 */}
              <motion.div 
                className="flex items-center justify-center w-full mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <motion.button
                  onClick={handleViewResults}
                  className="w-full bg-[#FFF2B8] text-black font-bold py-3 px-4 rounded-lg border-2 border-white shadow-sm flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }}
                  whileTap={{ 
                    scale: 0.95,
                    y: 0
                  }}
                  animate={{
                    y: [0, -3, 0]
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <span className="text-[18px] font-bold">결과 보러 가기</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AfterPlayPage; 