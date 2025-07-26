import React, { useState } from "react";
import FadeOutCircle from "../components/FadeOutCircle";
import NicknamePage from "./NicknamePage";
import WelcomeShatteredPage from "./WelcomeShatteredPage";
import QuestAcceptPage from "./QuestAcceptPage";
import CrownShinePage from "./CrownShinePage";
import Quest1 from "./Quest1";
import Q1SuccessPage from "./Q1SuccessPage";
import Quest2 from "./Quest2";
import Q2SuccessPage from "./Q2SuccessPage";
import Quest3 from "./Quest3";
import Q3SuccessPage from "./Q3SuccessPage";
import Quest4 from "./Quest4";
import Q4SuccessPage from "./Q4SuccessPage";
import Quest5 from "./Quest5";
import AfterSuccessPage from "./AfterSuccessPage";
import AfterPlayPage from "./AfterPlayPage";
import RecordPage from "./RecordPage";
import bgImg from "../assets/KakaoLoginPage/main.png";
import logoImg from "../assets/KakaoLoginPage/logo.png";
import adventureBtn from "../assets/KakaoLoginPage/버튼_모험떠나기.png";
import recordBtn from "../assets/KakaoLoginPage/버튼_나의기록보기.png";
import MyPage from "./MyPage";
import page2Icon from "../assets/Button/page2.png";
import SettingsIcon from "../components/SettingsIcon";
import SettingsModal from "../components/SettingsModal";
import { motion } from "framer-motion";
import { QuizService } from "../services/quizService";
import { AuthService } from "../services/authService";

// 버튼 원본 비율: 628x220, 박스: 375x812
const BUTTON_WIDTH_PCT = 312 / 375 * 100; // 약 83.2%
const BUTTON_ASPECT = 628 / 220; // 약 2.854
// 위치: 상단에서부터 %
const ADVENTURE_TOP_PCT = 66; // 첫 버튼
const BUTTON_HEIGHT_PCT = (220 / 812) * 100 * (312 / 628); // 실제 박스 기준 버튼 높이 %
const GAP_PCT = 2.5; // 버튼 사이 여백(%) - 원하는 만큼 조정

const RECORD_TOP_PCT = ADVENTURE_TOP_PCT + BUTTON_HEIGHT_PCT + GAP_PCT;

