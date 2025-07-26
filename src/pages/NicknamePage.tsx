import React, { useEffect } from "react";
import nicknameBg from "../assets/닉네임배경.png";
import inputBox from "../assets/닉네임_입력창.png";
import confirmBtn from "../assets/버튼_확인.png";
import backBtn from "../assets/Button/back.png";
import { AuthService } from "../services/authService";

interface NicknamePageProps {
  onComplete: (nickname: string) => void;
  onBack?: () => void;
}

const NicknamePage: React.FC<NicknamePageProps> = ({ onComplete, onBack }) => {
  const [nickname, setNickname] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  // 컴포넌트 마운트 시 기존 닉네임 조회
  useEffect(() => {
    const fetchExistingNickname = async () => {
      try {
        console.log('기존 닉네임 조회 시작...');
        const existingNickname = await AuthService.fetchNickname();
        
        if (existingNickname) {
          console.log('기존 닉네임 발견:', existingNickname);
          setNickname(existingNickname);
        } else {
          console.log('기존 닉네임 없음');
        }
      } catch (error) {
        console.error('닉네임 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingNickname();
  }, []);

  // 로딩 중일 때 표시할 내용
  if (isLoading) {
    return (
      <div
        className="relative w-full h-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${nicknameBg})` }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">닉네임 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${nicknameBg})` }}
    >
      {/* 이전 버튼 */}
      {onBack && (
        <div
          style={{
            position: 'absolute',
            left: '24px',
            top: '24px',
            zIndex: 10,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={onBack}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img
            src={backBtn}
            alt="이전"
            style={{
              width: '40px',
              height: '40px',
              display: 'block'
            }}
            draggable={false}
          />
        </div>
      )}

      {/* 닉네임 입력창 이미지 */}
      <div style={{
        position: 'absolute',
        left: '38px',
        top: '335px',
        width: '300px',
        height: 'auto'
      }}>
        <img
          src={inputBox}
          alt="닉네임 입력창"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none'
          }}
          draggable={false}
        />
        <input
          className="absolute inset-0 bg-transparent border-none outline-none text-center text-2xl font-bold text-gray-700 px-4"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          autoFocus
          style={{
            transform: 'translateY(-7px) translateX(-5px)'
          }}
        />
      </div>
      
      {/* 확인 버튼 이미지 */}
      <img
        src={confirmBtn}
        alt="확인"
        style={{
          position: 'absolute',
          left: '120px',
          top: '456px',
          width: 'auto',
          height: 'auto',
          cursor: nickname.trim() ? 'pointer' : 'not-allowed',
          display: 'block'
        }}
        onClick={() => nickname.trim() && onComplete(nickname)}
        draggable={false}
      />
    </div>
  );
};

export default NicknamePage; 