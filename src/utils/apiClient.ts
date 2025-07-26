import config from '../config';
import { getAuthHeaders } from './auth';

// API 응답 타입
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
}

// API 요청 옵션
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// API 에러 클래스
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// 통합 API 클라이언트
class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.defaultTimeout = config.api.timeout;
  }

  // 통합 API 호출 메서드
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = this.defaultTimeout
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const requestHeaders = {
      ...getAuthHeaders(),
      ...headers,
      ...(body && { 'Content-Type': 'application/json' })
    };

    // 로깅
    this.logApiCall(method, url, body, requestHeaders);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 응답 로깅
      this.logApiResponse(method, url, response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        this.logApiError(method, url, response.status, errorText);
        throw new ApiError(
          `API 요청 실패: ${response.status} ${response.statusText}`,
          response.status,
          response.statusText,
          errorText
        );
      }

      // 응답 본문이 비어있는지 확인
      const responseText = await response.text();
      let data;
      
      if (responseText.trim() === '') {
        // 응답이 비어있으면 빈 객체 반환
        data = {};
        this.logApiSuccess(method, url, data);
      } else {
        // 응답이 있으면 JSON 파싱
        try {
          data = JSON.parse(responseText);
          this.logApiSuccess(method, url, data);
        } catch (parseError) {
          this.logApiError(method, url, response.status, `JSON 파싱 실패: ${parseError.message}`);
          throw new ApiError(
            `JSON 파싱 오류: ${parseError.message}`,
            response.status,
            response.statusText,
            responseText
          );
        }
      }
      
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      this.logApiError(method, url, 0, error.message);
      throw new ApiError(
        `네트워크 오류: ${error.message}`,
        0,
        'NETWORK_ERROR',
        error
      );
    }
  }

  // GET 요청
  async get<T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST 요청
  async post<T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  // PUT 요청
  async put<T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  // PATCH 요청
  async patch<T = any>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  // DELETE 요청
  async delete<T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // 로깅 메서드들
  private logApiCall(method: string, url: string, body?: any, headers?: Record<string, string>) {
    console.log(`[API] ${method} ${url}`);
    if (body) {
      console.log('[API] Request Body:', body);
    }
    if (headers) {
      console.log('[API] Request Headers:', headers);
    }
  }

  private logApiResponse(method: string, url: string, status: number, statusText: string) {
    console.log(`[API] ${method} ${url} - ${status} ${statusText}`);
  }

  private logApiSuccess(method: string, url: string, data: any) {
    console.log(`[API] ${method} ${url} - Success:`, data);
  }

  private logApiError(method: string, url: string, status: number, error: string) {
    console.error(`[API] ${method} ${url} - Error ${status}:`, error);
  }
}

// 싱글톤 인스턴스
export const apiClient = new ApiClient();

// 편의 함수들
export const api = {
  get: <T = any>(endpoint: string) => apiClient.get<T>(endpoint),
  post: <T = any>(endpoint: string, body?: any) => apiClient.post<T>(endpoint, body),
  put: <T = any>(endpoint: string, body?: any) => apiClient.put<T>(endpoint, body),
  patch: <T = any>(endpoint: string, body?: any) => apiClient.patch<T>(endpoint, body),
  delete: <T = any>(endpoint: string) => apiClient.delete<T>(endpoint),
}; 