const FirstScreenPage: React.FC = () => {
  const [step, setStep] = useState<'login' | 'fade' | 'nickname' | 'welcome' | 'shattered' | 'questAccept' | 'crownShine' | 'record' | 'quest1' | 'q1Success' | 'quest2' | 'q2Success' | 'quest3' | 'q3Success' | 'quest4' | 'q4Success' | 'quest5' | 'afterSuccess' | 'finalMessage' | 'mypage'>('login');
  const [nickname, setNickname] = useState<string>('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // 퀴즈 상태 정보 저장
  const [quizStatusInfo, setQuizStatusInfo] = useState<{
    quizId: number | null;
    quizRecordId: number | null;
    imageId: number | null;
    imageUrl: string | null;
    audioUrl: string | null;
    quizNumber: number | null;
  } | null>(null);
  const [isQuizStatusLoading, setIsQuizStatusLoading] = useState(false);

  // localStorage에서 quizRecordId 불러오기
  const getStoredQuizRecordId = (): number | null => {
    try {
      const stored = localStorage.getItem('quizRecordId');
      return stored ? parseInt(stored, 10) : null;
    } catch (error) {
      console.error('localStorage에서 quizRecordId 불러오기 실패:', error);
      return null;
    }
  };

  // localStorage에 quizRecordId 저장하기
  const setStoredQuizRecordId = (quizRecordId: number | null) => {
    try {
      if (quizRecordId) {
        localStorage.setItem('quizRecordId', quizRecordId.toString());
        console.log('localStorage에 quizRecordId 저장:', quizRecordId);
      } else {
        localStorage.removeItem('quizRecordId');
        console.log('localStorage에서 quizRecordId 제거');
      }
    } catch (error) {
      console.error('localStorage에 quizRecordId 저장 실패:', error);
    }
  };

  // 퀴즈 상태 확인 및 적절한 페이지로 이동하는 함수
  const handleQuizStatusCheck = async () => {
    console.log('퀴즈 상태 확인 시작!');
    setIsQuizStatusLoading(true);
    
    try {
      console.log('백엔드에 퀴즈 상태 확인 요청 중...');
      const quizStatus = await QuizService.checkStatus();
      
      if (quizStatus) {
        console.log('퀴즈 상태 확인 성공!', quizStatus);
        
        // localStorage에서 저장된 quizRecordId 확인
        const storedQuizRecordId = getStoredQuizRecordId();
        console.log('localStorage에서 불러온 quizRecordId:', storedQuizRecordId);
        
        // 백엔드 응답의 quizRecordId가 있으면 저장, 없으면 저장된 값 사용
        const finalQuizRecordId = quizStatus.quizRecordId || storedQuizRecordId;
        
        // 퀴즈 상태 정보 저장
        const updatedQuizStatusInfo = {
          quizId: quizStatus.quizId,
          quizRecordId: finalQuizRecordId,
          imageId: quizStatus.imageId,
          imageUrl: quizStatus.imageUrl,
          audioUrl: quizStatus.audioUrl,
          quizNumber: quizStatus.quizNumber
        };
        
        setQuizStatusInfo(updatedQuizStatusInfo);
        
        // quizRecordId가 있으면 localStorage에 저장
        if (finalQuizRecordId) {
          setStoredQuizRecordId(finalQuizRecordId);
        }
        
        if (quizStatus.isStatus) {
          console.log('새로운 퀴즈 시작 - 닉네임 입력 단계로 이동');
          setStep('nickname');
        } else {
          console.log('기존 퀴즈 진행 중 - 퀴즈', quizStatus.quizNumber, '번으로 이동');
          // 기존 퀴즈가 진행 중이면 해당 퀴즈로 바로 이동
          if (quizStatus.quizNumber === 1) setStep('quest1');
          else if (quizStatus.quizNumber === 2) setStep('quest2');
          else if (quizStatus.quizNumber === 3) setStep('quest3');
          else if (quizStatus.quizNumber === 4) setStep('quest4');
          else if (quizStatus.quizNumber === 5) setStep('quest5');
          else setStep('nickname'); // 기본값
        }
      } else {
        console.error('퀴즈 상태 확인 실패');
        console.log('실패했지만 새로운 퀴즈로 시작합니다...');
        setStep('nickname');
      }
    } catch (error) {
      console.error('퀴즈 상태 확인 중 네트워크 오류:', error);
      console.log('오류 발생했지만 새로운 퀴즈로 시작합니다...');
      setStep('nickname');
    } finally {
      setIsQuizStatusLoading(false);
    }
  };

  if (step === 'mypage') {
    return <MyPage onBack={() => setStep('login')} />;
  }
  if (step === 'fade') {
    return (
      <FadeOutCircle image={bgImg} duration={1200} onComplete={() => setStep('nickname')} />
    );
  }
  if (step === 'nickname') {
    return <NicknamePage 
      onComplete={async (name) => {
        console.log('닉네임 입력 완료:', name);
        
        try {
          console.log('백엔드에 닉네임 수정 요청 전송 중...');
          const success = await AuthService.updateNickname(name);
          
          if (success) {
            console.log('닉네임 수정 성공! 백엔드 응답: OK');
            console.log('환영 페이지로 이동...');
            setNickname(name);
            setStep('welcome');
          } else {
            console.error('닉네임 수정 실패 - 백엔드 응답: 실패');
            console.log('실패했지만 계속 진행합니다...');
            setNickname(name);
            setStep('welcome');
          }
        } catch (error) {
          console.error('닉네임 수정 중 네트워크 오류:', error);
          console.log('오류 발생했지만 계속 진행합니다...');
          setNickname(name);
          setStep('welcome');
        }
      }} 
      onBack={() => setStep('login')}
    />;
  }
  if (step === 'welcome') {
    return <WelcomeShatteredPage nickname={nickname} onNext={() => setStep('questAccept')} />;
  }
  if (step === 'questAccept') {
    return <QuestAcceptPage onAccept={async () => {
      console.log('퀘스트 수락 버튼 클릭 - 퀴즈 상태 업데이트 후 튜토리얼로 이동');
      
      // 퀴즈 상태를 새로고침하여 최신 정보 가져오기
      try {
        const quizStatus = await QuizService.checkStatus();
        if (quizStatus) {
          console.log('퀘스트 수락 후 퀴즈 상태 업데이트 성공:', quizStatus);
          setQuizStatusInfo({
            quizId: quizStatus.quizId,
            quizRecordId: quizStatus.quizRecordId,
            imageId: quizStatus.imageId,
            imageUrl: quizStatus.imageUrl,
            audioUrl: quizStatus.audioUrl,
            quizNumber: quizStatus.quizNumber
          });
        }
      } catch (error) {
        console.error('퀘스트 수락 후 퀴즈 상태 업데이트 실패:', error);
      }
      
      setStep('crownShine');
    }} />;
  }
  if (step === 'crownShine') {
    return <CrownShinePage onGoToQuest1={() => setStep('quest1')} />;
  }
  if (step === 'record') {
    return <RecordPage onBack={() => setStep('login')} />;
  }
  if (step === 'quest1') {
    // 퀴즈 상태 로딩 중이면 로딩 화면 표시
    if (isQuizStatusLoading) {
      return (
        <div
          className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">퀴즈 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    
    return <Quest1 
      quizStatusInfo={quizStatusInfo}
      onAnswer={(answer) => {
        if (answer === '무서워요') {
          setStep('q1Success');
        }
      }} 
      onNext={() => setStep('quest2')} 
    />;
  }
  if (step === 'q1Success') {
    return <Q1SuccessPage onNext={() => setStep('quest2')} />;
  }
  if (step === 'quest2') {
    // 퀴즈 상태 로딩 중이면 로딩 화면 표시
    if (isQuizStatusLoading) {
      return (
        <div
          className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">퀴즈 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    
    return <Quest2 
      quizStatusInfo={quizStatusInfo}
      onAnswer={(answer) => {
        if (answer === 'cat') {
          setStep('q2Success');
        }
      }} 
      onNext={() => setStep('quest3')} 
    />;
  }
  if (step === 'q2Success') {
    return <Q2SuccessPage onNext={() => setStep('quest3')} />;
  }
  if (step === 'quest3') {
    // 퀴즈 상태 로딩 중이면 로딩 화면 표시
    if (isQuizStatusLoading) {
      return (
        <div
          className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">퀴즈 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    
    return <Quest3 
      quizStatusInfo={quizStatusInfo}
      onAnswer={(answer) => {
        // 정답 여부는 Quest3 내부에서 처리하므로 여기서는 아무것도 하지 않음
      }} 
      onNext={() => setStep('quest4')} 
    />;
  }
  if (step === 'q3Success') {
    return <Q3SuccessPage onNext={() => setStep('quest4')} />;
  }
  if (step === 'quest4') {
    // 퀴즈 상태 로딩 중이면 로딩 화면 표시
    if (isQuizStatusLoading) {
      return (
        <div
          className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">퀴즈 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    
    return <Quest4 
      quizStatusInfo={quizStatusInfo}
      onAnswer={(answer) => {
        // 정답 여부는 Quest4 내부에서 처리하므로 여기서는 아무것도 하지 않음
      }} 
      onNext={() => setStep('quest5')} 
    />;
  }
  if (step === 'q4Success') {
    return <Q4SuccessPage onNext={() => setStep('quest5')} />;
  }
  if (step === 'quest5') {
    // 퀴즈 상태 로딩 중이면 로딩 화면 표시
    if (isQuizStatusLoading) {
      return (
        <div
          className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${bgImg})` }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-semibold">퀴즈 정보를 불러오는 중...</p>
          </div>
        </div>
      );
    }
    
    return <Quest5 
      quizStatusInfo={quizStatusInfo}
      onAnswer={(answer) => {
        // 정답 여부는 Quest5 내부에서 처리하므로 여기서는 아무것도 하지 않음
      }} 
      onNext={() => {
        console.log('FirstScreenPage: Quest5 완료, afterSuccess로 이동');
        setStep('afterSuccess');
      }} 
    />;
  }
  if (step === 'afterSuccess') {
    return <AfterSuccessPage 
      onComplete={() => {
        console.log('AfterSuccess 완료');
        // 퀴즈 완료 시 localStorage에서 quizRecordId 제거
        setStoredQuizRecordId(null);
      }} 
      onGoHome={() => {
        console.log('홈으로 이동');
        // 홈으로 이동할 때도 localStorage에서 quizRecordId 제거
        setStoredQuizRecordId(null);
        setStep('login');
      }} 
    />;
  }
  if (step === 'finalMessage') {
    return <AfterPlayPage 
      onComplete={() => {
        console.log('FinalMessage 완료');
        // 퀴즈 완료 시 localStorage에서 quizRecordId 제거
        setStoredQuizRecordId(null);
      }} 
      onGoHome={() => {
        console.log('홈으로 이동');
        // 홈으로 이동할 때도 localStorage에서 quizRecordId 제거
        setStoredQuizRecordId(null);
        setStep('login');
      }} 
    />;
  }
  // 첫 화면: 배경+버튼 2개 + 마이페이지 아이콘
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 0,
        overflow: "hidden"
      }}
      onMouseMove={(e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }}
    >
      {/* 좌상단 설정 아이콘 */}
      <SettingsIcon
        onClick={() => setIsSettingsModalOpen(true)}
        variant="colored"
        position={{ x: 24, y: 24 }}
      />
      
      {/* 우상단 마이페이지 아이콘 */}
      <img
        src={page2Icon}
        alt="마이페이지"
        style={{
          position: "absolute",
          right: 24,
          top: 24,
          width: 20,
          height: 20,
          cursor: "pointer",
          zIndex: 10
        }}
        onClick={() => setStep('mypage')}
        draggable={false}
      />
      
      {/* 로고 */}
      <motion.div
        style={{
          position: "absolute",
          left: "20px",
          top: "69px",
          zIndex: 5
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: [-180, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
          times: [0, 0.7, 1]
        }}
      >
        <motion.img
          src={logoImg}
          alt="마음 탐험대"
          style={{
            width: "336px",
            height: "auto",
            filter: "drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
            animation: "bounce 2.2s infinite, glow 5s infinite"
          }}
          draggable={false}
          animate={{
            filter: [
              "drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
              "drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))",
              "drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))"
            ],
            y: [0, -10, 0, -5, 0]
          }}
          transition={{
            filter: {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      </motion.div>
      
      {/* 텍스트 */}
      <motion.div
        style={{
          position: "absolute",
          left: "37px",
          top: "310px",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)",
          zIndex: 5,
          fontFamily: "Noto Sans KR, sans-serif"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.2,
          ease: "easeOut"
        }}
      >
        선택받은 자의 모험이 시작된다
      </motion.div>
      
      {/* 반짝이는 별들 */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="star"
          style={{
            position: "absolute",
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: "rgba(255, 215, 0, 0.8)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}

      {/* 포탈 효과 - 중앙 원형 그라데이션 */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.15) 30%, rgba(255, 140, 0, 0.1) 60%, transparent 100%)",
          zIndex: 2,
          pointerEvents: "none"
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* 포탈 효과 - 작은 원들 */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`portal-${i}`}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: `${120 + i * 40}px`,
            height: `${120 + i * 40}px`,
            borderRadius: "50%",
            border: `1px solid rgba(255, 215, 0, ${0.2 - i * 0.03})`,
            zIndex: 2,
            pointerEvents: "none"
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}

      {/* 마법 입자 효과 */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          style={{
            position: "absolute",
            width: "2px",
            height: "2px",
            backgroundColor: "rgba(255, 215, 0, 0.8)",
            borderRadius: "50%",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 3,
            pointerEvents: "none"
          }}
          animate={{
            y: [0, -80, -160],
            x: [0, Math.random() * 60 - 30],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            repeat: Infinity,
            delay: Math.random() * 1.5
          }}
        />
      ))}

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.4));
            }
          }

          @keyframes twinkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .star {
            animation: twinkle 1.8s infinite;
          }
        `}
      </style>
      
      {/* 모험떠나기 버튼 */}
      <motion.img
        src={adventureBtn}
        alt="모험떠나기"
        style={{
          position: "absolute",
          left: "38px",
          top: "538px",
          width: "300px",
          height: "auto",
          cursor: "pointer",
          userSelect: "none"
        }}
        draggable={false}
        onClick={() => {
          console.log('모험 떠나기 버튼 클릭 - 퀴즈 상태 확인 시작');
          handleQuizStatusCheck();
        }}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.2,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.03,
          filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
          y: -2
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0
        }}
      />
      
      {/* 나의 기록보기 버튼 */}
      <motion.img
        src={recordBtn}
        alt="나의 기록보기"
        style={{
          position: "absolute",
          left: "38px",
          top: "659px",
          width: "300px",
          height: "auto",
          cursor: "pointer",
          userSelect: "none"
        }}
        draggable={false}
        onClick={() => setStep('record')}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 1.5,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.03,
          filter: "brightness(1.1) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))",
          y: -2
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0
        }}
      />
      
      {/* 마우스 커서 빛 효과 */}
      <motion.div
        style={{
          position: "fixed",
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen"
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};

export default React.memo(FirstScreenPage); 