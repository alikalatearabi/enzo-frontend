/**
 * API Client for Enzo Backend
 *
 * Centralized HTTP client that handles:
 * - Base URL configuration
 * - Request/response serialization
 * - Error handling
 * - Future: Authentication headers
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

export class ApiError extends Error {
  status?: number;
  statusText?: string;
  data?: unknown;

  constructor(
    message: string,
    status?: number,
    statusText?: string,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", headers = {}, body, signal } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal,
  };

  if (body !== undefined && method !== "GET" && method !== "DELETE") {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response
      .json()
      .catch(() => null as unknown as T | null);

    if (!response.ok) {
      const apiMessage =
        (data as any)?.message ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(
        apiMessage,
        response.status,
        response.statusText,
        data as unknown,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        "Network error: Could not connect to the server. Please check if the backend is running.",
        0,
        "Network Error",
      );
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request was aborted", 0, "Aborted");
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unknown error occurred",
      0,
      "Unknown Error",
    );
  }
}

async function requestMultipart<T>(
  endpoint: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    method,
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response
      .json()
      .catch(() => null as unknown as T | null);

    if (!response.ok) {
      const apiMessage =
        (data as any)?.message ||
        `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(
        apiMessage,
        response.status,
        response.statusText,
        data as unknown,
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new ApiError(
        "Network error: Could not connect to the server. Please check if the backend is running.",
        0,
        "Network Error",
      );
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request was aborted", 0, "Aborted");
    }

    throw new ApiError(
      error instanceof Error ? error.message : "An unknown error occurred",
      0,
      "Unknown Error",
    );
  }
}

export const apiClient = {
  get: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> => request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ): Promise<T> => request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ): Promise<T> => request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">,
  ): Promise<T> => request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> => request<T>(endpoint, { ...options, method: "DELETE" }),

  postMultipart: <T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> => requestMultipart<T>(endpoint, formData, "POST"),

  putMultipart: <T>(
    endpoint: string,
    formData: FormData,
  ): Promise<T> => requestMultipart<T>(endpoint, formData, "PUT"),
};

export default apiClient;


