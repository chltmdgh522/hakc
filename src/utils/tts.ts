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

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  // TTS 재생
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.speechSynthesis) {
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
      const voices = this.speechSynthesis.getVoices();
      const koreanVoice = voices.find(voice => 
        voice.lang.includes('ko') || voice.lang.includes('KR')
      );
      if (koreanVoice) {
        utterance.voice = koreanVoice;
      }

      // 이벤트 핸들러
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`TTS error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.speechSynthesis.speak(utterance);
    });
  }

  // TTS 중지
  stop(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // TTS 일시정지
  pause(): void {
    if (this.speechSynthesis && this.speechSynthesis.speaking) {
      this.speechSynthesis.pause();
    }
  }

  // TTS 재개
  resume(): void {
    if (this.speechSynthesis && this.speechSynthesis.paused) {
      this.speechSynthesis.resume();
    }
  }

  // TTS 지원 여부 확인
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  // 음성 목록 가져오기
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.speechSynthesis) return [];
    return this.speechSynthesis.getVoices();
  }
}

// 싱글톤 인스턴스
export const ttsService = new TTSService();

// 편의 함수들
export const speakText = (text: string, options?: TTSOptions) => 
  ttsService.speak(text, options);

export const stopTTS = () => ttsService.stop();
export const pauseTTS = () => ttsService.pause();
export const resumeTTS = () => ttsService.resume();
export const isTTSSupported = () => ttsService.isSupported(); 