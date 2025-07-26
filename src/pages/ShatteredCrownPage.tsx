import React from "react";
import { motion } from "framer-motion";
import darkBg from "../assets/암흑배경.png";
import crown from "../assets/박살난왕관.png";
import dialog2 from "../assets/2_대사.png";
import arrowRight from "../assets/but_오른쪽화살표.png";

interface ShatteredCrownPageProps {
  onNext?: () => void;
}

const ShatteredCrownPage: React.FC<ShatteredCrownPageProps> = ({ onNext }) => {
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
              zIndex: 11
            }}
            onClick={onNext}
            draggable={false}
          />
        )}
      </div>
    </div>
  );
};

export default ShatteredCrownPage; 