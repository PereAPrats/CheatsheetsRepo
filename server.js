import express from "express";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.PORT || "3001", 10);
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://cheatsheets_app:4pp_s3cr3t@db-cheatsheets:5432/cheatsheets";

const SEED_FILE = join(__dirname, "dist", "content", "index.json");

const pool = new Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(express.json({ limit: "10mb" }));

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    req.username = payload.username;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, name, created_at",
      [username, email, hash, name || ""]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === "23505") {
      const field = err.constraint?.includes("username") ? "Username" : "Email";
      return res.status(409).json({ error: `${field} already exists` });
    }
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }
    const result = await pool.query(
      "SELECT id, username, email, name, password_hash FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "30d",
    });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, name: user.name, created_at: user.created_at },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, name, created_at FROM users WHERE id = $1",
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to get user" });
  }
});

app.put("/api/auth/profile", authenticate, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name && !email) {
      return res.status(400).json({ error: "name or email is required" });
    }
    const userResult = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!password || !(await bcrypt.compare(password, userResult.rows[0].password_hash))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const updates = [];
    const values = [];
    let idx = 1;
    if (name !== undefined) {
      updates.push(`name = $${idx++}`);
      values.push(name);
    }
    if (email !== undefined) {
      updates.push(`email = $${idx++}`);
      values.push(email);
    }
    updates.push(`updated_at = NOW()`);
    values.push(req.userId);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, username, email, name, created_at`,
      values
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("Profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.put("/api/auth/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    const userResult = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!(await bcrypt.compare(currentPassword, userResult.rows[0].password_hash))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [hash, req.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Password error:", err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

app.get("/api/data", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT data FROM users WHERE id = $1", [req.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    let data = result.rows[0].data;
    if (data.categories.length === 0 && existsSync(SEED_FILE)) {
      const seed = JSON.parse(readFileSync(SEED_FILE, "utf-8"));
      await pool.query("UPDATE users SET data = $1 WHERE id = $2", [seed, req.userId]);
      data = seed;
    }
    res.json(data);
  } catch (err) {
    console.error("Data read error:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.put("/api/data", authenticate, async (req, res) => {
  try {
    await pool.query("UPDATE users SET data = $1, updated_at = NOW() WHERE id = $2", [
      req.body,
      req.userId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    console.error("Data write error:", err);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
});
