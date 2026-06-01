// ============================================================
// Auth.ts - Authentication utility class
// Handles JWT token and student data storage in localStorage
// All methods are static so no instantiation is needed
// ============================================================

import type { Student, AuthResponse } from "../types";

// Base URL for all backend API calls
const API_BASE = "http://localhost:3000/api";

class Auth {
  // ─── Token Management ───────────────────────────────────────

  /**
   * Saves the JWT token to browser's localStorage.
   * Called after successful login or registration.
   * @param token - JWT token string from the backend
   */
  static saveToken(token: string): void {
    localStorage.setItem("token", token);
  }

  /**
   * Retrieves the JWT token from localStorage.
   * Returns null if no token exists (user not logged in).
   * @returns JWT token string or null
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  // ─── Student Data Management ─────────────────────────────────

  /**
   * Saves the logged-in student's data to localStorage as JSON.
   * @param student - Student object to persist
   */
  static saveStudent(student: Student): void {
    localStorage.setItem("student", JSON.stringify(student));
  }

  /**
   * Retrieves and parses the logged-in student's data from localStorage.
   * @returns Student object or null if not found
   */
  static getStudent(): Student | null {
    const data = localStorage.getItem("student");
    return data ? (JSON.parse(data) as Student) : null;
  }

  // ─── Auth State ───────────────────────────────────────────────

  /**
   * Checks if a user is currently logged in.
   * Simply checks whether a token exists in localStorage.
   * @returns true if token exists, false otherwise
   */
  static isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Logs the user out by removing token and student data
   * from localStorage, effectively ending the session.
   */
  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
  }

  // ─── API Calls ────────────────────────────────────────────────

  /**
   * Sends registration data to the backend API.
   * On success, saves the JWT token and student info to localStorage.
   * @param formData - Registration form values
   * @returns AuthResponse containing token and student data
   * @throws Error with backend message if registration fails
   */
  static async register(formData: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data: AuthResponse & { message?: string } = await response.json();

    // If request failed, throw the error message from backend
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Save token and student info locally for session persistence
    Auth.saveToken(data.token);
    Auth.saveStudent(data.student);

    return data;
  }

  /**
   * Sends login credentials to the backend API.
   * On success, saves the JWT token and student info to localStorage.
   * @param email - Student email address
   * @param password - Student password (plain text, hashed on backend)
   * @returns AuthResponse containing token and student data
   * @throws Error with backend message if login fails
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResponse & { message?: string } = await response.json();

    // If request failed, throw the error message from backend
    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token and student info locally for session persistence
    Auth.saveToken(data.token);
    Auth.saveStudent(data.student);

    return data;
  }
}

export default Auth;