import React, { useState, useEffect } from "react";
import DialogBox from "../components/DialogBox";
import Q2SuccessPage from "./Q2SuccessPage";
import { fetchQuizData, checkQuizAnswer, retryQuiz, QuizData as ApiQuizData } from "../utils/gameApi";

// 이미지 import
import bg5 from "../assets/5_배경.png";

// 캐릭터 시선 방향 이미지들
import quiz2_1 from "../assets/Quiz_2/Quiz2-1-우측바라봄.png";
import quiz2_2 from "../assets/Quiz_2/Quiz2-2-좌상단바라봄.png";
import quiz2_3 from "../assets/Quiz_2/Quiz2-3-하측바라봄.png";
import quiz2_4 from "../assets/Quiz_2/Quiz2-4-우상단바라봄.png";
import quiz2_5 from "../assets/Quiz_2/Quiz2-5-좌측바라봄.png";

// 물체 이미지들
import object1 from "../assets/Quiz_2/잉크통.png";
import object2 from "../assets/Quiz_2/연필깎이.png";
import object3 from "../assets/Quiz_2/가위.png";
import object4 from "../assets/Quiz_2/핀.png";
import object5 from "../assets/Quiz_2/지우개.png";

// 성공 이미지
import successImage from "../assets/Quiz_2/Quiz2-6-성공이미지.png";

// 퀴즈 데이터 타입 정의 (로컬용)
interface LocalQuizData {
  id: number;
  questionImage: string;
  correctAnswer: string;
  objects: Array<{
    id: string;
    image: string;
    position: string;
  }>;
}

interface Quest2Props {
  onAnswer?: (answer: string) => void;
  onComplete?: (score: number) => void;
  onNext?: () => void;
  // 백엔드 연동을 위한 props
  quizData?: LocalQuizData;
  isLoading?: boolean;
  quizStatusInfo?: {
    quizId: number | null;
    quizRecordId: number | null;
    imageId: number | null;
    imageUrl: string | null;
    audioUrl: string | null;
    quizNumber: number | null;
  } | null;
}

