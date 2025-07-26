import React from 'react';
import { motion } from 'framer-motion';
import crownSuccess from '../assets/성공왕관.png';
import { COMMON_STYLES, ANIMATIONS } from '../utils/styles';

interface LoadingSpinnerProps {
  text?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = "로딩 중...", 
  size = 80 
}) => {
  return (
    <motion.div 
      style={COMMON_STYLES.loadingContainer}
      {...ANIMATIONS.fadeIn}
    >
      <motion.img
        src={crownSuccess}
        alt="로딩중"
        style={{
          width: size,
          height: size,
          marginBottom: 18,
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        style={COMMON_STYLES.loadingText}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner; 