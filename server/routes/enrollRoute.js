const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL connection

// Enroll Route
router.post('/enroll', (req, res) => {
  const { name, email, mobile, courseId, title, price } = req.body;

  if (!name || !email || !mobile || !courseId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO enrollments (name, email, mobile, course_id, course_title, course_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [name, email, mobile, courseId, title, price], (err, result) => {
    if (err) {
      console.error('Enrollment Error:', err);
      return res.status(500).json({ message: 'Failed to enroll' });
    }
    res.status(201).json({ message: 'Enrolled successfully!' });
  });
});

// 👇 Count total enrollments
router.get('/enrollments/count', (req, res) => {
  const sql = `SELECT COUNT(*) AS count FROM enrollments`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Count Error:', err);
      return res.status(500).json({ message: 'Failed to count enrollments' });
    }
    res.json({ count: result[0].count });
  });
});

module.exports = router;
