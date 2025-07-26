import React, { useState, useEffect, useRef } from "react";
import bgImg from "../assets/KakaoLoginPage/로그인배경.png";
import kakaoLoginBtn from "../assets/KakaoLoginPage/카카오로그인버튼.png";
import SettingsIcon from "../components/SettingsIcon";
import SettingsModal from "../components/SettingsModal";

import config from "../config";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  direction: number;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudsRef = useRef<Cloud[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 구름 초기화
    const initClouds = () => {
      cloudsRef.current = [
        { x: -200, y: 100, size: 120, speed: 0.5, opacity: 0.6, direction: 1 },
        { x: window.innerWidth + 200, y: 200, size: 100, speed: 0.3, opacity: 0.4, direction: -1 },
        { x: -150, y: 400, size: 80, speed: 0.7, opacity: 0.5, direction: 1 },
        { x: window.innerWidth + 150, y: 500, size: 90, speed: 0.4, opacity: 0.3, direction: -1 }
      ];
    };
    initClouds();

    // 구름 그리기 함수
    const drawCloud = (cloud: Cloud) => {
      ctx.save();
      ctx.globalAlpha = cloud.opacity;
      
      // 구름 그라데이션
      const gradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      
      // 구름 모양 그리기 (여러 원 조합)
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size * 0.3, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.4, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.3, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.2, cloud.y - cloud.size * 0.2, cloud.size * 0.25, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.6, cloud.y - cloud.size * 0.15, cloud.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    // 애니메이션 루프
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      cloudsRef.current.forEach((cloud, index) => {
        // 구름 이동
        cloud.x += cloud.speed * cloud.direction;
        
        // 화면 밖으로 나가면 반대편에서 다시 시작
        if (cloud.direction > 0 && cloud.x > canvas.width + cloud.size) {
          cloud.x = -cloud.size;
        } else if (cloud.direction < 0 && cloud.x < -cloud.size) {
          cloud.x = canvas.width + cloud.size;
        }
        
        drawCloud(cloud);
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleKakaoLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('카카오 로그인 시작...');
      
      // ===== 백엔드 방식 =====
      console.log('백엔드 방식으로 카카오 로그인 시작...');
      
      // 백엔드에서 카카오 로그인 링크 요청
      const response = await fetch(`${config.api.baseUrl}/oauth2/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('백엔드 응답 에러:', errorText);
        throw new Error(`백엔드 요청 실패 (${response.status}): ${errorText}`);
      }

      const kakaoLoginUrl = await response.text();
      
      if (kakaoLoginUrl) {
        console.log('카카오 로그인 링크 받음:', kakaoLoginUrl);
        console.log('카카오 로그인 링크 길이:', kakaoLoginUrl.length);
        console.log('외부 페이지로 이동 시작...');
        
        // 외부 카카오 로그인 페이지로 이동
        window.location.href = kakaoLoginUrl;
      } else {
        throw new Error('카카오 로그인 링크를 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
      setError(errorMessage);
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

      {/* Canvas 구름 효과 */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "400%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* 움직이는 배경 그라데이션 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
          animation: "gradientMove 8s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 2
        }}
      />

      {/* 반짝반짝 효과 - 별들 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 3
        }}
      >
        {/* 별 1 */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: "4px",
            height: "4px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2s infinite",
            boxShadow: "0 0 6px white"
          }}
        />
        {/* 별 2 */}
        <div
          style={{
            position: "absolute",
            top: "25%",
            right: "25%",
            width: "3px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.5s infinite 0.5s",
            boxShadow: "0 0 5px white"
          }}
        />
        {/* 별 3 */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "15%",
            width: "5px",
            height: "5px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 1.8s infinite 1s",
            boxShadow: "0 0 8px white"
          }}
        />
        {/* 별 4 */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            right: "15%",
            width: "3px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.2s infinite 0.3s",
            boxShadow: "0 0 5px white"
          }}
        />
        {/* 별 5 */}
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "30%",
            width: "4px",
            height: "4px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.8s infinite 0.8s",
            boxShadow: "0 0 6px white"
          }}
        />
        {/* 별 6 */}
        <div
          style={{
            position: "absolute",
            top: "65%",
            right: "35%",
            width: "3px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.1s infinite 1.2s",
            boxShadow: "0 0 5px white"
          }}
        />
        {/* 별 7 */}
        <div
          style={{
            position: "absolute",
            top: "75%",
            left: "25%",
            width: "4px",
            height: "4px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.4s infinite 0.6s",
            boxShadow: "0 0 6px white"
          }}
        />
        {/* 별 8 */}
        <div
          style={{
            position: "absolute",
            top: "85%",
            right: "20%",
            width: "3px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 1.9s infinite 0.9s",
            boxShadow: "0 0 5px white"
          }}
        />
        {/* 추가 별들 */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "60%",
            width: "2px",
            height: "2px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 3s infinite 1.5s",
            boxShadow: "0 0 4px white"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "70%",
            width: "3px",
            height: "3px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.7s infinite 0.7s",
            boxShadow: "0 0 5px white"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "10%",
            width: "2px",
            height: "2px",
            backgroundColor: "white",
            borderRadius: "50%",
            animation: "twinkle 2.3s infinite 1.1s",
            boxShadow: "0 0 4px white"
          }}
        />
      </div>

      {/* 카카오 로그인 버튼 */}
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
          alt="카카오 로그인"
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
          onClick={handleKakaoLogin}
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

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
      />

      {/* CSS 애니메이션 스타일 */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
          
          @keyframes gradientMove {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          
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

export default React.memo(LoginPage); 