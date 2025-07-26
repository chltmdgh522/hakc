import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import nicknameBg from "../assets/닉네임배경.png";
import dialog1 from "../assets/1_대사.png";
import darkBg from "../assets/암흑배경.png";
import crown from "../assets/박살난왕관.png";
import dialog2 from "../assets/2_대사.png";
import arrowRight from "../assets/but_오른쪽화살표.png";

interface WelcomeShatteredPageProps {
  nickname: string;
  onNext?: () => void;
}

const WelcomeShatteredPage: React.FC<WelcomeShatteredPageProps> = ({ nickname, onNext }) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'shattered'>('welcome');
  const [showArrow, setShowArrow] = useState(false);

  // Welcome 단계에서 3초 후 화살표 표시
  useEffect(() => {
    if (currentStep === 'welcome') {
      const timer = setTimeout(() => {
        setShowArrow(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleWelcomeClick = () => {
    setCurrentStep('shattered');
    setShowArrow(false);
  };

  const handleShatteredClick = () => {
    onNext?.();
  };

  return (
    <AnimatePresence mode="wait">
      {currentStep === 'welcome' ? (
        <motion.div
          key="welcome"
          className="relative w-full h-full flex flex-col items-center justify-end bg-cover bg-center"
          style={{ backgroundImage: `url(${nicknameBg})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleWelcomeClick}
        >
          {/* 대사박스(글자 포함) + 화살표 */}
          <motion.div 
            style={{
              position: 'absolute',
              top: '592px',
              left: '30px',
              width: '316px',
              height: 'auto',
              zIndex: 10
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
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
            <AnimatePresence>
              {showArrow && (
                <motion.img
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
                    zIndex: 11
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleWelcomeClick}
                  draggable={false}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="shattered"
          className="relative w-full h-full flex flex-col items-center justify-end bg-cover bg-center"
          style={{ backgroundImage: `url(${darkBg})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleShatteredClick}
        >
          {/* 흔들리는 왕관 */}
          <motion.div 
            style={{
              position: 'absolute',
              top: '126px',
              left: '0',
              width: '375px',
              height: '399px'
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.img
              src={crown}
              alt="박살난 왕관"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, -10, 10, -8, 8, -5, 5, 0] }}
              transition={{ duration: 0.8, repeat: 1, delay: 1 }}
            />
          </motion.div>

          {/* 대사박스(글자 포함) + 화살표 */}
          <motion.div 
            style={{
              position: 'absolute',
              top: '592px',
              left: '30px',
              width: '316px',
              height: 'auto',
              zIndex: 10
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
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
            <motion.img
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
                zIndex: 11
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 2.5 }}
              onClick={handleShatteredClick}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeShatteredPage; 