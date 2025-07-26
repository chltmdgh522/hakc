import React from 'react';
import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS } from '../utils/styles';

interface AccessibleButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onClick,
  children,
  disabled = false,
  variant = 'primary',
  size = 'md',
  ariaLabel,
  ariaDescribedBy,
  className,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: COLORS.primary,
          color: '#fff',
          border: 'none',
        };
      case 'secondary':
        return {
          background: COLORS.secondary,
          color: '#fff',
          border: 'none',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: COLORS.primary,
          border: `2px solid ${COLORS.primary}`,
        };
      default:
        return {
          background: COLORS.primary,
          color: '#fff',
          border: 'none',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '6px',
        };
      case 'md':
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '8px',
        };
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '18px',
          borderRadius: '10px',
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '8px',
        };
    }
  };

  const buttonStyles = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    fontWeight: 600,
    transition: 'all 0.2s ease',
    ...style,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
      className={className}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...ANIMATIONS.buttonHover}
      whileFocus={{
        scale: 1.02,
        boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.3)',
      }}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </motion.button>
  );
};

export default AccessibleButton; 