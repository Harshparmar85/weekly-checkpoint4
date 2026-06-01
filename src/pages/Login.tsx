// ============================================================
// Login.tsx - Student Login Page
// Accepts email/password, calls Auth.login(), navigates to dashboard
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import type { LoginForm } from "../types";

function Login() {
  const navigate = useNavigate();

  // ─── Form State ─────────────────────────────────────────────
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // Error message shown to the user on failed login
  const [error, setError] = useState<string>("");

  // Loading state to disable button during API call
  const [loading, setLoading] = useState<boolean>(false);

  // ─── Input Handler ───────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Submit Handler ──────────────────────────────────────────
  /**
   * Validates inputs, calls Auth.login() to POST credentials
   * to the backend, then navigates to dashboard on success.
   */
  const handleSubmit = async () => {
    setError("");

    // Basic validation
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Auth.login() sends credentials to backend and stores JWT token
      await Auth.login(form.email, form.password);

      // Navigate to protected dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      // Show error returned from backend (e.g. "Invalid email or password")
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* App logo */}
        <div className="auth-logo">
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your student account</p>

        {/* Error display */}
        {error && <div className="error">⚠ {error}</div>}

        {/* Email field */}
        <div className="form-group">
          <span className="icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Password field */}
        <div className="form-group">
          <span className="icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* Login button */}
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div className="divider">or</div>

        {/* Link to register page */}
        <p className="switch-text">
          Don't have an account?{" "}
          <span onClick={() => navigate("/")}>Register</span>
        </p>
      </div>
    </div>
  );
}

export default Login;