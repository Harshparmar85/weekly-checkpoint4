// ============================================================
// App.tsx - Root component with routing configuration
// Sets up all application routes and protects the dashboard
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Auth from "./auth/Auth";
import "./App.css";

/**
 * ProtectedRoute - Wrapper component that guards private routes.
 * If user is not logged in (no token), redirects to /login.
 * If user is logged in, renders the child component.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Check if JWT token exists in localStorage
  if (!Auth.isLoggedIn()) {
    // Redirect unauthenticated users to login page
    return <Navigate to="/login" replace />;
  }
  // Render the protected component
  return <>{children}</>;
}

/**
 * App - Root application component.
 * Defines all routes:
 *   /           → Register page (default)
 *   /login      → Login page
 *   /dashboard  → Dashboard (protected, requires login)
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - accessible without login */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route - only accessible when logged in */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;