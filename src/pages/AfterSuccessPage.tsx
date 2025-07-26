import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeOutCircle from "../components/FadeOutCircle";
import AfterPlayPage from "./AfterPlayPage";
import { endQuiz } from "../utils/gameApi";
import backgroundImg from "../assets/폭죽_배경.png";
import ment1Img from "../assets/마무리멘트1.png";
import ment2Img from "../assets/마무리멘트_2.png";
import ment3Img from "../assets/마무리멘트_3.png";

interface AfterSuccessPageProps {
  onComplete?: () => void;
  onGoHome?: () => void;
  gameResult?: any;
  quizRecordId?: string; // 퀴즈 기록 ID 추가
}

const AfterSuccessPage: React.FC<AfterSuccessPageProps> = ({ 
  onComplete, 
  onGoHome,
  gameResult,
  quizRecordId
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showFadeIn, setShowFadeIn] = useState(false);
  const [showAfterPlay, setShowAfterPlay] = useState(false);

  const messages = [
    {
      image: ment1Img,
      text: "당신의 여정 덕분에\n이 세계는 다시 감정을\n되찾았습니다."
    },
    {
      image: ment2Img,
      text: "이제 당신은 현실에서도\n감정을 더 잘 느끼고,\n표현할 수 있을 거예요."
    },
    {
      image: ment3Img,
      text: "우리의 감정은 언제나\n옆에 있어요.\n꼭 기억해 주세요."
    }
  ];

  useEffect(() => {
    // 자동 전환 제거 - 클릭으로만 전환
  }, []);

  const handleNextMessage = async () => {
    console.log('AfterSuccessPage: handleNextMessage 호출됨, currentStep:', currentStep);
    if (currentStep < messages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 메시지 후 퀴즈 종료 API 호출
      console.log('AfterSuccessPage: 마지막 메시지 완료, 퀴즈 종료 API 호출');
      
      if (quizRecordId) {
        try {
          console.log('퀴즈 종료 API 호출 중... quizRecordId:', quizRecordId);
          const endingResult = await endQuiz(quizRecordId);
          
          if (endingResult) {
            console.log('퀴즈 종료 성공:', endingResult);
          } else {
            console.error('퀴즈 종료 실패');
          }
        } catch (error) {
          console.error('퀴즈 종료 API 호출 중 오류:', error);
        }
      }
      
      // FadeInCircle 효과 시작
      console.log('AfterSuccessPage: FadeInCircle 시작');
      setShowFadeIn(true);
    }
  };

  const handleFadeInComplete = () => {
    console.log('AfterSuccessPage: FadeInCircle 완료, AfterPlayPage 시작');
    setShowAfterPlay(true);
  };

  console.log('AfterSuccessPage 렌더링:', { currentStep, showFadeIn, showAfterPlay });

  if (showAfterPlay) {
    return <AfterPlayPage 
      onComplete={onComplete} 
      onGoHome={onGoHome} 
      gameResult={gameResult} 
      quizRecordId={quizRecordId ? parseInt(quizRecordId) : undefined}
    />;
  }

  if (showFadeIn) {
    return <FadeOutCircle image={backgroundImg} duration={2000} onComplete={handleFadeInComplete} />;
  }

  return (
    <div
      className="relative w-full h-full bg-cover bg-center overflow-hidden cursor-pointer"
      style={{ backgroundImage: `url(${backgroundImg})` }}
      onClick={handleNextMessage}
    >
      {/* 클릭 안내 텍스트 - 맨 위에 배치 (깜빡이는 효과) */}
      <motion.div
        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-sm bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
          클릭하여 다음으로
        </div>
      </motion.div>

      {/* 폭죽 효과 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ff8b94'][i % 8],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, window.innerHeight],
              x: [0, (Math.random() - 0.5) * 300],
              rotate: [0, 720],
              scale: [1, 0.5, 1.5, 0],
              opacity: [1, 0.8, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* 메시지 표시 - 지정된 위치에 배치 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          className="absolute"
          style={{
            left: '30px',
            top: '596px',
            width: '316px'
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ 
            duration: 0.6, 
            ease: "easeInOut"
          }}
        >
          <img 
            src={messages[currentStep].image} 
            alt={`메시지 ${currentStep + 1}`}
            className="w-full h-auto drop-shadow-lg"
          />
        </motion.div>
      </AnimatePresence>

      {/* 진행 표시기 - 점 3개 (텍스트 박스 아래) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2" style={{ top: 'calc(596px + 200px)' }}>
        {messages.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index <= currentStep ? 'bg-white' : 'bg-white/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              boxShadow: index === currentStep ? "0 0 8px rgba(255,255,255,0.8)" : "none"
            }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AfterSuccessPage; 