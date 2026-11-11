
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { sequelize } = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const RestaurantInfo = require('./models/RestaurantInfo');
const { defaultCategories, defaultMenuItems } = require('./config/defaultData');

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS configuration
const allowedOrigins = [
  'https://onlinemenu-gamma.vercel.app',
  'https://onlinemenu-q9ivrd8il-banty8.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173'
];

// Add the configured frontend URL from Render environment variables
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an Origin header (health checks, server tools)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.warn('Blocked by CORS:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/qr', qrRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'The Lavish Restaurant API is running.',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

// Initialize database and seed default data
async function initDB() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    // Create admin if it doesn't exist
    const adminCount = await User.count();

    if (adminCount === 0) {
      if (!process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_PASSWORD is missing in environment variables.');
      }

      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });

      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // Create restaurant information if missing
    const infoCount = await RestaurantInfo.count();

    if (infoCount === 0) {
      await RestaurantInfo.create({ id: 1 });
      console.log('Restaurant information created.');
    }

    // Create categories if missing
    const categoryCount = await Category.count();

    if (categoryCount === 0) {
      console.log('Creating default categories...');

      for (const cat of defaultCategories) {
        await Category.create(cat);
      }

      console.log(`${defaultCategories.length} categories created.`);
    } else {
      console.log(`${categoryCount} categories already exist.`);
    }

    // Seed menu items independently of categories
    const menuCount = await MenuItem.count();

    if (menuCount === 0) {
      console.log('Seeding default menu items...');

      const categories = await Category.findAll();
      const catMap = {};

      categories.forEach(category => {
        catMap[category.name] = category.id;
      });

      for (const item of defaultMenuItems) {
        const { categoryName, ...menuItem } = item;
        const categoryId = catMap[categoryName];

        if (categoryId) {
          await MenuItem.create({
            ...menuItem,
            categoryId
          });
        } else {
          console.warn(`Category not found: ${categoryName}`);
        }
      }

      const finalMenuCount = await MenuItem.count();
      console.log(`Successfully seeded ${finalMenuCount} menu items.`);
    } else {
      console.log(`Menu already contains ${menuCount} items.`);
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Start server
async function startServer() {
  try {
    await initDB();

    await sequelize.authenticate();
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log('\nTHE LAVISH RESTAURANT API');
      console.log(`Server running on port ${PORT}`);
      console.log('Backend ready!\n');
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
