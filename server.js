import express from "express";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.env.PORT || "3001", 10);
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://cheatsheets_app:4pp_s3cr3t@db-cheatsheets:5432/cheatsheets";

const SEED_FILE = join(__dirname, "dist", "content", "index.json");

const pool = new Pool({ connectionString: DATABASE_URL });

const app = express();
app.use(express.json({ limit: "10mb" }));

async function ensureRow() {
  await pool.query(
    `INSERT INTO cheatsheet_data (id, data) VALUES (1, '{"categories":[]}') ON CONFLICT (id) DO NOTHING`
  );
}

app.get("/api/data", async (req, res) => {
  try {
    await ensureRow();
    const result = await pool.query("SELECT data FROM cheatsheet_data WHERE id = 1");
    let data = result.rows[0].data;
    if (data.categories.length === 0 && existsSync(SEED_FILE)) {
      const seed = JSON.parse(readFileSync(SEED_FILE, "utf-8"));
      await pool.query("UPDATE cheatsheet_data SET data = $1 WHERE id = 1", [seed]);
      data = seed;
    }
    res.json(data);
  } catch (err) {
    console.error("Data read error:", err);
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.put("/api/data", async (req, res) => {
  try {
    await ensureRow();
    await pool.query("UPDATE cheatsheet_data SET data = $1, updated_at = NOW() WHERE id = 1", [
      req.body,
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
