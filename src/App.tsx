import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TempLoginPage from './pages/TempLoginPage';
import FirstScreenPage from './pages/FirstScreenPage';
import OAuthSuccess from './pages/OAuthSuccess';
import { useWindowSize } from './hooks';
import ErrorBoundary from './components/ErrorBoundary';
import { checkAutoLogin, isLoggedIn } from './utils/auth';
import { MusicProvider } from './contexts/MusicContext';
import type { AuthUser } from './types';

function getBoxStyle(width: number, height: number) {
  const targetWidth = 375;
  const targetHeight = 812;
  
  // 화면이 375x812보다 작으면 스케일링
  let scale = 1;
  if (width < targetWidth || height < targetHeight) {
    const scaleX = width / targetWidth;
    const scaleY = height / targetHeight;
    scale = Math.min(scaleX, scaleY);
  }
  
  return {
    width: `${targetWidth}px`,
    height: `${targetHeight}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    background: '#fff',
    boxShadow: '0 4px 32px 0 rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
  };
}

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { width, height } = useWindowSize();
  
  const boxStyle = getBoxStyle(width, height);

  // 카카오 SDK 초기화 및 자동 로그인 체크
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('App: 앱 초기화 시작...');
        setIsLoading(true);
        
        // 백엔드 방식으로 전환되어 SDK 초기화 불필요
        console.log('App: 백엔드 방식 사용 - SDK 초기화 생략');
        
        // 자동 로그인 체크
        console.log('App: 자동 로그인 체크 시작...');
        
        // 로컬에 저장된 로그인 상태 확인
        const hasToken = isLoggedIn();
        console.log('App: 로컬 토큰 존재 여부:', hasToken);
        
        if (hasToken) {
          console.log('App: 토큰 존재, 유효성 검증 시작...');
          // 토큰 유효성 검증 및 사용자 정보 가져오기
          const userInfo = await checkAutoLogin();
          console.log('App: 자동 로그인 결과:', userInfo ? '성공' : '실패');
          
          if (userInfo) {
            setUser(userInfo);
            setIsLoggedInState(true);
            console.log('App: 로그인 상태 설정 완료');
          } else {
            console.log('App: 자동 로그인 실패, 로그인 페이지로 이동');
            setIsLoggedInState(false);
          }
        } else {
          console.log('App: 토큰 없음, 로그인 페이지로 이동');
          setIsLoggedInState(false);
        }
      } catch (error) {
        console.error('App: 앱 초기화 실패:', error);
        setIsLoggedInState(false);
      } finally {
        setIsLoading(false);
        console.log('App: 로딩 완료');
      }
    };

    initializeApp();
  }, []);

  // 로그아웃 상태 변경 감지
  useEffect(() => {
    console.log('🔍 App: isLoggedInState 변경 감지:', isLoggedInState);
    if (!isLoggedInState && !isLoading) {
      console.log('🔍 App: 로그아웃 상태 감지, 로그인 페이지로 강제 이동');
      navigate('/', { replace: true });
    }
  }, [isLoggedInState, isLoading, navigate]);

  const handleLoginSuccess = () => {
    console.log('🔍 App: handleLoginSuccess 호출됨');
    console.log('🔍 App: isLoggedInState 변경 전:', isLoggedInState);
    
    // 즉시 상태 변경
    setIsLoggedInState(true);
    console.log('🔍 App: isLoggedInState를 true로 설정 완료');
  };

  const handleLogout = () => {
    console.log('🔍 App: handleLogout 호출됨');
    console.log('🔍 App: 현재 isLoggedInState:', isLoggedInState);
    
    setIsLoggedInState(false);
    setUser(null);
    console.log('🔍 App: 로그아웃 상태 설정 완료 (isLoggedInState = false)');
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        (() => {
          console.log('🔍 App: 라우팅 조건 확인 - isLoggedInState:', isLoggedInState);
          if (isLoggedInState) {
            console.log('🔍 App: FirstScreenPage 렌더링');
            return <FirstScreenPage onLogout={handleLogout} />;
          } else {
            console.log('🔍 App: LoginPage 렌더링');
            return <LoginPage onLoginSuccess={handleLoginSuccess} />;
          }
        })()
      } />
      <Route path="/temp-login" element={<TempLoginPage onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const { width, height } = useWindowSize();
  const boxStyle = getBoxStyle(width, height);

  return (
    <ErrorBoundary>
      <MusicProvider>
        <div className="fixed inset-0 flex items-center justify-center bg-[#ECEEEF]">
          <div style={boxStyle}>
            <Router>
              <AppContent />
            </Router>
          </div>
        </div>
      </MusicProvider>
    </ErrorBoundary>
  );
};

export default App;
