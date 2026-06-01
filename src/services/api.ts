// ============================================================
// api.ts - Centralised API service for authenticated requests
// Automatically attaches JWT token to protected API calls
// ============================================================

const API_BASE = "http://localhost:3000/api";

/**
 * Makes an authenticated GET request to a protected backend route.
 * Automatically reads the JWT token from localStorage and includes
 * it in the Authorization header as "Bearer <token>".
 *
 * @param endpoint - API path (e.g. "/me")
 * @returns Parsed JSON response from the backend
 * @throws Error if request fails or token is invalid
 */
export async function authenticatedGet<T>(endpoint: string): Promise<T> {
  // Retrieve stored JWT token
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Attach JWT token in Authorization header (Bearer scheme)
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data as T;
}