import React, { useState } from "react";
import nicknameBg from "../assets/닉네임배경.png";
import dialog1 from "../assets/1_대사.png";
import arrowRight from "../assets/but_오른쪽화살표.png";
import { speakText, stopTTS, isTTSSupported } from "../utils/tts";

interface WelcomePageProps {
  nickname: string;
  onNext?: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ nickname, onNext }) => {
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  
  // TTS로 읽을 대사 텍스트
  const welcomeText = `${nickname}님, 감정의 세계에 오신 것을 환영합니다. 이곳에서 당신은 다양한 감정들을 경험하고 배울 수 있습니다. 준비되셨나요?`;

  const handleNext = async () => {
    console.log('WelcomePage: handleNext 호출됨');
    
    // TTS 지원 여부 확인
    const ttsSupported = isTTSSupported();
    console.log('WelcomePage: TTS 지원 여부:', ttsSupported);
    
    if (!ttsSupported) {
      console.log('WelcomePage: TTS 미지원, 바로 다음 페이지로 이동');
      onNext?.();
      return;
    }

    // TTS가 재생 중이면 중지
    if (isTTSPlaying) {
      console.log('WelcomePage: TTS 재생 중지');
      stopTTS();
      setIsTTSPlaying(false);
      onNext?.();
      return;
    }

    // TTS 재생
    try {
      console.log('WelcomePage: TTS 재생 시작');
      setIsTTSPlaying(true);
      await speakText(welcomeText, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0
      });
      console.log('WelcomePage: TTS 재생 완료');
      setIsTTSPlaying(false);
      onNext?.();
    } catch (error) {
      console.error('WelcomePage: TTS 재생 실패:', error);
      setIsTTSPlaying(false);
      onNext?.();
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${nicknameBg})` }}
    >
      {/* 대사박스(글자 포함) + 화살표 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        bottom: '32px',
        transform: 'translateX(-50%)',
        width: '316px',
        height: 'auto',
        zIndex: 10
      }}>
        <img
          src={dialog1}
          alt="대사박스"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
          draggable={false}
        />
        {onNext && (
          <img
            src={arrowRight}
            alt="다음"
            style={{
              position: 'absolute',
              right: '12%',
              bottom: '17%',
              width: '28px',
              height: '30px',
              cursor: 'pointer',
              userSelect: 'none',
              zIndex: 11,
              filter: isTTSPlaying ? 'brightness(0.7)' : 'brightness(1)',
              transition: 'filter 0.3s ease'
            }}
            onClick={handleNext}
            draggable={false}
          />
        )}
      </div>

      {/* TTS 상태 표시 */}
      {isTTSPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '14px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '8px 16px',
            borderRadius: '20px',
            zIndex: 20
          }}
        >
          🔊 대사 재생 중...
        </div>
      )}

      {/* TTS 미지원 시 안내 */}
      {!isTTSSupported() && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '12px',
            backgroundColor: 'rgba(255,0,0,0.7)',
            padding: '6px 12px',
            borderRadius: '16px',
            zIndex: 20
          }}
        >
          ⚠️ TTS 미지원 브라우저
        </div>
      )}
    </div>
  );
};

export default WelcomePage; 