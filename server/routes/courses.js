const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL Pool

// 📦 GET all courses
router.get("/courses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM courses ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Fetch courses error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ➕ POST a new course
router.post("/courses", async (req, res) => {
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

// 🗑 DELETE a course
router.delete("/courses/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM courses WHERE id = $1", [req.params.id]);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

// ✏️ UPDATE a course
router.put("/courses/:id", async (req, res) => {
  const { title, price, image, duration } = req.body;
  try {
    await db.query(
      "UPDATE courses SET title = $1, price = $2, image = $3, duration = $4 WHERE id = $5",
      [title, price, image, duration, req.params.id]
    );
    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ error: "Failed to update course" });
  }
});

module.exports = router;
