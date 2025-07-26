import { api } from '../utils/apiClient';
import type { 
  AuthUser, 
  LoginResponse, 
  MyPageResponse 
} from '../types/api';

// 인증 서비스 클래스
export class AuthService {
  // 카카오 로그인 링크 요청
  static async requestKakaoLogin(): Promise<string | null> {
    try {
      return await api.get<string>('/oauth2/login');
    } catch (error) {
      console.error('카카오 로그인 링크 요청 실패:', error);
      return null;
    }
  }

  // 로그아웃
  static async logout(): Promise<boolean> {
    console.log('🔍 AuthService: 로그아웃 시작');
    
    // 현재 토큰 상태 확인
    const { getAuthToken, isTokenExpired } = await import('../utils/auth');
    const currentToken = getAuthToken();
    const isExpired = currentToken ? isTokenExpired(currentToken) : true;
    
    console.log('🔍 AuthService: 로그아웃 시 토큰 상태 - 존재:', !!currentToken, '만료:', isExpired);
    
    // 백엔드 로그아웃 API 호출 (토큰이 있을 때 먼저 실행)
    try {
      console.log('🔍 AuthService: 백엔드 로그아웃 API 호출 시도');
      
      // 로그를 localStorage에 저장
      const logKey = 'logout_debug_log';
      const logs = JSON.parse(localStorage.getItem(logKey) || '[]');
      logs.push(`[${new Date().toISOString()}] 로그아웃 시작`);
      
      // 로그아웃 API는 토큰 만료 여부와 관계없이 토큰을 포함하여 요청
      const { getAuthToken, decodeJwtToken, isTokenExpired } = await import('../utils/auth');
      const token = getAuthToken();
      
      console.log('🔍 AuthService: 토큰 디버깅 정보:');
      console.log('  - 토큰 존재:', !!token);
      console.log('  - 토큰 길이:', token?.length || 0);
      
      logs.push(`토큰 존재: ${!!token}, 길이: ${token?.length || 0}`);
      
      if (token) {
        console.log('  - 토큰 앞 20자:', token.substring(0, 20) + '...');
        console.log('  - 토큰 만료 여부:', isTokenExpired(token));
        
        logs.push(`토큰 앞 20자: ${token.substring(0, 20)}...`);
        logs.push(`토큰 만료 여부: ${isTokenExpired(token)}`);
        
        // JWT 디코딩 시도
        try {
          const decoded = decodeJwtToken(token);
          if (decoded) {
            console.log('  - JWT 페이로드:', decoded);
            console.log('  - 만료시간:', new Date(decoded.exp * 1000));
            console.log('  - 현재시간:', new Date());
            
            logs.push(`JWT 페이로드: ${JSON.stringify(decoded)}`);
            logs.push(`만료시간: ${new Date(decoded.exp * 1000)}`);
            logs.push(`현재시간: ${new Date()}`);
          }
        } catch (decodeError) {
          console.log('  - JWT 디코딩 실패:', decodeError);
          logs.push(`JWT 디코딩 실패: ${decodeError}`);
        }
      }
      
      if (token) {
        console.log('🔍 AuthService: 토큰이 존재하므로 인증 헤더와 함께 요청');
        logs.push('토큰이 존재하므로 인증 헤더와 함께 요청');
        
        const { apiClient } = await import('../utils/apiClient');
        await apiClient.post('/oauth2/logout', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        logs.push('백엔드 로그아웃 API 호출 성공');
      } else {
        console.log('🔍 AuthService: 토큰이 없으므로 일반 요청');
        logs.push('토큰이 없으므로 일반 요청');
        
        await api.post('/oauth2/logout');
        logs.push('백엔드 로그아웃 API 호출 성공 (토큰 없음)');
      }
      
      console.log('🔍 AuthService: 백엔드 로그아웃 API 호출 성공');
      
    } catch (error: any) {
      console.log('🔍 AuthService: 백엔드 로그아웃 API 실패:', error);
      console.log('🔍 AuthService: 에러 상세 정보:', {
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message,
        response: error?.response
      });
      
      const logs = JSON.parse(localStorage.getItem('logout_debug_log') || '[]');
      logs.push(`API 실패: ${JSON.stringify({
        status: error?.status,
        statusText: error?.statusText,
        message: error?.message
      })}`);
      localStorage.setItem('logout_debug_log', JSON.stringify(logs));
      
      // 401 에러는 토큰이 만료되었거나 유효하지 않은 것이므로 성공으로 처리
      if (error?.status === 401) {
        console.log('🔍 AuthService: 401 에러 - 토큰이 만료되었거나 유효하지 않음, 로그아웃 성공으로 처리');
        logs.push('401 에러 - 토큰이 만료되었거나 유효하지 않음, 로그아웃 성공으로 처리');
      } else {
        console.log('🔍 AuthService: 기타 에러 - 무시하고 계속 진행');
        logs.push('기타 에러 - 무시하고 계속 진행');
      }
      
      localStorage.setItem('logout_debug_log', JSON.stringify(logs));
    }
    
    // 카카오 SDK 로그아웃 (있는 경우)
    try {
      const { kakaoLogout } = await import('../config/kakao');
      kakaoLogout();
      console.log('🔍 AuthService: 카카오 SDK 로그아웃 완료');
    } catch (kakaoError) {
      console.log('🔍 AuthService: 카카오 SDK 로그아웃 실패 (무시):', kakaoError);
    }
    
    // 로컬 스토리지 정리 (마지막에 실행)
    try {
      const { clearAuthToken, clearUserInfo } = await import('../utils/auth');
      clearAuthToken();
      clearUserInfo();
      console.log('🔍 AuthService: 로컬 스토리지 정리 완료');
    } catch (clearError) {
      console.error('🔍 AuthService: 로컬 스토리지 정리 실패:', clearError);
    }
    
    // 로그 확인을 위한 대기 시간 (개발 환경에서만)
    if (import.meta.env.DEV) {
      console.log('🔍 AuthService: 개발 환경 - 로그 확인을 위해 3초 대기...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    // 로컬 로그아웃은 성공으로 처리
    console.log('🔍 AuthService: 로그아웃 완료');
    
    return true;
  }

  // 마이페이지 정보 조회
  static async fetchMyPage(): Promise<MyPageResponse | null> {
    try {
      return await api.get<MyPageResponse>('/user/mypage');
    } catch (error) {
      console.error('마이페이지 조회 실패:', error);
      return null;
    }
  }

  // 닉네임 조회
  static async fetchNickname(): Promise<string | null> {
    try {
      const data = await api.get<{ nickName: string }>('/user');
      return data.nickName || null;
    } catch (error) {
      console.error('닉네임 조회 실패:', error);
      return null;
    }
  }

  // 닉네임 수정
  static async updateNickname(nickname: string): Promise<boolean> {
    try {
      await api.patch('/user', { nickname });
      return true;
    } catch (error) {
      console.error('닉네임 수정 실패:', error);
      return false;
    }
  }

  // 자동 로그인 체크
  static async checkAutoLogin(): Promise<boolean> {
    try {
      const nickname = await this.fetchNickname();
      return !!nickname;
    } catch (error) {
      console.error('자동 로그인 체크 실패:', error);
      return false;
    }
  }
} 