import React, { useEffect, useState, useRef } from "react";
import { fetchQuizData, checkQuizAnswer, retryQuiz, QuizData } from "../utils/gameApi";
import ChoiceButton from "../components/ChoiceButton";
import Q1SuccessPage from "./Q1SuccessPage";
import DialogBox from "../components/DialogBox";
import bg5 from "../assets/5_배경.png";
import quiz1_1 from "../assets/Quiz_1/Quiz1-1_기뻐요.png";
import quiz1_2 from "../assets/Quiz_1/Quiz1-2_슬퍼요.png";
import quiz1_3 from "../assets/Quiz_1/Quiz1-3_화나요.png";
import quiz1_4 from "../assets/Quiz_1/Quiz1-4_무서워요.png";
import quiz1_5 from "../assets/Quiz_1/Quiz1-5_오답.png";
import quiz1_6 from "../assets/Quiz_1/Quiz1-6_정답.png";

interface Quest1Props {
  onAnswer?: (answer: string) => void;
  onComplete?: (score: number) => void;
  onNext?: () => void;
  quizStatusInfo?: {
    quizId: number | null;
    quizRecordId: number | null;
    imageId: number | null;
    imageUrl: string | null;
    audioUrl: string | null;
    quizNumber: number | null;
  } | null;
}

