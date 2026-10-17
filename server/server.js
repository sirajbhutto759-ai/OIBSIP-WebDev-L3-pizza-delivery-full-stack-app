require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const pizzaRoutes = require('./routes/pizzas');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to DB first, then seed, then start listening
const startServer = async () => {
  await connectDB();

  // Auto-seed if DB is empty
  try {
    const User = require('./models/User');
    const Pizza = require('./models/Pizza');
    const userCount = await User.countDocuments();
    const pizzaCount = await Pizza.countDocuments();
    if (userCount === 0 || pizzaCount === 0) {
      console.log('🌱 Database is empty — running auto-seed...');
      const seed = require('./scripts/seed');
      await seed();
    }
  } catch (err) {
    console.warn('⚠️  Auto-seed skipped:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 PizzaHub server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
