import React from 'react';
import { motion } from 'framer-motion';
import { COMMON_STYLES, ANIMATIONS } from '../utils/styles';

interface BackButtonProps {
  onClick: () => void;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, style }) => {
  return (
    <motion.div
      style={{ ...COMMON_STYLES.backButton, ...style }}
      {...ANIMATIONS.scaleHover}
    >
      <button onClick={onClick} style={COMMON_STYLES.backButtonIcon}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="20" fill="#E6F3FF"/>
          <path d="M23 14L17 20L23 26" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </motion.div>
  );
};

export default BackButton; 