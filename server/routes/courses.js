// routes/courses.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL pool

// ✅ GET /api/courses
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM courses ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ POST /api/courses
router.post("/", async (req, res) => {
  const { title, price, image, duration } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO courses (title, price, image, duration) VALUES ($1, $2, $3, $4) RETURNING id",
      [title, price, image, duration]
    );
    res.json({ message: "Course added successfully", id: result.rows[0].id });
  } catch (err) {
    console.error("Insert course error:", err);
    res.status(500).json({ error: "Failed to add course" });
  }
});

module.exports = router;
