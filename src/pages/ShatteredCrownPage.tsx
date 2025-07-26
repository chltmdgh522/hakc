import React, { useState } from "react";
import { motion } from "framer-motion";
import darkBg from "../assets/암흑배경.png";
import crown from "../assets/박살난왕관.png";
import dialog2 from "../assets/2_대사.png";
import arrowRight from "../assets/but_오른쪽화살표.png";
import { speakText, stopTTS } from "../utils/tts";

interface ShatteredCrownPageProps {
  onNext?: () => void;
}

const ShatteredCrownPage: React.FC<ShatteredCrownPageProps> = ({ onNext }) => {
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  
  // TTS로 읽을 대사 텍스트
  const shatteredText = "아, 이런! 감정의 왕관이 깨져버렸네요. 하지만 걱정하지 마세요. 당신의 도움이 필요합니다. 이 세계의 감정들을 다시 찾아주세요.";

  const handleNext = async () => {
    // TTS가 재생 중이면 중지
    if (isTTSPlaying) {
      stopTTS();
      setIsTTSPlaying(false);
      onNext?.();
      return;
    }

    // TTS 재생
    try {
      setIsTTSPlaying(true);
      await speakText(shatteredText, {
        rate: 0.8,
        pitch: 1.0,
        volume: 1.0
      });
      setIsTTSPlaying(false);
      onNext?.();
    } catch (error) {
      console.error('TTS 재생 실패:', error);
      setIsTTSPlaying(false);
      onNext?.();
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${darkBg})` }}
    >
      <div className="absolute left-1/2 top-[39%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.img
          src={crown}
          alt="박살난 왕관"
          style={{
            width: '399px',
            height: 'auto',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -8, 8, -5, 5, 0] }}
          transition={{ duration: 0.8, repeat: 1 }}
        />
      </div>
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
          src={dialog2}
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
              width: 28,
              height: 30,
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
    </div>
  );
};

export default ShatteredCrownPage; 