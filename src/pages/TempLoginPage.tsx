import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/KakaoLoginPage/로그인배경.png";
import kakaoLoginBtn from "../assets/KakaoLoginPage/카카오로그인버튼.png";
import SettingsIcon from "../components/SettingsIcon";
import SettingsModal from "../components/SettingsModal";
import { setAuthToken } from "../utils/auth";

interface TempLoginPageProps {
  onLoginSuccess: () => void;
}

const TempLoginPage: React.FC<TempLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTempLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      console.log('개발 모드: 임시 로그인 처리');
      
      // 실제 카카오 로그인을 통해 유효한 토큰을 받아오기
      const { AuthService } = await import('../services/authService');
      const kakaoLoginUrl = await AuthService.requestKakaoLogin();
      
      if (kakaoLoginUrl) {
        console.log('카카오 로그인 URL 받음, 리다이렉트 시작...');
        window.location.href = kakaoLoginUrl;
      } else {
        console.error('카카오 로그인 URL 요청 실패');
        // 폴백: 임시 토큰으로 진행 (API 호출은 실패할 수 있음)
        const tempToken = 'dev_temp_token_' + Date.now();
        setAuthToken(tempToken);
        console.log('개발 모드 로그인 성공 (임시 토큰)');
        onLoginSuccess();
        navigate('/');
      }
    } catch (error) {
      console.error('임시 로그인 오류:', error);
      // 에러 시에도 임시 토큰으로 진행
      const tempToken = 'dev_temp_token_' + Date.now();
      setAuthToken(tempToken);
      onLoginSuccess();
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 0,
        overflow: "hidden"
      }}
    >
      {/* 설정 아이콘 */}
      <SettingsIcon
        onClick={handleSettingsClick}
        variant="colored"
        position={{ x: 12, y: 12 }}
      />

      {/* 임시 로그인 버튼 */}
      <div
        style={{
          position: "absolute",
          left: "42%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          filter: isHovered ? "drop-shadow(0 8px 16px rgba(255, 193, 7, 0.4))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
          transition: "all 0.3s ease",
          zIndex: 4
        }}
      >
        <img
          src={kakaoLoginBtn}
          alt="임시 로그인"
          style={{
            width: "125%",
            maxWidth: "300px",
            height: "auto",
            cursor: "pointer",
            userSelect: "none",
            transition: "all 0.3s ease",
            filter: isHovered ? "brightness(1.2)" : "brightness(1)",
            transform: isHovered ? "scale(1.05)" : "scale(1)"
          }}
          draggable={false}
          onClick={handleTempLogin}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      </div>

      {/* 버튼 주변 글로우 효과 */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "56%",
            transform: "translate(-50%, -50%)",
            width: "71%",
            maxWidth: "300px",
            height: "auto",
            background: "radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, transparent 70%)",
            animation: "glowPulse 1s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 3
          }}
        />
      )}

      {/* 임시 로그인 안내 텍스트 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "16px",
          textAlign: "center",
          zIndex: 4,
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
        }}
      >
        <p>🚀 임시 로그인 (개발용)</p>
        <p style={{ fontSize: "14px", opacity: 0.8 }}>버튼을 클릭하면 바로 로그인됩니다</p>
      </div>

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />

      {/* CSS 애니메이션 스타일 */}
      <style>
        {`
          @keyframes glowPulse {
            0%, 100% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.6;
              transform: translate(-50%, -50%) scale(1.1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(TempLoginPage); 