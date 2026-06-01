// ============================================================
// types/index.ts - TypeScript type definitions for the app
// Centralising types makes code more maintainable and readable
// ============================================================

/**
 * Represents a registered student in the system
 */
export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
}

/**
 * The response returned by the backend on register/login
 */
export interface AuthResponse {
  token: string;
  student: Student;
}

/**
 * Form data for the registration form
 */
export interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirm: string;
}

/**
 * Form data for the login form
 */
export interface LoginForm {
  email: string;
  password: string;
}