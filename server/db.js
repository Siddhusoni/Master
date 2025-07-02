// db.js
const { Pool } = require('pg');
require('dotenv').config(); // Load .env variables (only local dev)

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // ✅ Needed for Render
    : false,                       // ❌ Disable SSL locally
});

// Optional: Immediate connection test
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;
