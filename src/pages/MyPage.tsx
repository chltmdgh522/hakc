import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import crownImg from '../assets/성공왕관.png';
import profileImgSrc from '../assets/12_그림.png';
import { getUserInfo } from '../utils/auth';
import { AuthService } from '../services/authService';
import type { MyPageResponse } from '../types/api';

interface MyPageData {
  nickname: string;
  playCount: number;
  totalPlayTime: string;
  profileImage?: string;
}

const MyPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [userData, setUserData] = useState<MyPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMyPageData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('마이페이지 데이터 로드 시작...');
        
        // 마이페이지 데이터 로드
        const myPageData = await AuthService.fetchMyPage();
        console.log('마이페이지 API 응답:', myPageData);
        
        if (myPageData) {
          // API 응답을 MyPageData 형식으로 변환
          setUserData({
            nickname: myPageData.name,
            playCount: myPageData.allCnt,
            totalPlayTime: myPageData.allTime,
            profileImage: myPageData.profile
          });
        } else {
          // 기본 사용자 정보 사용
          const userInfo = getUserInfo();
          if (userInfo) {
            setUserData({
              nickname: userInfo.nickname,
              playCount: 0,
              totalPlayTime: '00:00:00',
              profileImage: userInfo.profileImage
            });
          }
        }
      } catch (error) {
        console.error('마이페이지 데이터 로드 실패:', error);
        setError('마이페이지 정보를 불러오는데 실패했습니다.');
        
        // 기본 사용자 정보로 폴백
        const userInfo = getUserInfo();
        if (userInfo) {
          setUserData({
            nickname: userInfo.nickname,
            playCount: 0,
            totalPlayTime: '00:00:00',
            profileImage: userInfo.profileImage
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMyPageData();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // 로그아웃 후 로그인 페이지로 이동
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: '#f5faff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: '#f5faff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div className="text-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  const nickname = userData?.nickname || '사용자';
  const playCount = userData?.playCount || 0;
  const playTime = userData?.totalPlayTime || '00:00:00';
  const profileImage = userData?.profileImage || profileImgSrc;

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      background: '#f5faff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '40px 0',
    }}>
      <motion.div
        style={{
          width: 380,
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(91,147,198,0.10)',
          padding: '32px 0 32px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          minHeight: 680,
          maxWidth: '95vw',
        }}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* 카드 내부 좌상단에 이전 버튼 (RecordPage와 동일) */}
        <motion.div
          style={{
            position: 'absolute',
            left: 24,
            top: 24,
            zIndex: 2,
          }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.18 }}
        >
          <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#E6F3FF"/>
              <path d="M23 14L17 20L23 26" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
        {/* 닉네임 + 용사님 */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 900,
          color: '#1e3a8a',
          letterSpacing: '-1px',
          marginBottom: 18,
          marginTop: 35,
          textShadow: '0 2px 8px #fff, 0 1px 0 #bcd',
        }}>
          <span style={{ color: '#1e3a8a', fontWeight: 900 }}>{nickname}</span> 용사님
        </div>
        {/* 프로필 이미지 */}
        <div style={{ marginBottom: 20 }}>
          <img
            src={profileImage}
            alt="프로필"
            style={{ width: 200, height: 200, borderRadius: '50%', background: '#f5faff', objectFit: 'cover', boxShadow: '0 2px 8px #e6f3ff' }}
          />
        </div>
        {/* 왕관 */}
        <img src={crownImg} alt="왕관" style={{ width: 60, marginBottom: 18 }} />
        {/* 구분선 */}
        <div style={{ width: '80%', height: 4, background: '#e6f3ff', borderRadius: 2, margin: '18px 0' }} />
        {/* 플레이 정보 */}
        <div style={{
          background: '#fffbe6',
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(91,147,198,0.08)',
          padding: '22px 28px',
          fontSize: 18,
          color: '#1e3a8a',
          fontWeight: 700,
          marginBottom: 24,
          textAlign: 'center',
        }}>
          총 플레이 횟수 : {playCount}<br />
          플레이시간 : {playTime}
        </div>
        {/* 구분선 */}
        <div style={{ width: '80%', height: 4, background: '#e6f3ff', borderRadius: 2, margin: '18px 0' }} />
        {/* 로그아웃 버튼 */}
        <motion.button
          style={{
            width: '80%',
            padding: '18px 0',
            background: '#5B93C6',
            border: 'none',
            borderRadius: 16,
            fontWeight: 'bold',
            fontSize: 20,
            color: '#fff',
            marginTop: 18,
            boxShadow: '0 4px 16px rgba(91, 147, 198, 0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          whileHover={{ background: '#1e3a8a', scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
        >
          로그아웃
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MyPage; 