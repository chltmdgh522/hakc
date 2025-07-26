// 간단한 로깅 시스템

export const logDebug = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.debug(`[DEBUG] ${message}`, data);
  }
};

export const logInfo = (message: string, data?: any) => {
  console.info(`[INFO] ${message}`, data);
};

export const logWarn = (message: string, data?: any) => {
  console.warn(`[WARN] ${message}`, data);
};

export const logError = (message: string, error?: Error, data?: any) => {
  console.error(`[ERROR] ${message}`, error, data);
};

export const logGameEvent = (event: string, data?: any) => {
  logInfo(`[GAME] ${event}`, data);
};

export const logUserAction = (action: string, data?: any) => {
  logInfo(`[USER] ${action}`, data);
};

export const logApiCall = (endpoint: string, method: string, data?: any) => {
  logInfo(`[API] ${method} ${endpoint}`, data);
};

export const logPerformance = (operation: string, duration: number) => {
  logInfo(`[PERF] ${operation} took ${duration}ms`);
}; 