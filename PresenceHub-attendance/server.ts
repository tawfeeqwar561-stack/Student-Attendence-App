import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("attendance.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'teacher'
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    roll_number TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    date TEXT NOT NULL,
    status TEXT CHECK(status IN ('present', 'absent')),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(student_id, date)
  );
`);

// Seed initial admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run("admin", "admin123", "teacher");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password) as any;
    if (user) {
      res.json({ id: user.id, username: user.username, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Students
  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT * FROM students ORDER BY name ASC").all();
    res.json(students);
  });

  app.post("/api/students", (req, res) => {
    const { name, roll_number, class_name } = req.body;
    try {
      const result = db.prepare("INSERT INTO students (name, roll_number, class_name) VALUES (?, ?, ?)").run(name, roll_number, class_name);
      res.json({ id: result.lastInsertRowid, name, roll_number, class_name });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/students/:id", (req, res) => {
    db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
    db.prepare("DELETE FROM attendance WHERE student_id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Attendance
  app.get("/api/attendance", (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });
    
    const records = db.prepare(`
      SELECT s.id as student_id, s.name, s.roll_number, a.status, a.date
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
      ORDER BY s.name ASC
    `).all(date);
    res.json(records);
  });

  app.post("/api/attendance/mark", (req, res) => {
    const { date, records } = req.body; // records: [{student_id, status}]
    
    const insert = db.prepare(`
      INSERT INTO attendance (student_id, date, status) 
      VALUES (?, ?, ?)
      ON CONFLICT(student_id, date) DO UPDATE SET status=excluded.status
    `);

    const transaction = db.transaction((data) => {
      for (const record of data) {
        insert.run(record.student_id, date, record.status);
      }
    });

    try {
      transaction(records);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/stats/summary", (req, res) => {
    const stats = db.prepare(`
      SELECT 
        s.id, s.name, s.roll_number,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
        COUNT(a.id) as total_days
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id
      GROUP BY s.id
    `).all();
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