const Quest2: React.FC<Quest2Props> = ({ 
  onAnswer, 
  onComplete, 
  onNext,
  quizData,
  isLoading = false,
  quizStatusInfo
}) => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<ApiQuizData | null>(null);
  const [answeredQuizImageUrl, setAnsweredQuizImageUrl] = useState<string | null>(null);
  const [answeredCorrectAnswer, setAnsweredCorrectAnswer] = useState<string | null>(null);
  const [loadedQuizRecordId, setLoadedQuizRecordId] = useState<number | null>(null); // 중복 호출 방지용

  // 이미지 URL에 따라 정답을 동적으로 판단하는 함수 (물체 이름 기반)
  const getCorrectAnswerFromImageUrl = (imageUrl: string): string => {
    console.log('Quest2: 이미지 URL 분석 시작:', imageUrl);
    
    // 백엔드에서 받은 이미지 URL 패턴 매칭 (물체 이름 기반)
    if (imageUrl.includes('가위') || imageUrl.includes('scissors') || imageUrl.includes('우측') || imageUrl.includes('right')) {
      console.log('Quest2: 가위 이미지 감지 → 정답: 가위');
      return "가위";
    }
    if (imageUrl.includes('잉크통') || imageUrl.includes('ink') || imageUrl.includes('좌상단') || imageUrl.includes('top-left')) {
      console.log('Quest2: 잉크통 이미지 감지 → 정답: 잉크통');
      return "잉크통";
    }
    if (imageUrl.includes('지우개') || imageUrl.includes('eraser') || imageUrl.includes('하측') || imageUrl.includes('bottom')) {
      console.log('Quest2: 지우개 이미지 감지 → 정답: 지우개');
      return "지우개";
    }
    if (imageUrl.includes('핀') || imageUrl.includes('pin') || imageUrl.includes('우상단') || imageUrl.includes('top-right')) {
      console.log('Quest2: 핀 이미지 감지 → 정답: 핀');
      return "핀";
    }
    if (imageUrl.includes('연필깎기') || imageUrl.includes('sharpener') || imageUrl.includes('좌측') || imageUrl.includes('left')) {
      console.log('Quest2: 연필깎기 이미지 감지 → 정답: 연필깎기');
      return "연필깎기";
    }
    
    console.log('Quest2: 이미지 매칭 실패, 기본값 사용: 가위');
    return "가위"; // 기본값
  };

  // imageId에 따라 정답을 판단하는 함수 (정확한 매핑)
  const getCorrectAnswerFromImageId = (imageId: number): string => {
    console.log('Quest2: 정답 판단 - imageId:', imageId);
    
    // imageId 5-9: 가위, 잉크통, 지우개, 핀, 연필깎기 순서
    switch (imageId) {
      case 5:
        console.log('Quest2: 정답 판단 결과 - 가위 (imageId: 5)');
        return "가위";
      case 6:
        console.log('Quest2: 정답 판단 결과 - 잉크통 (imageId: 6)');
        return "잉크통";
      case 7:
        console.log('Quest2: 정답 판단 결과 - 지우개 (imageId: 7)');
        return "지우개";
      case 8:
        console.log('Quest2: 정답 판단 결과 - 핀 (imageId: 8)');
        return "핀";
      case 9:
        console.log('Quest2: 정답 판단 결과 - 연필깎기 (imageId: 9)');
        return "연필깎기";
    }
    
    console.log('Quest2: 알 수 없는 imageId:', imageId);
    return "가위"; // 기본값
  };

  // 퀴즈 이미지 매핑 (로컬 폴백용)
  const quizImages = {
    "가위": quiz2_1,
    "잉크통": quiz2_2,
    "지우개": quiz2_3,
    "핀": quiz2_4,
    "좌측바라봄": quiz2_5
  };

  
  
  // 컴포넌트 마운트 시 퀴즈 데이터 로드
  useEffect(() => {
    console.log('Quest2: useEffect 실행 - quizStatusInfo:', quizStatusInfo);
    
    // localStorage에서 quizRecordId 확인
    const getStoredQuizRecordId = (): number | null => {
      try {
        const stored = localStorage.getItem('quizRecordId');
        return stored ? parseInt(stored, 10) : null;
      } catch (error) {
        console.error('localStorage에서 quizRecordId 불러오기 실패:', error);
        return null;
      }
    };
    
    const storedQuizRecordId = getStoredQuizRecordId();
    console.log('Quest2: localStorage에서 불러온 quizRecordId:', storedQuizRecordId);
    
    // quizStatusInfo가 없거나 quizRecordId가 없으면 기본 데이터로 시작
    if (!quizStatusInfo || (!quizStatusInfo.quizRecordId && !storedQuizRecordId)) {
      console.log('Quest2: quizStatusInfo 또는 quizRecordId가 없음, 기본 데이터로 시작');
      console.log('Quest2: quizStatusInfo 값:', quizStatusInfo);
      console.log('Quest2: quizStatusInfo?.quizRecordId 값:', quizStatusInfo?.quizRecordId);
      console.log('Quest2: storedQuizRecordId 값:', storedQuizRecordId);
      setCurrentQuiz({
        quizId: 2, // 퀴즈 2번으로 설정
        quizRecordId: 0,
        imageId: 5, // Quest2는 5~9 범위 사용
        imageUrl: quiz2_1,
        audioUrl: ""
      });
      return;
    }

    // 최종 quizRecordId 결정 (quizStatusInfo 우선, localStorage는 fallback)
    const finalQuizRecordId = quizStatusInfo.quizRecordId || storedQuizRecordId;
    console.log('Quest2: 최종 사용할 quizRecordId:', finalQuizRecordId);

    // 이미 해당 quizRecordId로 데이터가 로드된 경우 중복 호출 방지
    if (loadedQuizRecordId === finalQuizRecordId) {
      console.log('Quest2: 이미 이 quizRecordId로 데이터가 로드됨, 중복 호출 방지');
      return;
    }

    const loadQuizData = async () => {
      console.log('Quest2: 퀴즈 데이터 로딩 시작...');
      console.log('Quest2: quizStatusInfo:', quizStatusInfo);
      
      try {
        // 퀴즈 2번 데이터 로드
        console.log('Quest2: 사용할 quizRecordId:', finalQuizRecordId);
        console.log('Quest2: fetchQuizData 호출 시작 - quizId: 2, quizRecordId:', finalQuizRecordId);
        const quizData = await fetchQuizData(2, finalQuizRecordId);
        console.log('Quest2: fetchQuizData 결과:', quizData);
        
        if (quizData) {
          console.log('Quest2: 퀴즈 데이터 로드 성공', quizData);
          console.log('Quest2: API 이미지 URL:', quizData.imageUrl);
          console.log('Quest2: API imageId:', quizData.imageId);
          
          // API 데이터를 그대로 사용 (Quest 1과 동일)
          setCurrentQuiz(quizData);
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
          
          // 오디오 재생 (audioUrl이 있으면)
          if (quizData.audioUrl) {
            console.log('Quest2: 오디오 재생 시작:', quizData.audioUrl);
            const audio = new Audio(quizData.audioUrl);
            audio.play().catch(error => {
              console.error('Quest2: 오디오 재생 실패:', error);
            });
          }
        } else {
          console.log('Quest2: API 데이터 없음, 기본 데이터 사용');
          // 기본 API 데이터 구조로 설정 (Quest 2는 imageId 5~9 사용)
          setCurrentQuiz({
            quizId: 2, // 퀴즈 2번으로 설정
            quizRecordId: 0,
            imageId: 5, // Quest2는 5~9 범위 사용
            imageUrl: quiz2_1,
            audioUrl: ""
          });
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
        }
      } catch (error) {
        console.error('Quest2: 퀴즈 데이터 로드 중 오류:', error);
        // 오류 발생 시에도 기본 데이터로 대체 (Quest 2는 imageId 5~9 사용)
        console.log('Quest2: 오류 발생, 기본 데이터로 대체');
        setCurrentQuiz({
          quizId: 2, // 퀴즈 2번으로 설정
          quizRecordId: 0,
          imageId: 5, // Quest2는 5~9 범위 사용
          imageUrl: quiz2_1,
          audioUrl: ""
        });
        setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
      }
    };

    loadQuizData();
  }, [quizStatusInfo]);

  // 물체 선택 처리
  const handleObjectSelect = async (objectId: string) => {
    if (!currentQuiz) return;
    
    console.log('Quest2: 답변 선택:', objectId);
    console.log('Quest2: 현재 퀴즈 이미지 URL:', currentQuiz.imageUrl);
    console.log('Quest2: 현재 퀴즈 imageId:', currentQuiz.imageId);
    
    setSelectedObject(objectId);
    
    // 답변한 퀴즈 이미지 URL과 정답 저장
    setAnsweredQuizImageUrl(currentQuiz.imageUrl);
    // imageId를 사용해서 정답 판단 (URL 분석은 불가능하므로)
    const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
    setAnsweredCorrectAnswer(correctAnswer);
    console.log('Quest2: 답변 시 정답 저장 - imageId:', currentQuiz.imageId, 'imageUrl:', currentQuiz.imageUrl, '정답:', correctAnswer);
    
    try {
      // API로 정답 확인
      const result = await checkQuizAnswer({
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: objectId, // 선택된 물체 이름
        answer2: "", // 퀴즈 2번은 answer2 없음
        time: "PT1M30S" // 기본값, 실제로는 측정된 시간 사용
      });
      
      const requestData = {
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: objectId,
        answer2: "",
        time: "PT1M30S"
      };
      
      console.log('Quest2: API 정답 확인 요청 데이터:', requestData);
      console.log('Quest2: 전송할 answer1 값:', objectId);
      console.log('Quest2: 전송할 answer1 타입:', typeof objectId);
      console.log('Quest2: 전송할 imageId 값:', currentQuiz.imageId);
      console.log('Quest2: 전송할 imageId 타입:', typeof currentQuiz.imageId);
      
      console.log('Quest2: currentQuiz 전체 데이터:', currentQuiz);
      console.log('Quest2: 전송된 quizId 타입:', typeof currentQuiz.quizId);
      console.log('Quest2: 전송된 quizId 값:', currentQuiz.quizId);
      console.log('Quest2: 전송된 imageId 타입:', typeof currentQuiz.imageId);
      console.log('Quest2: 전송된 imageId 값:', currentQuiz.imageId);
      
      if (result) {
        console.log('Quest2: 정답 확인 결과:', result);
        console.log('Quest2: 백엔드 응답 answer 값:', result.answer);
        console.log('Quest2: 백엔드 응답 answer 타입:', typeof result.answer);
        setIsCorrect(result.answer);
        setShowResult(true);
        
        // 정답 확인 응답의 오디오 재생 (힌트나 해설)
        if (result.audioUrl) {
          console.log('Quest2: 정답 확인 오디오 재생:', result.audioUrl);
          const audio = new Audio(result.audioUrl);
          audio.play().catch(error => {
            console.error('Quest2: 정답 확인 오디오 재생 실패:', error);
          });
        }
        
        // 백엔드로 답변 전송
        onAnswer?.(objectId);
      } else {
        console.error('Quest2: 정답 확인 실패');
        // 로컬 로직으로 폴백
        console.log('Quest2: 로컬 폴백 - currentQuiz.imageId:', currentQuiz.imageId);
        
        // imageId가 유효한지 확인
        if (!currentQuiz.imageId || currentQuiz.imageId < 5 || currentQuiz.imageId > 9) {
          console.error('Quest2: 유효하지 않은 imageId:', currentQuiz.imageId);
          // 기본값으로 정답 체크
          const correct = objectId === "가위"; // 기본 정답
          console.log('Quest2: 기본값 정답 확인:', {
            선택한답: objectId,
            정답: "가위",
            결과: correct
          });
          setIsCorrect(correct);
          setShowResult(true);
          onAnswer?.(objectId);
        } else {
          const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
          const correct = objectId === correctAnswer;
          console.log('Quest2: 로컬 정답 확인:', {
            선택한답: objectId,
            정답: correctAnswer,
            imageId: currentQuiz.imageId,
            결과: correct
          });
          setIsCorrect(correct);
          setShowResult(true);
          onAnswer?.(objectId);
        }
      }
    } catch (error) {
      console.error('Quest2: 정답 확인 중 오류:', error);
      // 로컬 로직으로 폴백
      console.log('Quest2: 오류 시 로컬 폴백 - currentQuiz.imageId:', currentQuiz.imageId);
      
      // imageId가 유효한지 확인
      if (!currentQuiz.imageId || currentQuiz.imageId < 5 || currentQuiz.imageId > 9) {
        console.error('Quest2: 오류 시 유효하지 않은 imageId:', currentQuiz.imageId);
        // 기본값으로 정답 체크
        const correct = objectId === "가위"; // 기본 정답
        console.log('Quest2: 오류 시 기본값 정답 확인:', {
          선택한답: objectId,
          정답: "가위",
          결과: correct
        });
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer?.(objectId);
      } else {
        const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
        const correct = objectId === correctAnswer;
        console.log('Quest2: 오류 시 로컬 정답 확인:', {
          선택한답: objectId,
          정답: correctAnswer,
          imageId: currentQuiz.imageId,
          결과: correct
        });
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer?.(objectId);
      }
    }
  };

  // 다시 시도
  const handleRetry = async () => {
    if (!currentQuiz) return;
    
    console.log('Quest2: 다시하기 시작...');
    console.log('Quest2: 현재 quizId:', currentQuiz.quizId);
    console.log('Quest2: 현재 imageId:', currentQuiz.imageId);
    
    try {
      const retryData = await retryQuiz(currentQuiz.quizId, currentQuiz.imageId);
      
      if (retryData) {
        console.log('Quest2: 다시하기 데이터 로드 성공:', retryData);
        setCurrentQuiz(retryData);
        setSelectedObject(null);
        setShowResult(false);
        setIsCorrect(false);
        setAnsweredQuizImageUrl(null);
        setAnsweredCorrectAnswer(null);
      } else {
        console.error('Quest2: 다시하기 데이터 로드 실패');
        // 실패 시 로컬에서 새로운 이미지로 재시도 (무한 루프 방지)
        console.log('Quest2: 로컬 재시도 - 새로운 이미지로 시작');
        setCurrentQuiz({
          quizId: 2,
          quizRecordId: currentQuiz.quizRecordId,
          imageId: Math.floor(Math.random() * 5) + 5, // 5~9 범위에서 랜덤
          imageUrl: quiz2_1,
          audioUrl: ""
        });
        setSelectedObject(null);
        setShowResult(false);
        setIsCorrect(false);
        setAnsweredQuizImageUrl(null);
        setAnsweredCorrectAnswer(null);
      }
    } catch (error) {
      console.error('Quest2: 다시하기 중 오류:', error);
      // 오류 시에도 로컬에서 새로운 이미지로 재시도 (무한 루프 방지)
      console.log('Quest2: 오류 시 로컬 재시도 - 새로운 이미지로 시작');
      setCurrentQuiz({
        quizId: 2,
        quizRecordId: currentQuiz.quizRecordId,
        imageId: Math.floor(Math.random() * 5) + 5, // 5~9 범위에서 랜덤
        imageUrl: quiz2_1,
        audioUrl: ""
      });
      setSelectedObject(null);
      setShowResult(false);
      setIsCorrect(false);
      setAnsweredQuizImageUrl(null);
      setAnsweredCorrectAnswer(null);
    }
  };

  // 다음 퀘스트로 진행
  const handleNextQuest = () => {
    if (isCorrect) {
      onComplete?.(1); // 정답이면 1점
      setShowSuccessPage(true); // Q2SuccessPage 표시
    }
  };

  // Q2SuccessPage 완료 후 다음 페이지로
  const handleSuccessComplete = () => {
    onNext?.();
  };

  // Q2SuccessPage 표시
  if (showSuccessPage) {
    return (
      <Q2SuccessPage 
        onComplete={handleSuccessComplete}
        onNext={handleSuccessComplete}
      />
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bg5})` }}
      >
        <div className="text-2xl font-['Noto_Sans_KR']">로딩 중...</div>
      </div>
    );
  }

  // 결과 화면 (정답)
  if (showResult && isCorrect) {
    return (
      <div
        className="relative w-full h-full flex flex-col items-center justify-between bg-cover bg-center py-8"
        style={{ backgroundImage: `url(${bg5})` }}
      >
        {/* 상단 정답 메시지 */}
        <div className="flex-shrink-0">
          <DialogBox text="정답입니다" fontSize="text-[26px]" />
        </div>

        {/* 중앙 정답 이미지 */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img
            src={successImage}
            alt="정답 이미지"
            style={{ width: '290px', height: 'auto' }}
            draggable={false}
          />
        </div>

        {/* 하단 다음퀘스트 DialogBox */}
        <div className="flex-shrink-0">
          <div onClick={handleNextQuest} style={{ cursor: 'pointer' }}>
            <DialogBox text="다음퀘스트" fontSize="text-[26px]" />
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면 (오답)
  if (showResult && !isCorrect) {
    return (
      <div
        className="relative w-full h-full flex flex-col items-center justify-between bg-cover bg-center py-8"
        style={{ backgroundImage: `url(${bg5})` }}
      >
        {/* 상단 다시해볼까 메시지 */}
        <div className="flex-shrink-0">
          <DialogBox text="다시해볼까?" fontSize="text-[26px]" />
        </div>

        {/* 중앙 틀린 문제의 캐릭터 이미지 */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img
            src={answeredQuizImageUrl || currentQuiz?.imageUrl || quiz2_1}
            alt="틀린 문제 캐릭터"
            style={{ width: '290px', height: 'auto' }}
            draggable={false}
          />
        </div>

        {/* 하단 영역 */}
        <div className="flex-shrink-0 w-full relative" style={{ height: '200px' }}>
          {/* "정답은" 텍스트 */}
          <div 
            className="absolute"
            style={{ 
              left: '100px', 
              top: '20px',
              fontSize: '34px',
              fontFamily: 'Noto Sans KR',
              fontWeight: 'bold',
              color: '#000000'
            }}
          >
            정답은
          </div>

          {/* 정답 물체를 보여주는 이미지 */}
          <div 
            className="absolute"
            style={{ 
              left: '200px', 
              top: '10px'
            }}
          >
            <img
              src={(() => {
                // 답변했을 때 저장된 정답 사용
                const correctAnswer = answeredCorrectAnswer || "가위";
                console.log('Quest2: 오답 화면 정답 표시 - 저장된 정답:', correctAnswer);
                const objectMap = {
                  "가위": object3,
                  "잉크통": object1,
                  "지우개": object5,
                  "핀": object4,
                  "연필깎기": object2
                };
                return objectMap[correctAnswer as keyof typeof objectMap] || object3;
              })()}
              alt="정답 물체"
              style={{ width: '80px', height: 'auto' }}
              draggable={false}
            />
          </div>

          {/* 다시하기 DialogBox */}
          <div className="absolute left-1/2 transform -translate-x-1/2" style={{ bottom: '20px' }}>
            <div onClick={handleRetry} style={{ cursor: 'pointer' }}>
              <DialogBox text="다시하기" fontSize="text-[26px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 메인 퀴즈 화면
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-between bg-cover bg-center py-8"
      style={{ backgroundImage: `url(${bg5})` }}
    >
      {/* 상단 문제 문장 */}
      <div className="flex-shrink-0">
        <DialogBox text="어디를 보고 있을까?" fontSize="text-[26px]" />
      </div>

      {/* 중앙 캐릭터 이미지 */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <img
          src={currentQuiz?.imageUrl || quiz2_1}
          alt="시선 방향 캐릭터"
          style={{ width: '290px', height: 'auto' }}
          draggable={false}
        />
      </div>

      {/* 하단 물체들 (스크롤 가능) */}
      <div className="flex-shrink-0 w-full relative" style={{ height: '200px' }}>
        <div 
          className="absolute overflow-x-auto"
          style={{ 
            left: '42px', 
            top: '0px',
            width: 'calc(100% - 84px)',
            height: '100%'
          }}
        >
          <div className="flex space-x-4" style={{ minWidth: 'max-content', padding: '10px 0' }}>
            {[
              { id: "가위", image: object3, position: "가위" },
              { id: "잉크통", image: object1, position: "잉크통" },
              { id: "지우개", image: object5, position: "지우개" },
              { id: "핀", image: object4, position: "핀" },
              { id: "연필깎기", image: object2, position: "연필깎기" }
            ].map((object) => (
              <div
                key={object.id}
                onClick={() => handleObjectSelect(object.id)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: selectedObject === object.id ? 'scale(1.05)' : 'scale(1)',
                  width: '130px',
                  height: '130px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (selectedObject !== object.id) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedObject !== object.id) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <img
                  src={object.image}
                  alt={object.position}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quest2; 