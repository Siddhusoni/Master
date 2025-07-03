const express = require("express");
const router = express.Router();
const db = require("../db"); // PostgreSQL Pool

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    res.status(200).json({ message: "Message received" });
  } catch (err) {
    console.error("Contact insert error:", err);
    res.status(500).json({ message: "Error saving message" });
  }
});

module.exports = router;
