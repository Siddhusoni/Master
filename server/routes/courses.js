// server.js or routes/courses.js

const express = require("express");

const router = express.Router();
const db = require("../db"); // your MySQL connection


// GET all courses
router.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
});         
});

// POST new course (for admin panel)
router.post("/courses", (req, res) => { 
  const { title, price, image, duration } = req.body;
  const sql = "INSERT INTO courses (title, price, image, duration) VALUES (?, ?, ?, ?)";
  db.query(sql, [title, price, image, duration], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Course added successfully", id: result.insertId });
  });
});

// DELETE course
router.delete("/courses/:id", (req, res) => {
  const sql = "DELETE FROM courses WHERE id = ?";
db.query(sql, [req.params.id], (err, result) =>{
    if (err) return res.status(500).send(err);
    res.json({ message: "Course deleted successfully" });
  });
});

// UPDATE course
router.put("/courses/:id", (req, res) => {
  const { title, price, image, duration } = req.body;
  const sql = "UPDATE courses SET title=?, price=?, image=?, duration=? WHERE id=?";
  db.query(sql, [title, price, image, duration, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Course updated successfully" });
  });
});
module.exports = router;
