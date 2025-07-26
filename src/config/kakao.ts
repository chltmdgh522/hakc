// 카카오 SDK 설정
export const KAKAO_CONFIG = {
  // 개발용 앱 키 (실제 배포 시에는 환경변수로 관리)
  APP_KEY: import.meta.env.VITE_KAKAO_APP_KEY || 'your_kakao_app_key_here',
  
  // 리다이렉트 URI (카카오 개발자 콘솔에서 설정한 것과 일치해야 함)
  REDIRECT_URI: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:5173',
  
  // 요청할 권한 범위
  SCOPE: 'profile_nickname,profile_image,account_email',
};

// 카카오 SDK 초기화
export const initKakaoSDK = (): boolean => {
  try {
    if (window.Kakao) {
      // 이미 초기화되어 있는지 확인
      if (window.Kakao.isInitialized()) {
        return true;
      }
      
      // SDK 초기화
      window.Kakao.init(KAKAO_CONFIG.APP_KEY);
      
      // 초기화 성공 여부 확인
      if (window.Kakao.isInitialized()) {
        console.log('카카오 SDK 초기화 성공');
        return true;
      } else {
        console.error('카카오 SDK 초기화 실패');
        return false;
      }
    } else {
      console.error('카카오 SDK가 로드되지 않았습니다.');
      return false;
    }
  } catch (error) {
    console.error('카카오 SDK 초기화 중 오류:', error);
    return false;
  }
};

// 카카오 로그인 상태 확인
export const isKakaoLoggedIn = (): boolean => {
  try {
    return window.Kakao?.Auth?.getAccessToken() !== null;
  } catch {
    return false;
  }
};

// 카카오 로그아웃
export const kakaoLogout = (): void => {
  try {
    if (window.Kakao?.Auth) {
      window.Kakao.Auth.logout();
    }
  } catch (error) {
    console.error('카카오 로그아웃 중 오류:', error);
  }
}; 