const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// GET all ads
router.get('/', (req, res) => {
  db.query('SELECT * FROM ads ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch ads' });
    res.json(results);
  });
});

// POST a new ad
router.post('/', (req, res) => {
  const { title, description, image_url } = req.body;
  if (!title || !image_url) {
    return res.status(400).json({ error: 'Title and image_url are required' });
  }

  const sql = 'INSERT INTO ads (title, description, image_url) VALUES (?, ?, ?)';
  db.query(sql, [title, description, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to insert ad' });
    res.json({ success: true, id: result.insertId });
  });
});

// DELETE an ad
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM ads WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to delete ad' });
    res.json({ success: true });
  });
});

module.exports = router;
