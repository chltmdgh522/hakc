import React, { useState, useEffect } from "react";
import DialogBox from "../components/DialogBox";
import Q4SuccessPage from "./Q4SuccessPage";
import { fetchQuizData, checkQuizAnswer, retryQuiz, QuizData as ApiQuizData } from "../utils/gameApi";

// 이미지 import
import bg5 from "../assets/5_배경.png";

// 문제 이미지들
import problem1 from "../assets/Quiz_4/문제1-좋.png";
import problem2 from "../assets/Quiz_4/문제2-슬.png";
import problem3 from "../assets/Quiz_4/문제3-화.png";
import problem4 from "../assets/Quiz_4/문제4-놀.png";
import problem5 from "../assets/Quiz_4/문제5_무.png";

// 물체 이미지들
import object1 from "../assets/Quiz_4/Quiz4-1-1.png"; // 털실
import object2 from "../assets/Quiz_4/Quiz4-1-2.png"; // 케이크
import object3 from "../assets/Quiz_4/Quiz4-1-3.png"; // 공
import object4 from "../assets/Quiz_4/Quiz4-1-4.png"; // 아이스크림
import object5 from "../assets/Quiz_4/Quiz4-1-5.png"; // 책
import object6 from "../assets/Quiz_4/Quiz4-1-6.png"; // 카메라
import object7 from "../assets/Quiz_4/Quiz4-1-7.png"; // 컵
import object8 from "../assets/Quiz_4/Quiz4-1-8.png"; // 유령
import object9 from "../assets/Quiz_4/Quiz4-1-9.png"; // 폭죽

// 결과 이미지들
import correctImage from "../assets/Quiz_4/Quiz4-5-정답.png";
import wrongImage from "../assets/Quiz_4/Quiz4-7-오답.png";

