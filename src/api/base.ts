/**
 * Base API client for all backend API calls
 * This file provides the foundation for all API interactions
 */

import { appConfig } from "@/config/app";
import { requestInterceptor } from "./interceptors";
import { handleApiError } from "@/lib/error-handler";
import { handle401WithReload, resetReloadCount } from "@/lib/reload-counter";
import { tokenManager } from "@/lib/token-manager";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  message?: string;
  success?: boolean;
  error_type?: string;
  error_message?: string;
  error_id?: string;
  processedError?: {
    error_type: string;
    error_message: string;
    error_id?: string;
    status?: number;
  };
}

export interface ApiError {
  error_type: string;
  error_message: string;
  error_id?: string;
  status?: number;
}

export interface FileDownloadResponse {
  data: Blob;
  status: number;
  filename?: string;
  contentType?: string | null;
}

class BaseApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = appConfig.backendUrl;
    this.timeout = appConfig.apiTimeout;
  }

  /**
   * Send credentials only when we have tokens to avoid CORS issues
   */
  private shouldSendCredentials(): boolean {
    // Only send credentials if we have tokens to avoid CORS issues with backend
    const hasTokens = tokenManager.hasValidTokens();
    console.log("Should send credentials:", hasTokens);
    return hasTokens;
  }

  /**
   * Process response data according to new backend format
   */
  private processResponseData<T>(
    responseData: any,
    response: Response
  ): ApiResponse<T> {
    // Handle new backend response format
    if (responseData && typeof responseData === "object") {
      // Check if response has a detail wrapper (FastAPI validation errors)
      const data = responseData.detail || responseData;

      if (data.success === true && data.data !== undefined) {
        // Success response format: { success: true, data: {...} }
        return {
          data: data.data,
          status: response.status,
          success: true,
        };
      } else if (data.success === false) {
        // Error response format: { success: false, error_type: "...", error_message: "...", error_id: "..." }
        const errorMessage = handleApiError(data || response);
        return {
          error: errorMessage,
          status: response.status,
          success: false,
          error_type: data.error_type,
          error_message: data.error_message,
          error_id: data.error_id,
          processedError: {
            error_type: data.error_type || "UNKNOWN_ERROR",
            error_message: data.error_message || errorMessage,
            error_id: data.error_id,
            status: response.status,
          },
        };
      }
    }

    // Fallback for legacy format or unexpected response structure
    return { data: responseData, status: response.status };
  }

  /**
   * Make a GET request to the backend
   */
  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // Allow per-request timeout override via header 'X-Request-Timeout' (milliseconds)
      let timeoutMs = this.timeout;
      try {
        const hdrs: any = options?.headers;
        const hdrTimeout = hdrs && (hdrs['X-Request-Timeout'] || hdrs['x-request-timeout']);
        if (hdrTimeout) {
          const parsed = parseInt(String(hdrTimeout), 10);
          if (!isNaN(parsed) && parsed > 0) {
            timeoutMs = parsed;
          }
        }
      } catch (e) {
        // ignore and use default timeout
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const url = `${this.baseUrl}${endpoint}`;
      console.log("Making GET request to:", url);

      const requestOptions: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      };

      // Send credentials conditionally to avoid CORS issues
      if (this.shouldSendCredentials()) {
        requestOptions.credentials = "include";
        console.log(
          "Sending credentials with GET request to include refresh token cookie"
        );
      } else {
        console.log("Skipping credentials for GET request (no tokens)");
      }

      const interceptedOptions = requestInterceptor(url, requestOptions);

      const response = await fetch(url, interceptedOptions);
      console.log("GET response status:", response.status);

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 Unauthorized errors with reload logic
        if (response.status === 401) {
          console.error("401 Unauthorized error detected in GET request");
          handle401WithReload();
        }

        // Try to parse error response from backend
        let errorData: any = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            errorData = jsonResponse?.detail || jsonResponse;
          }
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }

        const errorMessage = handleApiError(errorData || response);
        return {
          error: errorMessage,
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || "UNKNOWN_ERROR",
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status,
          },
        };
      }

      // Reset reload counter on successful request
      resetReloadCount();

      const responseData = await response.json();
      return this.processResponseData<T>(responseData, response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorMessage = handleApiError(error);
        return {
          error: errorMessage,
          status: 408,
          processedError: {
            error_type: "REQUEST_TIMEOUT",
            error_message: errorMessage,
            error_id: undefined,
            status: 408,
          },
        };
      }

      const errorMessage = handleApiError(error);
      return {
        error: errorMessage,
        status: 500,
        processedError: {
          error_type: "INTERNAL_SERVER_ERROR",
          error_message: errorMessage,
          error_id: undefined,
          status: 500,
        },
      };
    }
  }

  /**
   * Make a POST request to the backend
   */
  async post<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}${endpoint}`;

      const requestOptions: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      };

      // Send credentials conditionally to avoid CORS issues
      if (this.shouldSendCredentials()) {
        requestOptions.credentials = "include";
        console.log(
          "Sending credentials with POST request to include refresh token cookie"
        );
      } else {
        console.log("Skipping credentials for POST request (no tokens)");
      }

      const interceptedOptions = requestInterceptor(url, requestOptions);

      const response = await fetch(url, interceptedOptions);

      clearTimeout(timeoutId);

      console.log("--------Response:", response);
      if (!response.ok) {
        // Handle 401 Unauthorized errors with reload logic
        if (response.status === 401) {
          console.error("401 Unauthorized error detected in POST request");
          const currentPath = window.location.pathname;
          if (currentPath !== "/signup") {
            handle401WithReload();
          }
        }

        // Try to parse error response from backend
        let errorData: any = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            errorData = jsonResponse?.detail || jsonResponse;
          }
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }

        console.log("--------Error data:", errorData);
        const errorMessage = handleApiError(errorData || response);
        return {
          error: errorMessage,
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || "UNKNOWN_ERROR",
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status,
          },
        };
      }

      // Reset reload counter on successful request
      resetReloadCount();

      const responseData = await response.json();
      return this.processResponseData<T>(responseData, response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorMessage = handleApiError(error);
        return {
          error: errorMessage,
          status: 408,
          processedError: {
            error_type: "REQUEST_TIMEOUT",
            error_message: errorMessage,
            error_id: undefined,
            status: 408,
          },
        };
      }

      const errorMessage = handleApiError(error);
      return {
        error: errorMessage,
        status: 500,
        processedError: {
          error_type: "INTERNAL_SERVER_ERROR",
          error_message: errorMessage,
          error_id: undefined,
          status: 500,
        },
      };
    }
  }

  /**
   * Make a PUT request to the backend
   */
  async put<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}${endpoint}`;

      const requestOptions: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      };

      // Send credentials conditionally to avoid CORS issues
      if (this.shouldSendCredentials()) {
        requestOptions.credentials = "include";
        console.log(
          "Sending credentials with PUT request to include refresh token cookie"
        );
      } else {
        console.log("Skipping credentials for PUT request (no tokens)");
      }

      const interceptedOptions = requestInterceptor(url, requestOptions);

      const response = await fetch(url, interceptedOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 Unauthorized errors with reload logic
        if (response.status === 401) {
          console.error("401 Unauthorized error detected in PUT request");
          handle401WithReload();
        }

        // Try to parse error response from backend
        let errorData: any = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            errorData = jsonResponse?.detail || jsonResponse;
          }
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }

        const errorMessage = handleApiError(errorData || response);
        return {
          error: errorMessage,
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || "UNKNOWN_ERROR",
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status,
          },
        };
      }

      // Reset reload counter on successful request
      resetReloadCount();

      const responseData = await response.json();
      return this.processResponseData<T>(responseData, response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorMessage = handleApiError(error);
        return {
          error: errorMessage,
          status: 408,
          processedError: {
            error_type: "REQUEST_TIMEOUT",
            error_message: errorMessage,
            error_id: undefined,
            status: 408,
          },
        };
      }

      const errorMessage = handleApiError(error);
      return {
        error: errorMessage,
        status: 500,
        processedError: {
          error_type: "INTERNAL_SERVER_ERROR",
          error_message: errorMessage,
          error_id: undefined,
          status: 500,
        },
      };
    }
  }

  /**
   * Make a DELETE request to the backend
   */
  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}${endpoint}`;

      const requestOptions: RequestInit = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      };

      // Send credentials conditionally to avoid CORS issues
      if (this.shouldSendCredentials()) {
        requestOptions.credentials = "include";
        console.log(
          "Sending credentials with DELETE request to include refresh token cookie"
        );
      } else {
        console.log("Skipping credentials for DELETE request (no tokens)");
      }

      const interceptedOptions = requestInterceptor(url, requestOptions);

      const response = await fetch(url, interceptedOptions);

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Handle 401 Unauthorized errors with reload logic
        if (response.status === 401) {
          console.error("401 Unauthorized error detected in DELETE request");
          handle401WithReload();
        }

        // Try to parse error response from backend
        let errorData: any = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            errorData = jsonResponse?.detail || jsonResponse;
          }
        } catch (parseError) {
          console.warn("Failed to parse error response:", parseError);
        }

        const errorMessage = handleApiError(errorData || response);
        return {
          error: errorMessage,
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || "UNKNOWN_ERROR",
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status,
          },
        };
      }

      // Reset reload counter on successful request
      resetReloadCount();

      const responseData = await response.json();
      return this.processResponseData<T>(responseData, response);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorMessage = handleApiError(error);
        return {
          error: errorMessage,
          status: 408,
          processedError: {
            error_type: "REQUEST_TIMEOUT",
            error_message: errorMessage,
            error_id: undefined,
            status: 408,
          },
        };
      }

      const errorMessage = handleApiError(error);
      return {
        error: errorMessage,
        status: 500,
        processedError: {
          error_type: "INTERNAL_SERVER_ERROR",
          error_message: errorMessage,
          error_id: undefined,
          status: 500,
        },
      };
    }
  }

  /**
   * Download a file (binary response) from the backend
   */
  async downloadFile(
    endpoint: string,
    options?: RequestInit
  ): Promise<FileDownloadResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseUrl}${endpoint}`;
      console.log("Initiating file download from:", url);

      const requestOptions: RequestInit = {
        method: "GET",
        headers: {
          ...(options?.headers || {}),
        },
        signal: controller.signal,
        ...options,
      };

      if (this.shouldSendCredentials()) {
        requestOptions.credentials = "include";
        console.log("Sending credentials with file download request");
      } else {
        console.log(
          "Skipping credentials for file download request (no tokens)"
        );
      }

      const interceptedOptions = requestInterceptor(url, requestOptions);

      const response = await fetch(url, interceptedOptions);
      console.log("File download response status:", response.status);

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          console.error("401 Unauthorized error detected during file download");
          handle401WithReload();
        }

        let errorData: any = null;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            errorData = jsonResponse?.detail || jsonResponse;
          }
        } catch (parseError) {
          console.warn(
            "Failed to parse error response for file download:",
            parseError
          );
        }

        const errorMessage = handleApiError(errorData || response);
        throw new Error(errorMessage);
      }

      resetReloadCount();

      const contentType = response.headers.get("content-type");
      const contentDisposition =
        response.headers.get("content-disposition") ||
        response.headers.get("Content-Disposition");
      let filename: string | undefined;
      console.log(
        "--------contentDisposition-----------",
        contentDisposition,
        response.headers
      );
      if (contentDisposition) {
        const filenameStarMatch = contentDisposition.match(
          /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i
        );
        if (filenameStarMatch && filenameStarMatch[1]) {
          try {
            filename = decodeURIComponent(
              filenameStarMatch[1].replace(/['"]/g, "").trim()
            );
          } catch (decodeError) {
            console.warn(
              "Failed to decode filename* from Content-Disposition header:",
              decodeError
            );
          }
        }
        console.log("--------filename--0---------", filename);
        if (!filename) {
          const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
            contentDisposition
          );
          if (match && match[1]) {
            filename = match[1].replace(/['"]/g, "").trim();
          }
        }

        console.log("--------filename---1--------", filename);
      }

      const data = await response.blob();

      return {
        data,
        status: response.status,
        filename,
        contentType,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage);
      }

      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if the backend service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get("/health");
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const baseApiClient = new BaseApiClient();

// Export the class for custom instances
export { BaseApiClient };
