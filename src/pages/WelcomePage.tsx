import React from "react";
import nicknameBg from "../assets/닉네임배경.png";
import dialog1 from "../assets/1_대사.png";
import arrowRight from "../assets/but_오른쪽화살표.png";

interface WelcomePageProps {
  nickname: string;
  onNext?: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ nickname, onNext }) => {
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

export default WelcomePage; 