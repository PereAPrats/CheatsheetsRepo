const express = require("express");
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");

const DATA_DIR = process.env.DATA_DIR || "/data";
const DATA_FILE = join(DATA_DIR, "data.json");
const SEED_FILE = join(__dirname, "dist", "content", "index.json");

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static(join(__dirname, "dist")));

function readData() {
  if (existsSync(DATA_FILE)) {
    return JSON.parse(readFileSync(DATA_FILE, "utf-8"));
  }
  mkdirSync(DATA_DIR, { recursive: true });
  if (existsSync(SEED_FILE)) {
    const seed = JSON.parse(readFileSync(SEED_FILE, "utf-8"));
    writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return { categories: [] };
}

app.get("/api/data", (_req, res) => {
  try {
    res.json(readData());
  } catch (err) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

app.put("/api/data", (req, res) => {
  try {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.use((_req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = parseInt(process.env.PORT || "8080", 10);
app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
