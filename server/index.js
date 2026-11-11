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
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Middleware
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/qr', qrRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'The Lavish Restaurant API is running.', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// Initialize DB and seed data
async function initDB() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized successfully.');

    // Create default admin user if not exists
    const adminCount = await User.count();
    if (adminCount === 0) {
      await User.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'lavish@admin123',
        role: 'admin'
      });
      console.log('✅ Default admin user created. Username: admin | Password: lavish@admin123');
    }

    // Create default restaurant info if not exists
    const infoCount = await RestaurantInfo.count();
    if (infoCount === 0) {
      await RestaurantInfo.create({ id: 1 });
      console.log('✅ Default restaurant info created.');
    }

    // Seed categories and menu items
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      console.log('🌱 Seeding default categories and menu items...');
      for (const cat of defaultCategories) {
        await Category.create(cat);
      }
      const categories = await Category.findAll();
      const catMap = {};
      categories.forEach(c => { catMap[c.name] = c.id; });

      for (const item of defaultMenuItems) {
        const catId = catMap[item.categoryName];
        if (catId) {
          await MenuItem.create({ ...item, categoryId: catId });
        }
      }
      console.log(`✅ Seeded ${defaultMenuItems.length} menu items across ${defaultCategories.length} categories.`);
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}


async function startServer() {
  try {
    // Initialize database and seed default data
    await initDB();

    // Verify database connection
    await sequelize.authenticate();

    console.log('✅ Database connected successfully.');

    // Start Express server
    app.listen(PORT, () => {
      console.log('\n🍽️ THE LAVISH RESTAURANT API');
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Admin Dashboard: http://localhost:5173/admin`);
      console.log('✅ Backend ready!\n');
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();
