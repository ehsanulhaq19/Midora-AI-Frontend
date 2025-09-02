/**
 * Backend API communication utilities
 * This file handles all communication with the backend service
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(process.env.BACKEND_API_TIMEOUT || '30000');

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

class BackendApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = BACKEND_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Make a GET request to the backend
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * Make a POST request to the backend
   */
  async post<T>(endpoint: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return { data: responseData, status: response.status };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * Make a PUT request to the backend
   */
  async put<T>(endpoint: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return { data: responseData, status: response.status };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * Make a DELETE request to the backend
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 };
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 };
    }
  }

  /**
   * Check if the backend service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const backendApi = new BackendApiClient();

// Export the class for custom instances
export { BackendApiClient };

// Example usage:
// import { backendApi } from '@/lib/backend-api';
// 
// // GET request
// const users = await backendApi.get('/api/users');
// 
// // POST request
// const newUser = await backendApi.post('/api/users', { name: 'John', email: 'john@example.com' });
// 
// // Health check
// const isHealthy = await backendApi.healthCheck();
