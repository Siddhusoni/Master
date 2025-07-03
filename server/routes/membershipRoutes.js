const express = require('express');
const router = express.Router();
const db = require('../db'); // PostgreSQL Pool instance

// ✅ Get all membership plans
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM membership_plans');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching plans:', err);
    res.status(500).json({ error: 'Database fetch failed' });
  }
});

// ✅ Add a new membership plan
router.post('/', async (req, res) => {
  const { title, price, duration, features, badge } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO membership_plans (title, price, duration, features, badge) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, price, duration, JSON.stringify(features), badge]
    );
    res.status(201).json({ message: 'Plan added', id: result.rows[0].id });
  } catch (err) {
    console.error('Error adding plan:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// ✅ Update a plan by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, price, duration, features, badge } = req.body;

  try {
    await db.query(
      'UPDATE membership_plans SET title=$1, price=$2, duration=$3, features=$4, badge=$5 WHERE id=$6',
      [title, price, duration, JSON.stringify(features), badge, id]
    );
    res.json({ message: 'Plan updated' });
  } catch (err) {
    console.error('Error updating plan:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete a plan by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM membership_plans WHERE id=$1', [id]);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    console.error('Error deleting plan:', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
