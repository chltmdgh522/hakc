import type { AuthUser } from '../types/api';

// 토큰 저장/조회/삭제
export const setAuthToken = (token: string): void => {
  if (!token || token.trim() === '') {
    console.error('auth: 빈 토큰 저장 시도');
    return;
  }
  
  try {
    // 토큰 유효성 검사 (JWT 형식인지 확인)
    if (token.split('.').length !== 3) {
      console.error('auth: 잘못된 JWT 토큰 형식');
      return;
    }
    
    localStorage.setItem('accessToken', token);
    console.log('auth: 토큰 저장 완료, 길이:', token.length);
  } catch (error) {
    console.error('auth: 토큰 저장 실패:', error);
  }
};

export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    
    // 토큰 유효성 검사
    if (token.trim() === '') {
      console.log('auth: 빈 토큰 발견, 제거');
      clearAuthToken();
      return null;
    }
    
    // JWT 형식 검사
    if (token.split('.').length !== 3) {
      console.log('auth: 잘못된 JWT 형식 토큰 발견, 제거');
      clearAuthToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('auth: 토큰 조회 실패:', error);
    return null;
  }
};

export const clearAuthToken = (): void => {
  try {
    // localStorage 정리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    // sessionStorage 정리
    sessionStorage.clear();
    
    // 쿠키 정리
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // 추가적인 인증 관련 데이터 정리
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('token') || key.includes('auth') || key.includes('user'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('auth: 모든 인증 데이터 정리 완료');
  } catch (error) {
    console.error('auth: 토큰 정리 중 오류:', error);
  }
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

// JWT 토큰 디코딩 (페이로드 부분만)
export const decodeJwtToken = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('auth: JWT 토큰 디코딩 실패:', error);
    return null;
  }
};

// 토큰 만료 검사
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJwtToken(token);
    if (!decoded || !decoded.exp) {
      return true; // 만료 정보가 없으면 만료된 것으로 처리
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;
    
    if (isExpired) {
      console.log('auth: 토큰 만료됨, 만료시간:', new Date(decoded.exp * 1000));
    }
    
    return isExpired;
  } catch (error) {
    console.error('auth: 토큰 만료 검사 실패:', error);
    return true; // 에러 발생 시 만료된 것으로 처리
  }
};

// 토큰 상태 디버깅 (개발용)
export const debugTokenStatus = (): void => {
  try {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    console.log('=== 토큰 상태 디버깅 ===');
    console.log('accessToken 존재:', !!token);
    console.log('accessToken 길이:', token?.length || 0);
    console.log('user 정보 존재:', !!user);
    
    if (token) {
      const decoded = decodeJwtToken(token);
      if (decoded) {
        console.log('토큰 만료시간:', new Date(decoded.exp * 1000));
        console.log('현재시간:', new Date());
        console.log('토큰 만료됨:', isTokenExpired(token));
      }
    }
    console.log('========================');
  } catch (error) {
    console.error('토큰 상태 디버깅 실패:', error);
  }
};

// 로그인 상태 확인 (토큰 만료 검사 포함)
export const isLoggedIn = (): boolean => {
  const token = getAuthToken();
  if (!token) {
    return false;
  }
  
  // 토큰 만료 검사
  if (isTokenExpired(token)) {
    console.log('auth: 만료된 토큰 발견, 자동 정리');
    clearAuthToken();
    return false;
  }
  
  return true;
};

// OAuth 성공 처리 (accessToken 저장)
export const handleOAuthSuccess = (accessToken: string): boolean => {
  try {
    console.log('auth: OAuth 성공 처리 시작');
    console.log('auth: 받은 accessToken 길이:', accessToken?.length || 0);
    
    if (!accessToken || accessToken.trim() === '') {
      console.error('❌ accessToken이 비어있음');
      return false;
    }
    
    // JWT 형식 검사
    if (accessToken.split('.').length !== 3) {
      console.error('❌ 잘못된 JWT 토큰 형식');
      return false;
    }
    
    // 토큰 만료 검사
    if (isTokenExpired(accessToken)) {
      console.error('❌ 이미 만료된 토큰');
      return false;
    }
    
    // 기존 토큰 정리
    clearAuthToken();
    
    // 새 토큰 저장
    setAuthToken(accessToken);
    console.log('auth: 토큰 저장 완료');
    
    // 저장 확인
    const savedToken = getAuthToken();
    if (savedToken === accessToken) {
      console.log('✅ 로그인 성공. 토큰 저장 완료');
      
      // 토큰 정보 로깅 (디버깅용)
      const decoded = decodeJwtToken(accessToken);
      if (decoded) {
        console.log('auth: 토큰 만료시간:', new Date(decoded.exp * 1000));
      }
      
      return true;
    } else {
      console.error('❌ 토큰 저장 확인 실패');
      return false;
    }
  } catch (error) {
    console.error('auth: OAuth 성공 처리 중 오류:', error);
    return false;
  }
};

// API 요청에 인증 헤더 추가 (토큰 검증 포함)
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  
  // 토큰이 없거나 만료된 경우
  if (!token || isTokenExpired(token)) {
    console.log('auth: 유효하지 않은 토큰으로 API 요청 시도');
    return {
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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