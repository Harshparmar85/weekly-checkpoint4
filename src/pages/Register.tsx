// ============================================================
// Register.tsx - Student Registration Page
// Collects student details, calls Auth.register(), saves JWT
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import type { RegisterForm } from "../types";

function Register() {
  const navigate = useNavigate();

  // ─── Form State ─────────────────────────────────────────────
  // Tracks all form field values
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirm: "",
  });

  // Tracks error message to display to user
  const [error, setError] = useState<string>("");

  // Tracks loading state while API call is in progress
  const [loading, setLoading] = useState<boolean>(false);

  // ─── Input Handler ───────────────────────────────────────────
  /**
   * Updates the relevant form field in state when user types.
   * Uses the input's name attribute to know which field to update.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ─── Form Submit Handler ─────────────────────────────────────
  /**
   * Validates the form, calls the register API, and navigates
   * to the dashboard on success or shows an error on failure.
   */
  const handleSubmit = async () => {
    setError(""); // Clear any previous errors

    // Client-side validation
    if (!form.name || !form.email || !form.phone || !form.gender || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Call Auth.register() which posts to backend and saves token
      await Auth.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        password: form.password,
      });

      // Navigate to dashboard after successful registration
      navigate("/dashboard");
    } catch (err) {
      // Display backend error message (e.g. "Email already registered")
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* App logo icon */}
        <div className="auth-logo">
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2>Create Account</h2>
        <p className="subtitle">Join the student portal today</p>

        {/* Error message - only shown when error state is set */}
        {error && <div className="error">⚠ {error}</div>}

        {/* Full Name field */}
        <div className="form-group">
          <span className="icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Email Address field */}
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

        {/* Phone + Gender in two columns */}
        <div className="form-row">
          <div className="form-group">
            <span className="icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.64 18a19.5 19.5 0 0 1-3.14-3.14 19.79 19.79 0 0 1-3.92-8.18A2 2 0 0 1 6.55 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L10.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 24 16.92z" />
              </svg>
            </span>
            <input
              name="phone"
              type="tel"
              placeholder="Contact Number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <span className="icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
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

        {/* Confirm Password field */}
        <div className="form-group">
          <span className="icon">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
          />
        </div>

        {/* Submit button - shows loading state while API call runs */}
        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="divider">or</div>

        {/* Link to login page */}
        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

export default Register;