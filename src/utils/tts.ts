// TTS (Text-to-Speech) 유틸리티 함수들

interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TTSService {
  private speechSynthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.loadVoices();
    }
  }

  // 음성 목록 로드
  private loadVoices() {
    if (!this.speechSynthesis) return;

    // 음성이 이미 로드되어 있는 경우
    if (this.speechSynthesis.getVoices().length > 0) {
      this.voicesLoaded = true;
      return;
    }

    // 음성 로드 이벤트 리스너
    const handleVoicesChanged = () => {
      this.voicesLoaded = true;
      this.speechSynthesis?.removeEventListener('voiceschanged', handleVoicesChanged);
    };

    this.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
  }

  // TTS 재생
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
        console.error('TTS: Speech synthesis is not supported');
        reject(new Error('Speech synthesis is not supported'));
        return;
      }

      // 이전 재생 중인 TTS 중지
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // 기본 설정
      utterance.lang = 'ko-KR';
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // 한국어 음성 선택 (가능한 경우)
      if (this.voicesLoaded) {
        const voices = this.speechSynthesis.getVoices();
        console.log('TTS: 사용 가능한 음성 목록:', voices.map(v => `${v.name} (${v.lang})`));
        
        // 한국어 음성 우선 선택
        let koreanVoice = voices.find(voice => 
          voice.lang.includes('ko') || voice.lang.includes('KR')
        );
        
        // 한국어 음성이 없으면 기본 음성 사용
        if (!koreanVoice) {
          koreanVoice = voices.find(voice => voice.default) || voices[0];
        }
        
        if (koreanVoice) {
          utterance.voice = koreanVoice;
          console.log('TTS: 선택된 음성:', koreanVoice.name, koreanVoice.lang);
        }
      }

      // 이벤트 핸들러
      utterance.onstart = () => {
        console.log('TTS: 재생 시작');
      };

      utterance.onend = () => {
        console.log('TTS: 재생 완료');
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('TTS: 재생 에러:', event.error);
        this.currentUtterance = null;
        reject(new Error(`TTS error: ${event.error}`));
      };

      utterance.onpause = () => {
        console.log('TTS: 일시정지');
      };

      utterance.onresume = () => {
        console.log('TTS: 재개');
      };

      this.currentUtterance = utterance;
      
      try {
        console.log('TTS: 재생 시도:', text);
        this.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('TTS: speak 호출 실패:', error);
        reject(error);
      }
    });
  }

  // TTS 중지
  stop(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      console.log('TTS: 중지');
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // TTS 일시정지
  pause(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      console.log('TTS: 일시정지');
      this.speechSynthesis.pause();
    }
  }

  // TTS 재개
  resume(): void {
    if (this.speechSynthesis && this.speechSynthesis.paused) {
      console.log('TTS: 재개');
      this.speechSynthesis.resume();
    }
  }

  // TTS 지원 여부 확인
  isSupported(): boolean {
    const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    console.log('TTS: 지원 여부:', supported);
    return supported;
  }

  // 음성 목록 가져오기
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.speechSynthesis) return [];
    return this.speechSynthesis.getVoices();
  }

  // 현재 재생 상태 확인
  isPlaying(): boolean {
    return this.speechSynthesis ? this.speechSynthesis.speaking : false;
  }
}

// 싱글톤 인스턴스
export const ttsService = new TTSService();

// 편의 함수들
export const speakText = (text: string, options?: TTSOptions) => {
  console.log('TTS: speakText 호출됨:', text);
  return ttsService.speak(text, options);
};

export const stopTTS = () => ttsService.stop();
export const pauseTTS = () => ttsService.pause();
export const resumeTTS = () => ttsService.resume();
export const isTTSSupported = () => ttsService.isSupported();
export const isTTSPlaying = () => ttsService.isPlaying(); 