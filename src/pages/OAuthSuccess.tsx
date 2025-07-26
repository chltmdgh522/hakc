import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess: React.FC = () => {
    const navigate = useNavigate();

    // ✅ React 18 Strict Mode 대응: 중복 실행 방지
    const hasProcessed = useRef(false);

    useEffect(() => {
        const processOAuth = async () => {
            // ✅ 이미 처리된 경우 중복 실행 방지
            if (hasProcessed.current) {
                console.log('OAuthSuccess: 이미 처리됨, 중복 실행 방지');
                return;
            }

            console.log('OAuthSuccess: OAuth 처리 시작');
            console.log('OAuthSuccess: 현재 URL:', window.location.href);
            console.log('OAuthSuccess: URL search:', window.location.search);

            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get("accessToken");

            console.log('OAuthSuccess: accessToken 확인:', accessToken ? '있음' : '없음');
            console.log('OAuthSuccess: accessToken 값:', accessToken);

            if (accessToken && accessToken.trim() !== '') {
                // ✅ 처리 시작 표시
                hasProcessed.current = true;

                // 안전한 토큰 저장 (auth 유틸리티 사용)
                try {
                    const { handleOAuthSuccess } = await import('../utils/auth');
                    const success = handleOAuthSuccess(accessToken);
                    
                    if (success) {
                        console.log("✅ 로그인 성공. 토큰 저장 완료");
                    } else {
                        console.error("❌ 토큰 저장 실패");
                    }
                } catch (error) {
                    console.error("❌ 토큰 저장 중 오류:", error);
                }

                // ✅ URL을 깔끔하게 정리하고 홈으로 이동
                window.history.replaceState({}, document.title, "/");

                // ✅ 즉시 리다이렉트
                navigate("/");

            } else {
                console.error("❌ accessToken 없음 또는 빈 값");
                console.log('OAuthSuccess: URL 파라미터들:', Object.fromEntries(params.entries()));

                // ✅ 처리 시작 표시 (실패해도 중복 방지)
                hasProcessed.current = true;

                // ✅ 실패 시에도 URL 정리하고 로그인 페이지로 이동
                window.history.replaceState({}, document.title, "/");
                navigate("/");
            }
        };

        processOAuth();
    }, []); // ✅ 의존성 배열에서 navigate 제거 (navigate는 안정된 함수)

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontSize: "18px",
                fontFamily: "Noto Sans KR, sans-serif"
            }}
        >
            <div style={{ textAlign: "center" }}>
                <div
                    style={{
                        width: "60px",
                        height: "60px",
                        border: "4px solid rgba(255,255,255,0.3)",
                        borderTop: "4px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        margin: "0 auto 20px"
                    }}
                />
                <p>로그인 처리 중입니다...</p>
                {/* ✅ 개발 모드에서만 디버그 정보 표시 */}
                {import.meta.env.DEV && (
                    <div style={{ marginTop: "20px", fontSize: "14px", opacity: 0.8 }}>
                        <p>현재 URL: {window.location.href}</p>
                        <p>Access Token: {new URLSearchParams(window.location.search).get("accessToken") ? "있음" : "없음"}</p>
                    </div>
                )}
            </div>

            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default OAuthSuccess;