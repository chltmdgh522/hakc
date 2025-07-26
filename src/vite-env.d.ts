/// <reference types="vite/client" />

declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
                        Auth: {
                    login: (options: {
                      redirectUri?: string;
                      success: (response: any) => void;
                      fail: (error: any) => void;
                    }) => void;
        logout: () => void;
        getAccessToken: () => string | null;
      };
      API: {
        request: (options: {
          url: string;
          success: (response: any) => void;
          fail: (error: any) => void;
        }) => void;
      };
    };
  }
}

export {};
