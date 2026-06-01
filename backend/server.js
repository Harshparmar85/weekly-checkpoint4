// ============================================================
// server.js - Main backend server for Student Registration App
// Uses Express.js with JWT authentication
// ============================================================

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Allow requests from the React frontend (Vite dev server)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── In-Memory Data Store ─────────────────────────────────────
// NOTE: This resets every time the server restarts.
// In production, replace this with a real database (e.g. PostgreSQL + Prisma)
const users = [];

// ─── Helper: Generate JWT Token ──────────────────────────────
/**
 * Creates a signed JWT token for the given user payload.
 * Token expires in 1 day.
 * @param {object} payload - Data to encode in token (id, email)
 * @returns {string} Signed JWT token
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// ─── Middleware: Verify JWT Token ─────────────────────────────
/**
 * Middleware that checks the Authorization header for a valid JWT.
 * Attaches the decoded user to req.user if valid.
 * Returns 401 if token is missing or invalid.
 */
function verifyToken(req, res, next) {
  // Get the Authorization header (format: "Bearer <token>")
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract the token part after "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token format invalid" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded payload to request object
    next(); // Continue to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ─── Route: POST /api/register ────────────────────────────────
/**
 * Registers a new student.
 * - Validates that all required fields are provided
 * - Checks if email is already registered
 * - Hashes the password using bcrypt
 * - Returns a JWT token on success
 */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, phone, gender, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !gender || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists in our store
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student object
    const newStudent = {
      id: Date.now(), // Use timestamp as a simple unique ID
      name,
      email,
      phone,
      gender,
      password: hashedPassword, // Store hashed password, never plain text
    };

    // Save student to in-memory store
    users.push(newStudent);

    // Generate JWT token for the new student
    const token = generateToken({ id: newStudent.id, email: newStudent.email });

    // Return token and student info (excluding password)
    res.status(201).json({
      token,
      student: {
        id: newStudent.id,
        name: newStudent.name,
        email: newStudent.email,
        phone: newStudent.phone,
        gender: newStudent.gender,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Route: POST /api/login ───────────────────────────────────
/**
 * Logs in an existing student.
 * - Finds user by email
 * - Compares password with stored hash
 * - Returns a JWT token on success
 */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find student by email
    const student = users.find((u) => u.email === email);
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with stored hashed password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken({ id: student.id, email: student.email });

    // Return token and student info (excluding password)
    res.status(200).json({
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── Route: GET /api/me ───────────────────────────────────────
/**
 * Protected route - returns the currently logged-in student's info.
 * Requires a valid JWT token in the Authorization header.
 * Used to verify authentication is working (also for Postman testing).
 */
app.get("/api/me", verifyToken, (req, res) => {
  // req.user was set by verifyToken middleware (contains id and email)
  const student = users.find((u) => u.id === req.user.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Return student info without the password field
  const { password, ...studentData } = student;
  res.status(200).json(studentData);
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});