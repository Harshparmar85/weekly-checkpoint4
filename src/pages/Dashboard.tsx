// ============================================================
// Dashboard.tsx - Protected Student Dashboard Page
// Only accessible when logged in (JWT token exists)
// Displays student info retrieved from localStorage
// ============================================================

import { useNavigate } from "react-router-dom";
import Auth from "../auth/Auth";
import type { Student } from "../types";

function Dashboard() {
  const navigate = useNavigate();

  // ─── Get Student Data ────────────────────────────────────────
  // Retrieve the logged-in student's data from localStorage
  const student: Student | null = Auth.getStudent();

  // Generate avatar initials from student's name (e.g. "John Doe" → "JD")
  const initials = student?.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";

  // ─── Logout Handler ──────────────────────────────────────────
  /**
   * Clears JWT token and student data from localStorage,
   * then redirects the user to the login page.
   */
  const handleLogout = () => {
    Auth.logout();
    navigate("/login");
  };

  // ─── Render ──────────────────────────────────────────────────
  return (
    <div className="dashboard-page">

      {/* ── Top Navigation Bar ── */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          {/* Brand logo */}
          <div className="nav-logo">
            <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          Student Portal
        </div>

        {/* Logout button */}
        <button className="btn-logout" onClick={handleLogout}>
          Sign Out
        </button>
      </nav>

      {/* ── Dashboard Body ── */}
      <div className="dashboard-body">

        {/* Welcome banner with student's first name */}
        <div className="welcome-banner">
          <h1>Hello, {student?.name?.split(" ")[0]} 👋</h1>
          <p>Welcome to your student dashboard. Here's your profile overview.</p>
        </div>

        {/* Student details card */}
        <div className="student-card">

          {/* Avatar row with initials and name */}
          <div className="avatar-row">
            <div className="avatar">{initials}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", margin: 0 }}>
                {student?.name}
              </p>
              <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                Registered Student
              </p>
            </div>
          </div>

          <h3>Account Details</h3>

          {/* Two-column grid of student fields */}
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p>{student?.email}</p>
            </div>
            <div className="info-item">
              <label>Contact</label>
              <p>{student?.phone || "—"}</p>
            </div>
            <div className="info-item">
              <label>Gender</label>
              <p>{student?.gender || "—"}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p style={{ color: "#16a34a" }}>✓ Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;