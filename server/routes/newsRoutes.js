// routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL Pool

// 📰 Add News
router.post('/', async (req, res) => {
  const { title, date, category, image } = req.body;

  if (!title || !date || !category || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO news (title, date, category, image) VALUES ($1, $2, $3, $4) RETURNING id',
      [title, date, category, image]
    );
    res.status(201).json({ message: 'News added successfully', id: result.rows[0].id });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// 📃 Get All News
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

// ❌ Delete News by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM news WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
