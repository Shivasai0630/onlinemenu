const { Op } = require('sequelize');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

const getAllMenuItems = async (req, res) => {
  try {
    const { category, search, dietary, popular, special, available } = req.query;
    const where = {};

    if (category && category !== 'all') {
      where.categoryId = category;
    }

    if (search && search.trim()) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } },
        { categoryName: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    if (dietary && dietary !== 'all') {
      where.dietary = dietary;
    }

    if (popular === 'true') {
      where.isPopular = true;
    }

    if (special === 'true') {
      where.isSpecial = true;
    }

    if (available !== undefined && available !== '') {
      where.isAvailable = available === 'true';
    }

    const items = await MenuItem.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      order: [['isPopular', 'DESC'], ['id', 'ASC']]
    });

    return res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving menu items.' });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    return res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching item by id:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving item.' });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      price,
      description,
      dietary,
      spiceLevel,
      isPopular,
      isSpecial,
      isAvailable,
      portionSize,
      servingEstimate,
      imageUrl
    } = req.body;

    if (!name || !categoryId || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required fields.'
      });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category selected.' });
    }

    // Determine image: file upload takes precedence over imageUrl
    let image = imageUrl || '';
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const newItem = await MenuItem.create({
      name: name.trim(),
      categoryId: parseInt(categoryId, 10),
      categoryName: category.name,
      price: parseFloat(price),
      description: description ? description.trim() : '',
      dietary: dietary || 'non-veg',
      spiceLevel: spiceLevel ? parseInt(spiceLevel, 10) : 2,
      isPopular: isPopular === 'true' || isPopular === true,
      isSpecial: isSpecial === 'true' || isSpecial === true,
      isAvailable: isAvailable === undefined ? true : (isAvailable === 'true' || isAvailable === true),
      portionSize: portionSize || '',
      servingEstimate: servingEstimate || '',
      image
    });

    return res.status(201).json({
      success: true,
      message: 'Dish successfully added to the menu.',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return res.status(500).json({ success: false, message: 'Server error creating dish.' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    const {
      name,
      categoryId,
      price,
      description,
      dietary,
      spiceLevel,
      isPopular,
      isSpecial,
      isAvailable,
      portionSize,
      servingEstimate,
      imageUrl
    } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (category) {
        item.categoryId = parseInt(categoryId, 10);
        item.categoryName = category.name;
      }
    }

    if (name) item.name = name.trim();
    if (price !== undefined) item.price = parseFloat(price);
    if (description !== undefined) item.description = description.trim();
    if (dietary !== undefined) item.dietary = dietary;
    if (spiceLevel !== undefined) item.spiceLevel = parseInt(spiceLevel, 10);
    if (isPopular !== undefined) item.isPopular = isPopular === 'true' || isPopular === true;
    if (isSpecial !== undefined) item.isSpecial = isSpecial === 'true' || isSpecial === true;
    if (isAvailable !== undefined) item.isAvailable = isAvailable === 'true' || isAvailable === true;
    if (portionSize !== undefined) item.portionSize = portionSize;
    if (servingEstimate !== undefined) item.servingEstimate = servingEstimate;

    // Handle image update
    if (req.file) {
      item.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined && imageUrl.trim()) {
      item.image = imageUrl.trim();
    }

    await item.save();

    return res.json({
      success: true,
      message: 'Menu item updated successfully.',
      data: item
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ success: false, message: 'Server error updating menu item.' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    await item.destroy();
    return res.json({ success: true, message: 'Menu item deleted successfully.' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting menu item.' });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    return res.json({
      success: true,
      message: `Item marked as ${item.isAvailable ? 'available' : 'unavailable'}.`,
      isAvailable: item.isAvailable,
      data: item
    });
  } catch (error) {
    console.error('Error toggling availability:', error);
    return res.status(500).json({ success: false, message: 'Server error updating availability.' });
  }
};

const toggleSpecial = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found.' });
    }

    item.isSpecial = !item.isSpecial;
    await item.save();

    return res.json({
      success: true,
      message: `Chef special status updated.`,
      isSpecial: item.isSpecial,
      data: item
    });
  } catch (error) {
    console.error('Error toggling special:', error);
    return res.status(500).json({ success: false, message: 'Server error updating special tag.' });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  toggleSpecial
};
