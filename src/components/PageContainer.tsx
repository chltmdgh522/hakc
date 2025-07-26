import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMMON_STYLES, ANIMATIONS } from '../utils/styles';

interface PageContainerProps {
  children: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  style?: React.CSSProperties;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  showBackButton = false, 
  onBack,
  style 
}) => {
  return (
    <AnimatePresence>
      <motion.div
        {...ANIMATIONS.fadeIn}
        style={{ ...COMMON_STYLES.pageContainer, ...style }}
      >
        <motion.div
          style={COMMON_STYLES.cardContainer}
          {...ANIMATIONS.slideUp}
        >
          {showBackButton && onBack && (
            <BackButton onClick={onBack} />
          )}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// BackButton 컴포넌트 임포트
import BackButton from './BackButton';

export default PageContainer; 