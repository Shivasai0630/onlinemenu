const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Category = require('./Category');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dietary: {
    type: DataTypes.ENUM('veg', 'non-veg', 'egg'),
    defaultValue: 'non-veg'
  },
  spiceLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 2 // 1: Mild, 2: Medium, 3: Spicy, 4: Extra Spicy
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSpecial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  portionSize: {
    type: DataTypes.STRING,
    allowNull: true
  },
  servingEstimate: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'items', onDelete: 'CASCADE' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

module.exports = MenuItem;