interface Quest4Props {
  onAnswer?: (answer: string) => void;
  onComplete?: (score: number) => void;
  onNext?: () => void;
  // 백엔드 연동을 위한 props
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

const Quest4: React.FC<Quest4Props> = ({ 
  onAnswer, 
  onComplete, 
  onNext,
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

  // imageId에 따라 정답을 판단하는 함수 (Quest 4)
  const getCorrectAnswerFromImageId = (imageId: number): string => {
    console.log('Quest4: 정답 판단 - imageId:', imageId);
    
    // imageId 12-16: 케이크, 책, 케이크, 폭죽, 유령 순서
    switch (imageId) {
      case 12:
        console.log('Quest4: 정답 판단 결과 - 케이크 (imageId: 12)');
        return "케이크";
      case 13:
        console.log('Quest4: 정답 판단 결과 - 책 (imageId: 13)');
        return "책";
      case 14:
        console.log('Quest4: 정답 판단 결과 - 케이크 (imageId: 14)');
        return "케이크";
      case 15:
        console.log('Quest4: 정답 판단 결과 - 폭죽 (imageId: 15)');
        return "폭죽";
      case 16:
        console.log('Quest4: 정답 판단 결과 - 유령 (imageId: 16)');
        return "유령";
    }
    
    console.log('Quest4: 알 수 없는 imageId:', imageId);
    return "케이크"; // 기본값
  };

  // imageId에 따라 질문 대사를 반환하는 함수 (Quest 4)
  const getQuestionTextFromImageId = (imageId: number): string => {
    console.log('Quest4: 질문 대사 결정 - imageId:', imageId);
    
    switch (imageId) {
      case 12:
        console.log('Quest4: 질문 대사 - 무엇이 좋을지 맞춰볼까? (imageId: 12)');
        return "무엇이 좋을지 맞춰볼까?";
      case 13:
        console.log('Quest4: 질문 대사 - 무엇이 슬플지 맞춰볼까? (imageId: 13)');
        return "무엇이 슬플지 맞춰볼까?";
      case 14:
        console.log('Quest4: 질문 대사 - 무엇에 화났을까? 맞춰봐 (imageId: 14)');
        return "무엇에 화났을까? 맞춰봐";
      case 15:
        console.log('Quest4: 질문 대사 - 무엇에 놀랐을까? 맞춰봐 (imageId: 15)');
        return "무엇에 놀랐을까? 맞춰봐";
      case 16:
        console.log('Quest4: 질문 대사 - 무엇이 무서울까? 맞춰봐 (imageId: 16)');
        return "무엇이 무서울까? 맞춰봐";
    }
    
    console.log('Quest4: 알 수 없는 imageId, 기본 질문 사용:', imageId);
    return "어떤 물체가 정답일까?"; // 기본값
  };

  // 컴포넌트 마운트 시 퀴즈 데이터 로드
  useEffect(() => {
    console.log('Quest4: useEffect 실행 - quizStatusInfo:', quizStatusInfo);
    
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
    console.log('Quest4: localStorage에서 불러온 quizRecordId:', storedQuizRecordId);
    
    // quizStatusInfo가 없거나 quizRecordId가 없으면 기본 데이터로 시작
    if (!quizStatusInfo || (!quizStatusInfo.quizRecordId && !storedQuizRecordId)) {
      console.log('Quest4: quizStatusInfo 값:', quizStatusInfo);
      console.log('Quest4: quizStatusInfo?.quizRecordId 값:', quizStatusInfo?.quizRecordId);
      console.log('Quest4: storedQuizRecordId 값:', storedQuizRecordId);
      console.log('Quest4: quizStatusInfo 또는 quizRecordId가 없음, 기본 데이터로 시작');
      setCurrentQuiz({
        quizId: 4, // 퀴즈 4번으로 설정
        quizRecordId: 0,
        imageId: 12, // Quest4는 12~16 범위 사용
        imageUrl: problem1,
        audioUrl: ""
      });
      return;
    }

    // 최종 quizRecordId 결정 (quizStatusInfo 우선, localStorage는 fallback)
    const finalQuizRecordId = quizStatusInfo.quizRecordId || storedQuizRecordId;
    console.log('Quest4: 최종 사용할 quizRecordId:', finalQuizRecordId);

    // 이미 해당 quizRecordId로 데이터가 로드된 경우 중복 호출 방지
    if (loadedQuizRecordId === finalQuizRecordId) {
      console.log('Quest4: 이미 이 quizRecordId로 데이터가 로드됨, 중복 호출 방지');
      return;
    }

    const loadQuizData = async () => {
      console.log('Quest4: 퀴즈 데이터 로딩 시작...');
      console.log('Quest4: quizStatusInfo:', quizStatusInfo);
      
      try {
        // 퀴즈 4번 데이터 로드
        console.log('Quest4: 사용할 quizRecordId:', finalQuizRecordId);
        console.log('Quest4: fetchQuizData 호출 시작 - quizId: 4, quizRecordId:', finalQuizRecordId);
        const quizData = await fetchQuizData(4, finalQuizRecordId);
        console.log('Quest4: fetchQuizData 결과:', quizData);
        
        if (quizData) {
          console.log('Quest4: 퀴즈 데이터 로드 성공', quizData);
          console.log('Quest4: API 이미지 URL:', quizData.imageUrl);
          console.log('Quest4: API imageId:', quizData.imageId);
          
          // API 데이터를 그대로 사용
          setCurrentQuiz(quizData);
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
          
          // 오디오 재생 (audioUrl이 있으면)
          if (quizData.audioUrl) {
            console.log('Quest4: 오디오 재생 시작:', quizData.audioUrl);
            const audio = new Audio(quizData.audioUrl);
            audio.play().catch(error => {
              console.error('Quest4: 오디오 재생 실패:', error);
            });
          }
        } else {
          console.log('Quest4: API 데이터 없음, 기본 데이터 사용');
          // 기본 API 데이터 구조로 설정
          setCurrentQuiz({
            quizId: 4, // 퀴즈 4번으로 설정
            quizRecordId: 0,
            imageId: 12, // Quest4는 12~16 범위 사용
            imageUrl: problem1,
            audioUrl: ""
          });
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
        }
      } catch (error) {
        console.error('Quest4: 퀴즈 데이터 로드 중 오류:', error);
        // 오류 발생 시에도 기본 데이터로 대체
        console.log('Quest4: 오류 발생, 기본 데이터로 대체');
        setCurrentQuiz({
          quizId: 4, // 퀴즈 4번으로 설정
          quizRecordId: 0,
          imageId: 12, // Quest4는 12~16 범위 사용
          imageUrl: problem1,
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
    
    console.log('Quest4: 답변 선택:', objectId);
    console.log('Quest4: 현재 퀴즈 이미지 URL:', currentQuiz.imageUrl);
    console.log('Quest4: 현재 퀴즈 imageId:', currentQuiz.imageId);
    
    setSelectedObject(objectId);
    
    // 답변한 퀴즈 이미지 URL과 정답 저장
    setAnsweredQuizImageUrl(currentQuiz.imageUrl);
    const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
    setAnsweredCorrectAnswer(correctAnswer);
    console.log('Quest4: 답변 시 정답 저장 - imageId:', currentQuiz.imageId, '정답:', correctAnswer);
    
    try {
      // API로 정답 확인
      const result = await checkQuizAnswer({
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: objectId, // 선택된 물체 이름
        answer2: "", // 퀴즈 4번은 answer2 없음
        time: "PT1M30S" // 기본값, 실제로는 측정된 시간 사용
      });
      
      console.log('Quest4: API 정답 확인 요청 데이터:', {
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: objectId,
        answer2: "",
        time: "PT1M30S"
      });
      
      console.log('Quest4: currentQuiz 전체 데이터:', currentQuiz);
      console.log('Quest4: 전송된 quizId 타입:', typeof currentQuiz.quizId);
      console.log('Quest4: 전송된 quizId 값:', currentQuiz.quizId);
      console.log('Quest4: 전송된 imageId 타입:', typeof currentQuiz.imageId);
      console.log('Quest4: 전송된 imageId 값:', currentQuiz.imageId);
      
      if (result) {
        console.log('Quest4: 정답 확인 결과:', result);
        console.log('Quest4: 백엔드 응답 answer 값:', result.answer);
        console.log('Quest4: 백엔드 응답 answer 타입:', typeof result.answer);
        setIsCorrect(result.answer);
        setShowResult(true);
        
        // 정답 확인 응답의 오디오 재생 (힌트나 해설)
        if (result.audioUrl) {
          console.log('Quest4: 정답 확인 오디오 재생:', result.audioUrl);
          const audio = new Audio(result.audioUrl);
          audio.play().catch(error => {
            console.error('Quest4: 정답 확인 오디오 재생 실패:', error);
          });
        }
        
        // 백엔드로 답변 전송
        onAnswer?.(objectId);
      } else {
        console.error('Quest4: 정답 확인 실패');
        // 로컬 로직으로 폴백
        const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
        const correct = objectId === correctAnswer;
        console.log('Quest4: 로컬 정답 확인:', {
          선택한답: objectId,
          정답: correctAnswer,
          결과: correct
        });
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer?.(objectId);
      }
    } catch (error) {
      console.error('Quest4: 정답 확인 중 오류:', error);
      // 로컬 로직으로 폴백
      const correctAnswer = getCorrectAnswerFromImageId(currentQuiz.imageId);
      const correct = objectId === correctAnswer;
      console.log('Quest4: 오류 시 로컬 정답 확인:', {
        선택한답: objectId,
        정답: correctAnswer,
        결과: correct
      });
      setIsCorrect(correct);
      setShowResult(true);
      onAnswer?.(objectId);
    }
  };

  // 다시 시도
  const handleRetry = async () => {
    if (!currentQuiz) {
      console.error('Quest4: 다시하기 실패 - currentQuiz가 없음');
      return;
    }
    
    console.log('Quest4: 다시하기 시작...');
    console.log('Quest4: 현재 quizId:', currentQuiz.quizId);
    console.log('Quest4: 현재 imageId:', currentQuiz.imageId);
    
    // quizId나 imageId가 없으면 기본값 사용
    const quizId = currentQuiz.quizId || 4;
    const imageId = currentQuiz.imageId || 12;
    
    console.log('Quest4: 실제 사용할 값 - quizId:', quizId, 'imageId:', imageId);
    
    try {
      const retryData = await retryQuiz(quizId, imageId);
      
      if (retryData) {
        console.log('Quest4: 다시하기 데이터 로드 성공:', retryData);
        setCurrentQuiz(retryData);
        setSelectedObject(null);
        setShowResult(false);
        setIsCorrect(false);
        setAnsweredQuizImageUrl(null);
        setAnsweredCorrectAnswer(null);
      } else {
        console.error('Quest4: 다시하기 데이터 로드 실패');
      }
    } catch (error) {
      console.error('Quest4: 다시하기 중 오류:', error);
    }
  };

  // 다음 퀴즈로 이동
  const handleNextQuest = () => {
    console.log('Quest4: 다음 퀴즈로 이동');
    onNext?.();
  };

  // 성공 페이지 완료
  const handleSuccessComplete = () => {
    console.log('Quest4: 성공 페이지 완료');
    onComplete?.(100);
  };

  // 성공 페이지
  if (showSuccessPage) {
    return <Q4SuccessPage onComplete={handleSuccessComplete} />;
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
            src={correctImage}
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
            src={answeredQuizImageUrl || currentQuiz?.imageUrl || problem1}
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
                const correctAnswer = answeredCorrectAnswer || "케이크";
                console.log('Quest4: 오답 화면 정답 표시 - 저장된 정답:', correctAnswer);
                const objectMap = {
                  "털실": object1,
                  "케이크": object2,
                  "공": object3,
                  "아이스크림": object4,
                  "책": object5,
                  "카메라": object6,
                  "컵": object7,
                  "유령": object8,
                  "폭죽": object9
                };
                return objectMap[correctAnswer as keyof typeof objectMap] || object2;
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
        <DialogBox 
          text={getQuestionTextFromImageId(currentQuiz?.imageId || 12)} 
          fontSize="text-[26px]" 
        />
      </div>

      {/* 중앙 문제 이미지 */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <img
          src={currentQuiz?.imageUrl || problem1}
          alt="문제 이미지"
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
              { id: "털실", image: object1, name: "털실" },
              { id: "케이크", image: object2, name: "케이크" },
              { id: "공", image: object3, name: "공" },
              { id: "아이스크림", image: object4, name: "아이스크림" },
              { id: "책", image: object5, name: "책" },
              { id: "카메라", image: object6, name: "카메라" },
              { id: "컵", image: object7, name: "컵" },
              { id: "유령", image: object8, name: "유령" },
              { id: "폭죽", image: object9, name: "폭죽" }
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
                  alt={object.name}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    filter: selectedObject === object.id ? 'brightness(1.2)' : 'brightness(1)'
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

export default Quest4; 