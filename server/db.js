// db.js
const { Pool } = require('pg');
require('dotenv').config(); // for local dev

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;

