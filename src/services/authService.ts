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
    
    // 로컬 스토리지 정리 (먼저 실행)
    try {
      const { clearAuthToken, clearUserInfo } = await import('../utils/auth');
      clearAuthToken();
      clearUserInfo();
      console.log('🔍 AuthService: 로컬 스토리지 정리 완료');
    } catch (clearError) {
      console.error('🔍 AuthService: 로컬 스토리지 정리 실패:', clearError);
    }
    
    // 카카오 SDK 로그아웃 (있는 경우)
    try {
      const { kakaoLogout } = await import('../config/kakao');
      kakaoLogout();
      console.log('🔍 AuthService: 카카오 SDK 로그아웃 완료');
    } catch (kakaoError) {
      console.log('🔍 AuthService: 카카오 SDK 로그아웃 실패 (무시):', kakaoError);
    }
    
    // 백엔드 로그아웃 API 호출 (실패해도 무시)
    try {
      console.log('🔍 AuthService: 백엔드 로그아웃 API 호출 시도');
      await api.post('/oauth2/logout');
      console.log('🔍 AuthService: 백엔드 로그아웃 API 호출 성공');
    } catch (error) {
      console.log('🔍 AuthService: 백엔드 로그아웃 API 실패 (무시):', error);
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