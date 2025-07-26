import type { AuthUser } from '../types/api';

// 토큰 저장/조회/삭제
export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// 사용자 정보 저장/조회/삭제
export const setUserInfo = (user: AuthUser): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserInfo = (): AuthUser | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const clearUserInfo = (): void => {
  localStorage.removeItem('user');
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return getAuthToken() !== null;
};

// OAuth 성공 처리 (accessToken 저장)
export const handleOAuthSuccess = (accessToken: string): boolean => {
  try {
    console.log('auth: OAuth 성공 처리 시작');
    console.log('auth: 받은 accessToken:', accessToken);
    console.log('auth: accessToken 길이:', accessToken.length);
    
    if (accessToken && accessToken.trim() !== '') {
      setAuthToken(accessToken);
      console.log('auth: 토큰 저장 완료');
      
      // 저장 확인
      const savedToken = getAuthToken();
      console.log('auth: 저장된 토큰 확인:', savedToken ? '저장됨' : '저장 안됨');
      console.log('auth: 저장된 토큰 길이:', savedToken?.length || 0);
      
      console.log('✅ 로그인 성공. 토큰 저장 완료');
      return true;
    } else {
      console.error('❌ accessToken이 비어있음');
      return false;
    }
  } catch (error) {
    console.error('auth: OAuth 성공 처리 중 오류:', error);
    return false;
  }
};

// API 요청에 인증 헤더 추가
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// 자동 로그인 체크
export const checkAutoLogin = async (): Promise<AuthUser | null> => {
  console.log('auth: 자동 로그인 체크 시작');
  
  if (!isLoggedIn()) {
    console.log('auth: 로그인 상태 아님');
    return null;
  }

  try {
    console.log('auth: 닉네임 조회로 토큰 유효성 검증 시작');
    // 서비스 클래스 사용
    const { AuthService } = await import('../services/authService');
    const nickname = await AuthService.fetchNickname();
    console.log('auth: 닉네임 조회 결과:', nickname);
    
    if (nickname) {
      const user: AuthUser = {
        id: '',
        nickname: nickname,
        email: '',
        profileImage: ''
      };
      setUserInfo(user);
      console.log('auth: 자동 로그인 성공');
      return user;
    } else {
      console.log('auth: 닉네임 조회 실패, 로그아웃 처리');
      const { AuthService } = await import('../services/authService');
      await AuthService.logout();
      return null;
    }
  } catch (error) {
    console.error('auth: 자동 로그인 체크 실패:', error);
    console.log('auth: 오류 발생으로 로그아웃 처리');
    const { AuthService } = await import('../services/authService');
    await AuthService.logout();
    return null;
  }
}; 