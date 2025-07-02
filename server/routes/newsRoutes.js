const express = require('express');
const router = express.Router();
const db = require('../db'); // ✅ Make sure this path and db.js file exist and are working

// Add News Route
router.post('/', (req, res) => {
  const { title, date, category, image } = req.body;

  // Validate input
  if (!title || !date || !category || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert into DB
  const sql = 'INSERT INTO news (title, date, category, image) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, date, category, image], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.status(201).json({ message: 'News added successfully', id: result.insertId });
  });
});

// Get All News
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM news ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Database fetch failed' });
    }
    res.json(results);
  });
});

// Delete News by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM news WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Failed to delete news' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  });
});

module.exports = router;
