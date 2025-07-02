const express = require('express');
const db = require('./db'); // ✅ Ensure this path and db.js file are correct
const newsRoutes = require('./routes/newsRoutes'); // Import News Routes
const courseRoutes = require('./routes/courses');
const enrollRoute = require('./routes/enrollRoute'); // Import Course Routes
const membershipRoutes = require('./routes/membershipRoutes');
const adsRoutes = require('./routes/ads');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'soni#12@'; // Your JWT secret

const cors = require('cors');
const app = express();
app.use(cors()); // This allows cross-origin requests

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Routes
app.use('/api/news', newsRoutes); // All news-related endpoints
app.use('/api/courses', courseRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollRoute);
app.use('/api/membership', membershipRoutes);
app.use('/api/ads', adsRoutes);

// Function to get user by email
function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Return the first matching user
      }
    });
  });
}

// Function to validate password
function validatePassword(providedPassword, storedPassword) {
  return bcrypt.compareSync(providedPassword, storedPassword); // Compares hashed password
}

// Function to generate JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Generate JWT token with expiration
}

// Register route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required'});
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error'});

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email already registered'});
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: 'Error hashing password'});

      const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [name, email, hash], (err) => {
        if (err) return res.status(500).json({ message: 'Failed to register'});
        res.status(200).json({ message: 'Registered successfully'});
      });
    });
  });
});

// Login route
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
    res.status(500).json({ message: 'Error in login', error: err });
  }
});

// Route for adding a course
app.post('/api/courses', (req, res) => {
  const course = req.body;
  console.log("Received course:", course);
  res.status(201).json({ message: "Course added successfully", course });
});

// API endpoint for contact form submission
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  const sql = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json({ message: "Message sent successfully" });
  });
});

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
