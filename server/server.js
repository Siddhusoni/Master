const express = require('express');
const db = require('./db'); // PostgreSQL Pool
const newsRoutes = require('./routes/newsRoutes');
const courseRoutes = require('./routes/courses');
const enrollRoute = require('./routes/enrollRoute');
const membershipRoutes = require('./routes/membershipRoutes');
const adsRoutes = require('./routes/ads');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const JWT_SECRET = 'soni#12@'; // Secure this in real apps
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', newsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollRoute);
app.use('/api/membership', membershipRoutes);
app.use('/api/ads', adsRoutes);

// Utility Functions
async function getUserByEmail(email) {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

function validatePassword(providedPassword, storedHash) {
  return bcrypt.compareSync(providedPassword, storedHash);
}

function generateToken(user) {
  const payload = { id: user.id, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// 🟢 Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });

  try {
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);

    res.status(200).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Database error', error: err });
  }
});

// 🔑 Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (user && validatePassword(password, user.password)) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Login error', error: err });
  }
});

// 📦 Add Course Route (Demo)
app.post('/api/courses', (req, res) => {
  const course = req.body;
  console.log("Received course:", course);
  res.status(201).json({ message: "Course added successfully", course });
});

// 📩 Contact Form Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.query('INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)', [name, email, message]);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({ message: "Database error", errorrrr: err });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
