import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface MusicContextType {
  isMusicOn: boolean;
  toggleMusic: () => void;
  setMusicOn: (on: boolean) => void;
  backgroundMusic: ReturnType<typeof useBackgroundMusic>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isMusicOn, setIsMusicOn] = useState(true); // 기본적으로 음악 켜짐
  
  const backgroundMusic = useBackgroundMusic({
    src: '/best-adventure-ever-122726.mp3',
    volume: 0.3,
    loop: true,
    autoplay: true,
  });

  // 로컬 스토리지에서 음악 설정 불러오기
  useEffect(() => {
    const savedMusicSetting = localStorage.getItem('musicOn');
    if (savedMusicSetting !== null) {
      const musicOn = JSON.parse(savedMusicSetting);
      setIsMusicOn(musicOn);
    }
  }, []);

  // 음악 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('musicOn', JSON.stringify(isMusicOn));
  }, [isMusicOn]);

  // 음악 설정에 따라 재생/일시정지
  useEffect(() => {
    console.log('MusicContext: 음악 상태 변경', { isMusicOn });
    if (isMusicOn) {
      console.log('MusicContext: 음악 재생 시도');
      backgroundMusic.play();
    } else {
      console.log('MusicContext: 음악 일시정지');
      backgroundMusic.pause();
    }
  }, [isMusicOn, backgroundMusic]);

  const toggleMusic = () => {
    setIsMusicOn(!isMusicOn);
  };

  const setMusicOn = (on: boolean) => {
    setIsMusicOn(on);
  };

  const value: MusicContextType = {
    isMusicOn,
    toggleMusic,
    setMusicOn,
    backgroundMusic,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}; 