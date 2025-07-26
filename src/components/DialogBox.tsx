import React from "react";
import dialogBoxBg from "../assets/Button/대표박스.png";

interface DialogBoxProps {
  text: string;
  fontSize?: string; // Tailwind class
  bold?: boolean;
}

const DialogBox: React.FC<DialogBoxProps> = ({ text, fontSize = "text-[26px]", bold = true }) => {
  return (
    <div className="relative w-[290px] h-[80px] flex items-center justify-center">
      <img
        src={dialogBoxBg}
        alt="대사박스"
        className="absolute w-[290px] h-[80px] z-0"
        draggable={false}
      />
      <div 
        className={`z-10 ${fontSize} font-bold font-['Noto_Sans_KR'] text-center`}
        style={{ color: '#1D1D1D' }}
      >
        {text}
      </div>
    </div>
  );
};

// 상단 DialogBox 래퍼 (y=71 위치)
interface TopDialogBoxProps extends DialogBoxProps {
  onClick?: () => void;
}

export const TopDialogBox: React.FC<TopDialogBoxProps> = ({ text, fontSize, bold, onClick }) => {
  return (
    <div 
      className="absolute" 
      style={{ 
        top: '71px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <DialogBox text={text} fontSize={fontSize} bold={bold} />
    </div>
  );
};

// 하단 DialogBox 래퍼 (y=685 위치)
interface BottomDialogBoxProps extends DialogBoxProps {
  onClick?: () => void;
}

export const BottomDialogBox: React.FC<BottomDialogBoxProps> = ({ text, fontSize, bold, onClick }) => {
  return (
    <div 
      className="absolute" 
      style={{ 
        top: '685px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        zIndex: 10,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <DialogBox text={text} fontSize={fontSize} bold={bold} />
    </div>
  );
};

export default DialogBox; 