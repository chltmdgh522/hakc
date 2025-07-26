import React from "react";
import choiceBoxImg from "../assets/Button/대사박스.png";

interface ChoiceButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ label, isSelected = false, onClick }) => {
  return (
    <div
      className="relative w-[130px] h-[68px] flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={choiceBoxImg}
        alt="선택박스"
        className="absolute w-full h-full object-contain"
        draggable={false}
      />
      <span 
        className="relative z-10 text-[24px] font-['Noto_Sans_KR'] font-bold text-center"
        style={{ color: '#070707' }}
      >
        {label}
      </span>
    </div>
  );
};

export default ChoiceButton; 