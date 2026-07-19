/**
 * Centralized API configuration.
 * In development (Vite), uses the VITE_API_URL env variable or falls back to localhost:8000.
 * In production (served by FastAPI), uses relative URLs since both frontend and API share the same origin.
 */
const getApiBaseUrl = (): string => {
  // In production builds served by FastAPI, use relative paths (same origin)
  if (import.meta.env.PROD) {
    return "";
  }
  // In development, use the env variable or default to localhost:8000
  return import.meta.env.VITE_API_URL || "http://localhost:8000";
};

export const API_BASE = getApiBaseUrl();
