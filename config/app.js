// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const app = express();
// const path = require("path");

// // Body parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// const inquiryRoutes = require("../routes/inquiryRoutes");
// const categoryRoutes = require("../routes/CategoryRoutes");
// const productRoutes = require("../routes/ProductRoutes");
// const userRoutes = require("../routes/userRoutes");
// const dashboardRoutes = require("../routes/dashboardRoutes");

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));

// // Import routes

// app.use("/api/users", userRoutes);
// app.use("/api", inquiryRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", productRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Configuring ports
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// User data (in-memory storage; replace this with MongoDB for production)
const users = [];

// Routes

// Register Route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = { email, password: hashedPassword };
  users.push(user);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Protected route (requires authentication)
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'Access granted', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Import external routes
const inquiryRoutes = require("../routes/inquiryRoutes");
const categoryRoutes = require("../routes/CategoryRoutes");
const productRoutes = require("../routes/ProductRoutes");
const userRoutes = require("../routes/userRoutes");
const dashboardRoutes = require("../routes/dashboardRoutes");

app.use("/api/users", userRoutes);
app.use("/api", inquiryRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

