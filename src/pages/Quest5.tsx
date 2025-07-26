import React, { useState, useEffect } from "react";
import DialogBox from "../components/DialogBox";
import { motion, AnimatePresence } from "framer-motion";
import { fetchQuizData, checkQuizAnswer, retryQuiz, QuizData as ApiQuizData } from "../utils/gameApi";

// 이미지 import
import bg5 from "../assets/5_배경.png";
import bg2 from "../assets/2_배경.png";
import bg1 from "../assets/폭죽_배경.png";
import darkBg from "../assets/암흑배경.png";
import q5SuccessBg from "../assets/Q5-성공_배경.png";

// 문제 이미지
import problemImage from "../assets/Quiz_5/Quiz5-문제이미지.png";

// 물체 이미지들
import object1 from "../assets/Quiz_5/Quiz5-1-1-머핀.png"; // 머핀
import object2 from "../assets/Quiz_5/Quiz5-1-2-폭탄.png"; // 폭탄
import object3 from "../assets/Quiz_5/Quiz5-1-3-목줄.png"; // 목줄 (정답)
import object4 from "../assets/Quiz_5/Quiz5-1-4-고양이.png"; // 고양이

// 결과 이미지들
import wrongImage from "../assets/Quiz_5/Quiz5-2.png";
import correctImage from "../assets/Quiz_5/Quiz5-3-정답.png";

// 왕관 이미지들
import crown4 from "../assets/4_왕관.png";
import successCrown from "../assets/성공왕관.png";

