const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection instance

// Get all membership plans
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM membership_plans';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Add a new membership plan
router.post('/', (req, res) => {
  const { title, price, duration, features, badge } = req.body;
  const sql = 'INSERT INTO membership_plans (title, price, duration, features, badge) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, price, duration, JSON.stringify(features), badge], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Plan added', id: result.insertId });
  });
});

// Update a plan by ID
router.put('/:id', (req, res) => {
  const { title, price, duration, features, badge } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE membership_plans SET title=?, price=?, duration=?, features=?, badge=? WHERE id=?';
  db.query(sql, [title, price, duration, JSON.stringify(features), badge, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Plan updated' });
  });
});

// Delete a plan by ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM membership_plans WHERE id=?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Plan deleted' });
  });
});

module.exports = router;
