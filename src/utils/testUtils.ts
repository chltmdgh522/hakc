// 테스트용 유틸리티 함수들

/**
 * 테스트용 모의 데이터 생성
 */
export const createMockQuizData = (id: number = 1) => ({
  id,
  questionImage: '/mock-question-image.png',
  correctAnswer: '기뻐요',
  choices: ['기뻐요', '슬퍼요', '화나요', '무서워요'],
});

export const createMockRecordData = (session: number = 1) => ({
  session,
  score: Math.floor(Math.random() * 10) + 1,
  date: `2025.07.${20 + session}`,
});

export const createMockUserInfo = () => ({
  id: 'user-123',
  nickname: '테스트유저',
  playCount: 5,
  totalPlayTime: '00:30:15',
  lastPlayDate: '2025.07.21',
});

/**
 * 비동기 작업을 시뮬레이션하는 함수
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 랜덤한 지연 시간을 생성하는 함수
 */
export const randomDelay = (min: number = 500, max: number = 2000): Promise<void> => {
  const delayTime = Math.random() * (max - min) + min;
  return delay(delayTime);
};

/**
 * 에러를 시뮬레이션하는 함수
 */
export const simulateError = (probability: number = 0.1): void => {
  if (Math.random() < probability) {
    throw new Error('시뮬레이션된 에러');
  }
};

/**
 * 로컬 스토리지 모킹
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

/**
 * 윈도우 리사이즈 이벤트를 시뮬레이션하는 함수
 */
export const simulateResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  window.dispatchEvent(new Event('resize'));
};

/**
 * 터치 이벤트를 시뮬레이션하는 함수
 */
export const simulateTouch = (element: HTMLElement, x: number, y: number) => {
  const touchEvent = new TouchEvent('touchstart', {
    touches: [
      new Touch({
        identifier: 0,
        target: element,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
        radiusX: 1,
        radiusY: 1,
        rotationAngle: 0,
        force: 1,
      }),
    ],
  });
  
  element.dispatchEvent(touchEvent);
}; 