interface Quest5Props {
  onAnswer?: (answer: { object: string; message: string }) => void;
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

const Quest5: React.FC<Quest5Props> = ({ 
  onAnswer, 
  onComplete, 
  onNext,
  isLoading = false,
  quizStatusInfo
}) => {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<ApiQuizData | null>(null);
  const [answeredQuizImageUrl, setAnsweredQuizImageUrl] = useState<string | null>(null);
  const [answeredCorrectAnswer, setAnsweredCorrectAnswer] = useState<string | null>(null);
  const [showCrownTransition, setShowCrownTransition] = useState(false);
  const [showWhiteFade, setShowWhiteFade] = useState(false);
  const [showFinalCrown, setShowFinalCrown] = useState(false);
  const [showWhiteFadeOut, setShowWhiteFadeOut] = useState(false);
  const [whiteFadeState, setWhiteFadeState] = useState<'none' | 'fadeIn' | 'fadeOut'>('none');
  const [loadedQuizRecordId, setLoadedQuizRecordId] = useState<number | null>(null); // 중복 호출 방지용

  // Quest 5의 정답 정의
  const CORRECT_OBJECT = "목줄";
  const CORRECT_MESSAGE = "너무 무서웠지? 걱정마 내가 지켜줄게"; // 선택지와 정확히 일치해야 함

  // 컴포넌트 마운트 시 퀴즈 데이터 로드
  useEffect(() => {
    console.log('Quest5: useEffect 실행 - quizStatusInfo:', quizStatusInfo);
    
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
    console.log('Quest5: localStorage에서 불러온 quizRecordId:', storedQuizRecordId);
    
    // quizStatusInfo가 없거나 quizRecordId가 없으면 기본 데이터로 시작
    if (!quizStatusInfo || (!quizStatusInfo.quizRecordId && !storedQuizRecordId)) {
      console.log('Quest5: quizStatusInfo 값:', quizStatusInfo);
      console.log('Quest5: quizStatusInfo?.quizRecordId 값:', quizStatusInfo?.quizRecordId);
      console.log('Quest5: storedQuizRecordId 값:', storedQuizRecordId);
      console.log('Quest5: quizStatusInfo 또는 quizRecordId가 없음, 기본 데이터로 시작');
      setCurrentQuiz({
        quizId: 5, // 퀴즈 5번으로 설정
        quizRecordId: 0,
        imageId: 17, // Quest5는 17~21 범위 사용
        imageUrl: problemImage,
        audioUrl: ""
      });
      return;
    }

    // 최종 quizRecordId 결정 (quizStatusInfo 우선, localStorage는 fallback)
    const finalQuizRecordId = quizStatusInfo.quizRecordId || storedQuizRecordId;
    console.log('Quest5: 최종 사용할 quizRecordId:', finalQuizRecordId);

    // 이미 해당 quizRecordId로 데이터가 로드된 경우 중복 호출 방지
    if (loadedQuizRecordId === finalQuizRecordId) {
      console.log('Quest5: 이미 이 quizRecordId로 데이터가 로드됨, 중복 호출 방지');
      return;
    }

    const loadQuizData = async () => {
      console.log('Quest5: 퀴즈 데이터 로딩 시작...');
      console.log('Quest5: quizStatusInfo:', quizStatusInfo);
      
      try {
        // 퀴즈 5번 데이터 로드
        console.log('Quest5: 사용할 quizRecordId:', finalQuizRecordId);
        console.log('Quest5: fetchQuizData 호출 시작 - quizId: 5, quizRecordId:', finalQuizRecordId);
        const quizData = await fetchQuizData(5, finalQuizRecordId);
        console.log('Quest5: fetchQuizData 결과:', quizData);
        
        if (quizData) {
          console.log('Quest5: 퀴즈 데이터 로드 성공', quizData);
          console.log('Quest5: API 이미지 URL:', quizData.imageUrl);
          console.log('Quest5: API imageId:', quizData.imageId);
          
          // API 데이터를 그대로 사용
          setCurrentQuiz(quizData);
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
          
          // 오디오 재생 (audioUrl이 있으면)
          if (quizData.audioUrl) {
            console.log('Quest5: 오디오 재생 시작:', quizData.audioUrl);
            const audio = new Audio(quizData.audioUrl);
            audio.play().catch(error => {
              console.error('Quest5: 오디오 재생 실패:', error);
            });
          }
        } else {
          console.log('Quest5: API 데이터 없음, 기본 데이터 사용');
          // 기본 API 데이터 구조로 설정
          setCurrentQuiz({
            quizId: 5, // 퀴즈 5번으로 설정
            quizRecordId: 0,
            imageId: 17, // Quest5는 17~21 범위 사용
            imageUrl: problemImage,
            audioUrl: ""
          });
          setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
        }
      } catch (error) {
        console.error('Quest5: 퀴즈 데이터 로드 중 오류:', error);
        // 오류 발생 시에도 기본 데이터로 대체
        console.log('Quest5: 오류 발생, 기본 데이터로 대체');
        setCurrentQuiz({
          quizId: 5, // 퀴즈 5번으로 설정
          quizRecordId: 0,
          imageId: 17, // Quest5는 17~21 범위 사용
          imageUrl: problemImage,
          audioUrl: ""
        });
        setLoadedQuizRecordId(finalQuizRecordId); // 이 quizRecordId로는 다시 호출 안 함
      }
    };

    loadQuizData();
  }, [quizStatusInfo]);

  // 물체 선택 처리
  const handleObjectSelect = (objectId: string) => {
    console.log('Quest5: 물체 선택:', objectId);
    setSelectedObject(objectId);
  };

  // 메시지 선택 처리
  const handleMessageSelect = async (messageId: string) => {
    if (!currentQuiz || !selectedObject) {
      console.error('Quest5: 물체가 선택되지 않았거나 퀴즈 데이터가 없음');
      return;
    }

    console.log('Quest5: 메시지 선택:', messageId);
    console.log('Quest5: 선택된 물체:', selectedObject);
    console.log('Quest5: 현재 퀴즈 이미지 URL:', currentQuiz.imageUrl);
    console.log('Quest5: 현재 퀴즈 imageId:', currentQuiz.imageId);
    
    setSelectedMessage(messageId);
    
    // 답변한 퀴즈 이미지 URL과 정답 저장
    setAnsweredQuizImageUrl(currentQuiz.imageUrl);
    setAnsweredCorrectAnswer(CORRECT_OBJECT);
    console.log('Quest5: 답변 시 정답 저장 - 정답 물체:', CORRECT_OBJECT);
    
    try {
      // API로 정답 확인
      const result = await checkQuizAnswer({
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: selectedObject, // 선택된 물체
        answer2: messageId, // 선택된 메시지
        time: "PT1M30S" // 기본값
      });
      
      console.log('Quest5: API 정답 확인 요청 데이터:', {
        quizId: currentQuiz.quizId,
        imageId: currentQuiz.imageId,
        answer1: selectedObject,
        answer2: messageId,
        time: "PT1M30S"
      });
      
      console.log('Quest5: currentQuiz 전체 데이터:', currentQuiz);
      console.log('Quest5: 전송된 quizId 타입:', typeof currentQuiz.quizId);
      console.log('Quest5: 전송된 quizId 값:', currentQuiz.quizId);
      console.log('Quest5: 전송된 imageId 타입:', typeof currentQuiz.imageId);
      console.log('Quest5: 전송된 imageId 값:', currentQuiz.imageId);
      
      if (result) {
        console.log('Quest5: 정답 확인 결과:', result);
        console.log('Quest5: 백엔드 응답 answer 값:', result.answer);
        console.log('Quest5: 백엔드 응답 answer 타입:', typeof result.answer);
        
        // 백엔드 결과를 그대로 사용
        setIsCorrect(result.answer);
        setShowResult(true);
        
        // 정답 확인 응답의 오디오 재생 (힌트나 해설)
        if (result.audioUrl && result.audioUrl !== '필요없음') {
          console.log('Quest5: 정답 확인 오디오 재생:', result.audioUrl);
          const audio = new Audio(result.audioUrl);
          audio.play().catch(error => {
            console.error('Quest5: 정답 확인 오디오 재생 실패:', error);
          });
        }
        
        // 백엔드로 답변 전송
        onAnswer?.({ object: selectedObject, message: messageId });
      } else {
        console.error('Quest5: 정답 확인 실패');
        // 로컬 로직으로 폴백
        const objectCorrect = selectedObject === CORRECT_OBJECT;
        const messageCorrect = messageId === CORRECT_MESSAGE;
        const correct = objectCorrect && messageCorrect;
        console.log('Quest5: 로컬 정답 확인:', {
          선택한물체: selectedObject,
          정답물체: CORRECT_OBJECT,
          물체정답: objectCorrect,
          선택한메시지: messageId,
          정답메시지: CORRECT_MESSAGE,
          메시지정답: messageCorrect,
          최종결과: correct,
          메시지길이비교: {
            선택한메시지길이: messageId.length,
            정답메시지길이: CORRECT_MESSAGE.length,
            선택한메시지문자코드: Array.from(messageId).map(c => c.charCodeAt(0)),
            정답메시지문자코드: Array.from(CORRECT_MESSAGE).map(c => c.charCodeAt(0))
          }
        });
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer?.({ object: selectedObject, message: messageId });
      }
    } catch (error) {
      console.error('Quest5: 정답 확인 중 오류:', error);
      // 로컬 로직으로 폴백
      const objectCorrect = selectedObject === CORRECT_OBJECT;
      const messageCorrect = messageId === CORRECT_MESSAGE;
      const correct = objectCorrect && messageCorrect;
      console.log('Quest5: 오류 시 로컬 정답 확인:', {
        선택한물체: selectedObject,
        정답물체: CORRECT_OBJECT,
        물체정답: objectCorrect,
        선택한메시지: messageId,
        정답메시지: CORRECT_MESSAGE,
        메시지정답: messageCorrect,
        최종결과: correct,
        메시지길이비교: {
          선택한메시지길이: messageId.length,
          정답메시지길이: CORRECT_MESSAGE.length,
          선택한메시지문자코드: Array.from(messageId).map(c => c.charCodeAt(0)),
          정답메시지문자코드: Array.from(CORRECT_MESSAGE).map(c => c.charCodeAt(0))
        }
      });
      setIsCorrect(correct);
      setShowResult(true);
      onAnswer?.({ object: selectedObject, message: messageId });
    }
  };

  // 다시 시도
  const handleRetry = async () => {
    if (!currentQuiz) {
      console.error('Quest5: 다시하기 실패 - currentQuiz가 없음');
      return;
    }
    
    console.log('Quest5: 다시하기 시작...');
    console.log('Quest5: 현재 quizId:', currentQuiz.quizId);
    console.log('Quest5: 현재 imageId:', currentQuiz.imageId);
    
    // quizId나 imageId가 없으면 기본값 사용
    const quizId = currentQuiz.quizId || 5;
    const imageId = currentQuiz.imageId || 1;
    
    console.log('Quest5: 실제 사용할 값 - quizId:', quizId, 'imageId:', imageId);
    
    try {
      const retryData = await retryQuiz(quizId, imageId);
      
      if (retryData) {
        console.log('Quest5: 다시하기 데이터 로드 성공:', retryData);
        setCurrentQuiz(retryData);
        setSelectedObject(null);
        setSelectedMessage(null);
        setShowResult(false);
        setIsCorrect(false);
        setAnsweredQuizImageUrl(null);
        setAnsweredCorrectAnswer(null);
      } else {
        console.error('Quest5: 다시하기 데이터 로드 실패');
      }
    } catch (error) {
      console.error('Quest5: 다시하기 중 오류:', error);
    }
  };

  // 다음 퀴즈로 이동
  const handleNextQuest = () => {
    if (isCorrect) {
      onComplete?.(1); // 정답이면 1점
      setShowCrownTransition(true); // 왕관 변환 시작
    }
  };

  // 왕관 변환 완료 후 흰색 페이드 시작
  const handleCrownComplete = () => setWhiteFadeState('fadeIn');

  // 페이드 인 끝나면
  const handleWhiteFadeInComplete = () => {
    setShowFinalCrown(true); // 배경/왕관 변경
    setWhiteFadeState('fadeOut');
  };

  // 페이드 아웃 끝나면
  const handleWhiteFadeOutComplete = () => setWhiteFadeState('none');

  // 흰색 페이드 인/아웃 오버레이 (최상단에 항상 렌더)
  const WhiteFadeOverlay = () => (
    (whiteFadeState === 'fadeIn' || whiteFadeState === 'fadeOut') && (
      <motion.div
        className="fixed inset-0 bg-white z-[9999]"
        initial={{ opacity: whiteFadeState === 'fadeIn' ? 0 : 1 }}
        animate={{ opacity: whiteFadeState === 'fadeIn' ? 1 : 0 }}
        transition={{
          duration: 0.5,
          ease: whiteFadeState === 'fadeIn' ? 'easeIn' : 'easeOut'
        }}
        style={{ pointerEvents: 'none' }}
        onAnimationComplete={() => {
          if (whiteFadeState === 'fadeIn') handleWhiteFadeInComplete();
          if (whiteFadeState === 'fadeOut') handleWhiteFadeOutComplete();
        }}
      />
    )
  );

  // 성공 페이지 완료
  const handleSuccessComplete = () => {
    console.log('Quest5: 성공 페이지 완료');
    onComplete?.(100);
  };

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

  // 왕관 변환 화면 (2_배경에서 스르륵 효과)
  if (showCrownTransition && !showWhiteFade && !showFinalCrown) {
    return (
      <>
        <div
          className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${bg2})` }}
        >
          {/* 중앙 왕관 - 좌에서 우로 스르륵 변환 */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative" style={{ width: '200px', height: '200px' }}>
              {/* 원래 왕관 (4_왕관) */}
              <motion.img
                src={crown4}
                alt="원래 왕관"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                draggable={false}
                animate={{
                  clipPath: ['inset(0 0 0 0)', 'inset(0 0 0 100%)']
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                onAnimationComplete={handleCrownComplete}
              />
              {/* 성공 왕관 (성공왕관) */}
              <motion.img
                src={successCrown}
                alt="성공 왕관"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                draggable={false}
                animate={{
                  clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)']
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>
        <WhiteFadeOverlay />
      </>
    );
  }

  // 최종 왕관 화면 (Q5-성공_배경 + 반짝거리는 효과)
  if (showFinalCrown) {
    return (
      <>
        <div
          className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center overflow-hidden cursor-pointer"
          style={{ backgroundImage: `url(${q5SuccessBg})` }}
          onClick={onNext} // 화면 클릭 시 FinalMessagePage로 이동
        >
          {/* 반짝이는 효과 */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full pointer-events-none"
              style={{
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
          {/* 중앙 왕관 */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <img
              src={successCrown}
              alt="성공 왕관"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'contain'
              }}
              draggable={false}
            />
          </div>
        </div>
        <WhiteFadeOverlay />
      </>
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
            src={answeredQuizImageUrl || currentQuiz?.imageUrl || problemImage}
            alt="틀린 문제 캐릭터"
            style={{ width: '290px', height: 'auto' }}
            draggable={false}
          />
        </div>

        {/* 하단 다시하기 DialogBox */}
        <div className="flex-shrink-0">
          <div onClick={handleRetry} style={{ cursor: 'pointer' }}>
            <DialogBox text="다시하기" fontSize="text-[26px]" />
          </div>
        </div>
      </div>
    );
  }

  // 메인 퀴즈 화면
  if (!selectedObject) {
    // 1단계: 물체 선택 화면
    return (
      <>
        <div
          className="relative w-full h-full flex flex-col items-center justify-between bg-cover bg-center py-8"
          style={{ backgroundImage: `url(${bg5})` }}
        >
        {/* 상단 문제 문장 */}
        <div className="flex-shrink-0">
          <DialogBox text="지금 무엇을 해야할까?" fontSize="text-[26px]" />
        </div>

        {/* 중앙 문제 이미지 */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <img
            src={currentQuiz?.imageUrl || problemImage}
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
                { id: "머핀", image: object1, name: "머핀" },
                { id: "폭탄", image: object2, name: "폭탄" },
                { id: "목줄", image: object3, name: "목줄" },
                { id: "고양이", image: object4, name: "고양이" }
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
      <WhiteFadeOverlay />
      </>
    );
  }

  // 2단계: 메시지 선택 화면
  return (
    <>
      <div
        className="relative w-full h-full flex flex-col items-center justify-between bg-cover bg-center py-8"
        style={{ backgroundImage: `url(${bg5})` }}
      >
      {/* 상단 문제 문장 */}
      <div className="flex-shrink-0">
        <DialogBox text="이제 어떤 말을 해야할까?" fontSize="text-[26px]" />
      </div>

      {/* 중앙 문제 이미지 */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <img
          src={currentQuiz?.imageUrl || problemImage}
          alt="문제 이미지"
          style={{ width: '290px', height: 'auto' }}
          draggable={false}
        />
      </div>

      {/* 하단 메시지 선택 영역 (스크롤 가능) */}
      <div className="flex-shrink-0 w-full relative" style={{ height: '200px' }}>
        <div 
          className="absolute overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{ 
            left: '42px', 
            top: '0px',
            width: 'calc(100% - 84px)',
            height: '100%',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none' /* IE and Edge */
          }}
        >
          <style>
            {`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          <div className="flex flex-col space-y-3" style={{ padding: '10px 0' }}>
            {[
              "너무 무서웠지? 걱정마 내가 지켜줄게", // 정답
              "무서울 수 있지. 근데 그런 건 네가 혼자서 이겨내야 해",
              "그만 떨고 조용히 좀 해",
              "이 개 너무 귀엽지 않아?",
              "겨우 이런게 무서운거야?"
            ].map((message) => (
              <div
                key={message}
                onClick={() => handleMessageSelect(message)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: selectedMessage === message ? 'scale(1.02)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedMessage !== message) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMessage !== message) {
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <DialogBox 
                  text={message} 
                  fontSize="text-[18px]"
                  bold={selectedMessage === message}
                />
              </div>
            ))}
          </div>
                  </div>
        </div>
      </div>
      <WhiteFadeOverlay />
      </>
    );
  };

export default Quest5; 