const Quest1: React.FC<Quest1Props> = ({ 
  onAnswer, 
  onComplete, 
  onNext,
  quizStatusInfo
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showSuccessPage, setShowSuccessPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [answeredQuizImageUrl, setAnsweredQuizImageUrl] = useState<string | null>(null);
  const hasLoadedQuiz = useRef(false);

  // 이미지 URL에 따라 정답을 동적으로 판단하는 함수
  const getCorrectAnswerFromImageUrl = (imageUrl: string): string => {
    console.log('Quest1: 정답 판단 - 이미지 URL:', imageUrl);
    
    if (imageUrl.includes('Quiz1-1_기뻐요') || imageUrl.includes('quiz1_1')) {
      console.log('Quest1: 정답 판단 결과 - 기뻐요');
      return "기뻐요";
    }
    if (imageUrl.includes('Quiz1-2_슬퍼요') || imageUrl.includes('quiz1_2')) {
      console.log('Quest1: 정답 판단 결과 - 슬퍼요');
      return "슬퍼요";
    }
    if (imageUrl.includes('Quiz1-3_화나요') || imageUrl.includes('quiz1_3')) {
      console.log('Quest1: 정답 판단 결과 - 화나요');
      return "화나요";
    }
    if (imageUrl.includes('Quiz1-4_무서워요') || imageUrl.includes('quiz1_4')) {
      console.log('Quest1: 정답 판단 결과 - 무서워요');
      return "무서워요";
    }
    
    console.log('Quest1: 정답 판단 결과 - 기본값 기뻐요');
    return "기뻐요"; // 기본값
  };

  // imageId에 따라 정답을 판단하는 함수 (더 정확할 수 있음)
  const getCorrectAnswerFromImageId = (imageId: number): string => {
    console.log('Quest1: 정답 판단 - imageId:', imageId);
    
    switch (imageId) {
      case 1:
        console.log('Quest1: 정답 판단 결과 - 기뻐요 (imageId: 1)');
        return "기뻐요";
      case 2:
        console.log('Quest1: 정답 판단 결과 - 슬퍼요 (imageId: 2)');
        return "슬퍼요";
      case 3:
        console.log('Quest1: 정답 판단 결과 - 화나요 (imageId: 3)');
        return "화나요";
      case 4:
        console.log('Quest1: 정답 판단 결과 - 무서워요 (imageId: 4)');
        return "무서워요";
      default:
        console.log('Quest1: 정답 판단 결과 - 기본값 기뻐요 (imageId:', imageId, ')');
        return "기뻐요";
    }
  };

  // UI용 데이터 (동적으로 정답 설정)
  const uiData = {
    question: "이 표정은 어떤 감정일까요?",
    options: ["기뻐요", "슬퍼요", "화나요", "무서워요"],
    get correctAnswer() {
      return currentQuiz ? getCorrectAnswerFromImageUrl(currentQuiz.imageUrl) : "기뻐요";
    }
  };

  // 퀴즈 이미지 매핑
  const quizImages = {
    "기뻐요": quiz1_1,
    "슬퍼요": quiz1_2,
    "화나요": quiz1_3,
    "무서워요": quiz1_4
  };

  // 컴포넌트 마운트 시 퀴즈 데이터 로드
  useEffect(() => {
    // quizStatusInfo가 없으면 기본 데이터로 시작
    if (!quizStatusInfo) {
      console.log('Quest1: quizStatusInfo가 없음, 기본 데이터로 시작');
      setCurrentQuiz({
        quizId: 1,
        quizRecordId: 0,
        imageId: 1,
        imageUrl: quiz1_1,
        audioUrl: ""
      });
      setStartTime(new Date());
      setIsLoading(false);
      return;
    }

    // 이미 로드된 경우 중복 호출 방지
    if (hasLoadedQuiz.current) {
      return;
    }
    
    const loadQuizData = async () => {
      console.log('Quest1: 퀴즈 데이터 로딩 시작...');
      hasLoadedQuiz.current = true;
      setIsLoading(true);
      
      try {
        // 퀴즈 1번 데이터 로드
        // quizRecordId가 null이면 0을 전달 (새로운 퀴즈 시작)
        const quizRecordId = quizStatusInfo.quizRecordId ?? 0;
        console.log('Quest1: API 호출 - quizId: 1, quizRecordId:', quizRecordId);
        const quizData = await fetchQuizData(1, quizRecordId);
        
        if (quizData) {
          console.log('Quest1: 퀴즈 데이터 로드 성공', quizData);
          // API 데이터를 그대로 사용 (API 타입에 맞음)
          setCurrentQuiz(quizData);
          setStartTime(new Date());
          
          // quizRecordId를 localStorage에 저장 (2~5번 퀴즈에서 사용하기 위해)
          if (quizData.quizRecordId && quizData.quizRecordId > 0) {
            localStorage.setItem('quizRecordId', quizData.quizRecordId.toString());
            console.log('Quest1: localStorage에 quizRecordId 저장:', quizData.quizRecordId);
          }
          
          // 오디오 재생 (audioUrl이 있으면)
          if (quizData.audioUrl) {
            console.log('Quest1: 오디오 재생 시작:', quizData.audioUrl);
            const audio = new Audio(quizData.audioUrl);
            audio.play().catch(error => {
              console.error('Quest1: 오디오 재생 실패:', error);
            });
          }
        } else {
          console.log('Quest1: API 데이터 없음, 기본 데이터 사용');
          // 기본 API 데이터 구조로 설정
          setCurrentQuiz({
            quizId: 1,
            quizRecordId: 0,
            imageId: 1,
            imageUrl: quiz1_1,
            audioUrl: ""
          });
          setStartTime(new Date());
        }
      } catch (error) {
        console.error('Quest1: 퀴즈 데이터 로드 중 오류:', error);
        // 오류 발생 시에도 기본 데이터로 대체
        console.log('Quest1: 오류 발생, 기본 데이터로 대체');
        setCurrentQuiz({
          quizId: 1,
          quizRecordId: 0,
          imageId: 1,
          imageUrl: quiz1_1,
          audioUrl: ""
        });
        setStartTime(new Date());
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, [quizStatusInfo]);

  // Duration 형식으로 시간 변환 (예: "PT1M30S")
  const formatDuration = (startTime: Date, endTime: Date): string => {
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    return `PT${minutes}M${seconds}S`;
  };

  // 답변 선택 처리
  const handleAnswerSelect = async (answer: string) => {
    if (!currentQuiz || !startTime) return;
    
    console.log('Quest1: 답변 선택:', answer);
    console.log('Quest1: 현재 퀴즈 이미지 URL:', currentQuiz.imageUrl);
    console.log('Quest1: 현재 퀴즈 imageId:', currentQuiz.imageId);
    
    setSelectedAnswer(answer);
    
    // 답변한 퀴즈 이미지 URL 저장
    setAnsweredQuizImageUrl(currentQuiz.imageUrl);
    
    try {
      const endTime = new Date();
      const timeSpent = formatDuration(startTime, endTime);
      
      console.log('Quest1: 정답 확인 API 호출...');
      const result = await checkQuizAnswer({
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: answer,
        answer2: "", // 퀴즈 1번은 answer2 없음
        time: timeSpent
      });
      
      if (result) {
        console.log('Quest1: 정답 확인 결과:', result);
        console.log('Quest1: API에서 받은 정답 여부:', result.answer);
        setIsCorrect(result.answer);
        setShowResult(true);
        
        // 백엔드로 답변 전송
        onAnswer?.(answer);
        
        if (result.answer) {
          console.log('Quest1: 정답! 성공 페이지로 이동');
        } else {
          console.log('Quest1: 오답! 다시하기 옵션 표시');
        }
      } else {
        console.error('Quest1: 정답 확인 실패');
      }
    } catch (error) {
      console.error('Quest1: 정답 확인 중 오류:', error);
    }
  };

  // 다시 시도
  const handleRetry = async () => {
    if (!currentQuiz) return;
    
    console.log('Quest1: 다시하기 시작...');
    
    try {
      const retryData = await retryQuiz(currentQuiz.quizId, currentQuiz.imageId);
      
      if (retryData) {
        console.log('Quest1: 다시하기 데이터 로드 성공:', retryData);
        setCurrentQuiz(retryData);
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setStartTime(new Date());
        setAnsweredQuizImageUrl(null); // 저장된 이미지 URL 초기화
      } else {
        console.error('Quest1: 다시하기 데이터 로드 실패');
      }
    } catch (error) {
      console.error('Quest1: 다시하기 중 오류:', error);
    }
  };

  // 다음 퀘스트로 진행
  const handleNextQuest = () => {
    if (isCorrect) {
      console.log('Quest1: 다음 퀴즈로 진행');
      onComplete?.(1); // 정답이면 1점
      setShowSuccessPage(true); // Q1SuccessPage 표시
    }
  };

  // Q1SuccessPage 완료 후 다음 페이지로
  const handleSuccessComplete = () => {
    console.log('Quest1: 성공 페이지 완료, 다음 퀴즈로 이동');
    onNext?.();
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bg5})` }}>
        <div className="text-white text-xl">퀴즈 로딩 중...</div>
      </div>
    );
  }

  // 퀴즈 데이터가 없을 때
  if (!currentQuiz) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bg5})` }}>
        <div className="text-white text-xl">퀴즈 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 성공 페이지 표시
  if (showSuccessPage) {
    return <Q1SuccessPage onComplete={handleSuccessComplete} />;
  }

  // 결과 표시
  if (showResult) {
    return (
      <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bg5})` }}>
        {/* 상단 결과 DialogBox - x=43, y=72 고정 */}
        <div 
          className="absolute" 
          style={{ 
            top: '72px', 
            left: '43px', 
            zIndex: 10
          }}
        >
          <DialogBox 
            text={isCorrect ? "정답입니다!" : "다시 해볼까?"}
            fontSize="text-[24px]"
            bold={true}
          />
        </div>
        
        {/* 원래 퀴즈 이미지 표시 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={answeredQuizImageUrl || currentQuiz.imageUrl}
            alt="퀴즈 이미지"
            className="max-w-sm max-h-sm"
          />
        </div>
        
        {/* 정답 표시 - y=574 위치 */}
        <div className="absolute" style={{ top: '574px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <div className="flex items-center gap-2">
            <span className="text-black text-[20px] font-bold font-['Noto_Sans_KR']">나는</span>
            <ChoiceButton
              label={(() => {
                // imageId를 우선 사용하고, 없으면 imageUrl 사용
                const correctAnswer = currentQuiz ? getCorrectAnswerFromImageId(currentQuiz.imageId) : "기뻐요";
                console.log('Quest1: 결과 화면 정답 표시 - imageId:', currentQuiz?.imageId);
                console.log('Quest1: 결과 화면 정답 표시 - 판단된 정답:', correctAnswer);
                return correctAnswer;
              })()}
              onClick={() => {}} // 클릭 비활성화
              isSelected={false}
            />
          </div>
        </div>
        
        {/* 하단 버튼 DialogBox - (41,677) 위치 */}
        <div 
          className="absolute" 
          style={{ 
            top: '677px', 
            left: '41px', 
            zIndex: 10,
            cursor: 'pointer'
          }}
          onClick={!isCorrect ? handleRetry : handleNextQuest}
        >
          <DialogBox 
            text={!isCorrect ? "다시하기" : "다음 퀘스트"}
            fontSize="text-[20px]"
            bold={true}
          />
        </div>
      </div>
    );
  }

  // 메인 퀴즈 화면
  return (
    <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${bg5})` }}>
      {/* 상단 문제 DialogBox - x=43, y=72 고정 */}
      <div 
        className="absolute" 
        style={{ 
          top: '72px', 
          left: '43px', 
          zIndex: 10
        }}
      >
        <DialogBox 
          text={uiData.question}
          fontSize="text-[24px]"
          bold={true}
        />
      </div>
      
      {/* 퀴즈 이미지 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img
          src={currentQuiz.imageUrl}
          alt="퀴즈 이미지"
          className="max-w-sm max-h-sm"
        />
      </div>

      {/* 선택지 버튼들 - 정확한 좌표 배치 */}
      <div className="absolute" style={{ top: '603px', left: '41px', zIndex: 10 }}>
        <ChoiceButton
          label={uiData.options[0]}
          onClick={() => handleAnswerSelect(uiData.options[0])}
          isSelected={selectedAnswer === uiData.options[0]}
        />
      </div>
      
      <div className="absolute" style={{ top: '603px', left: '203px', zIndex: 10 }}>
        <ChoiceButton
          label={uiData.options[1]}
          onClick={() => handleAnswerSelect(uiData.options[1])}
          isSelected={selectedAnswer === uiData.options[1]}
        />
      </div>
      
      <div className="absolute" style={{ top: '689px', left: '41px', zIndex: 10 }}>
        <ChoiceButton
          label={uiData.options[2]}
          onClick={() => handleAnswerSelect(uiData.options[2])}
          isSelected={selectedAnswer === uiData.options[2]}
        />
      </div>
      
      <div className="absolute" style={{ top: '689px', left: '203px', zIndex: 10 }}>
        <ChoiceButton
          label={uiData.options[3]}
          onClick={() => handleAnswerSelect(uiData.options[3])}
          isSelected={selectedAnswer === uiData.options[3]}
        />
      </div>
    </div>
  );
};

export default Quest1; 