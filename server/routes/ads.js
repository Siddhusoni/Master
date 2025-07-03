const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL Pool

// GET all ads
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ads ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch ads error:', err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

// POST a new ad
router.post('/', async (req, res) => {
  const { title, description, image_url } = req.body;

  if (!title || !image_url) {
    return res.status(400).json({ error: 'Title and image_url are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO ads (title, description, image_url) VALUES ($1, $2, $3) RETURNING id',
      [title, description, image_url]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Insert ad error:', err);
    res.status(500).json({ error: 'Failed to insert ad' });
  }
});

// DELETE an ad
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM ads WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete ad error:', err);
    res.status(500).json({ error: 'Failed to delete ad' });
  }
});

module.exports = router;
