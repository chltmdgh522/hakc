import { useState, useEffect, useRef } from 'react';

interface UseBackgroundMusicOptions {
  src: string;
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export const useBackgroundMusic = (options: UseBackgroundMusicOptions) => {
  const { src, volume = 0.5, loop = true, autoplay = false } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);

  useEffect(() => {
    console.log('useBackgroundMusic: useEffect 실행', { src, loop, autoplay, volume });
    
    // 오디오 요소 생성
    audioRef.current = new Audio(src);
    audioRef.current.volume = currentVolume;
    audioRef.current.loop = loop;
    console.log('useBackgroundMusic: 오디오 요소 생성 완료', { 
      src: audioRef.current.src, 
      volume: audioRef.current.volume, 
      loop: audioRef.current.loop 
    });

    // 자동 재생 설정
    if (autoplay) {
      console.log('useBackgroundMusic: 자동 재생 시도');
      audioRef.current.play().catch((error) => {
        console.log('useBackgroundMusic: 자동 재생 실패 (브라우저 정책):', error);
        console.log('useBackgroundMusic: 사용자 상호작용 후 재생을 시도해주세요');
      });
    }

    // 이벤트 리스너 추가
    const audio = audioRef.current;
    audio.addEventListener('play', () => {
      console.log('useBackgroundMusic: play 이벤트 발생');
      setIsPlaying(true);
    });
    audio.addEventListener('pause', () => {
      console.log('useBackgroundMusic: pause 이벤트 발생');
      setIsPlaying(false);
    });
    audio.addEventListener('ended', () => {
      console.log('useBackgroundMusic: ended 이벤트 발생');
      setIsPlaying(false);
    });
    audio.addEventListener('error', (e) => {
      console.error('useBackgroundMusic: 오디오 에러 발생:', e);
    });
    audio.addEventListener('loadstart', () => {
      console.log('useBackgroundMusic: 오디오 로딩 시작');
    });
    audio.addEventListener('canplay', () => {
      console.log('useBackgroundMusic: 오디오 재생 가능');
    });

    return () => {
      if (audio) {
        console.log('useBackgroundMusic: 정리 함수 실행');
        audio.pause();
        audio.removeEventListener('play', () => setIsPlaying(true));
        audio.removeEventListener('pause', () => setIsPlaying(false));
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.removeEventListener('error', () => {});
        audio.removeEventListener('loadstart', () => {});
        audio.removeEventListener('canplay', () => {});
      }
    };
  }, [src, loop, autoplay, volume]);

  const play = async () => {
    console.log('useBackgroundMusic: play 호출됨', { 
      audioRef: !!audioRef.current, 
      isPlaying,
      src: audioRef.current?.src 
    });
    if (audioRef.current && !isPlaying) {
      try {
        console.log('useBackgroundMusic: 음악 재생 시도');
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('useBackgroundMusic: 음악 재생 성공');
      } catch (error) {
        console.error('useBackgroundMusic: 음악 재생 실패:', error);
        console.log('useBackgroundMusic: 브라우저 자동 재생 정책으로 인한 실패일 수 있습니다');
      }
    } else {
      console.log('useBackgroundMusic: 재생 조건 불만족', { 
        audioRef: !!audioRef.current, 
        isPlaying 
      });
    }
  };

  const pause = () => {
    console.log('useBackgroundMusic: pause 호출됨');
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('useBackgroundMusic: 음악 일시정지 완료');
    }
  };

  const stop = () => {
    console.log('useBackgroundMusic: stop 호출됨');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      console.log('useBackgroundMusic: 음악 정지 완료');
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setCurrentVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
      console.log('useBackgroundMusic: 볼륨 설정 완료:', clampedVolume);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = currentVolume;
        setIsMuted(false);
        console.log('useBackgroundMusic: 음소거 해제');
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
        console.log('useBackgroundMusic: 음소거 설정');
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    isPlaying,
    isMuted,
    currentVolume,
    play,
    pause,
    stop,
    setVolume,
    toggleMute,
    togglePlay,
  };
}; 