const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL Pool

// 📝 Enroll Route
router.post('/enroll', async (req, res) => {
  const { name, email, mobile, courseId, title, price } = req.body;

  if (!name || !email || !mobile || !courseId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await db.query(
      `INSERT INTO enrollments (name, email, mobile, course_id, course_title, course_price)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, mobile, courseId, title, price]
    );
    res.status(201).json({ message: 'Enrolled successfully!' });
  } catch (err) {
    console.error('Enrollment Error:', err);
    res.status(500).json({ message: 'Failed to enroll' });
  }
});

// 🔢 Count total enrollments
router.get('/enrollments/count', async (req, res) => {
  try {
    const result = await db.query(`SELECT COUNT(*) AS count FROM enrollments`);
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (err) {
    console.error('Count Error:', err);
    res.status(500).json({ message: 'Failed to count enrollments' });
  }
});

module.exports = router;
