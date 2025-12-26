/**
 * API Configuration and Utilities
 * Centralized API client for calling maxxit-latest backend
 */

// Backend API base URL - update this when deploying
// IMPORTANT: Use www.maxxit.ai to avoid CORS preflight redirect issues
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.maxxit.ai';

/**
 * Default headers for API requests
 * Includes ngrok-skip-browser-warning to bypass ngrok interstitial page
 */
const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
};

/**
 * Make a GET request to the API
 */
export async function apiGet<T = any>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

/**
 * Make a POST request to the API
 */
export async function apiPost<T = any>(endpoint: string, body?: any): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || 'Request failed');
  }

  return response.json();
}

/**
 * Raw fetch with API base URL and default headers
 * Use when you need more control over the request
 */
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = new URL(endpoint, API_BASE_URL);

  return fetch(url.toString(), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
}



