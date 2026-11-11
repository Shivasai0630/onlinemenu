const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']]
    });

    // Count items per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await MenuItem.count({ where: { categoryId: cat.id } });
        return {
          ...cat.toJSON(),
          itemCount: count
        };
      })
    );

    return res.json({ success: true, count: categoriesWithCount.length, data: categoriesWithCount });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving categories.' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const cleanName = name.trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ where: { name: cleanName } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists.' });
    }

    const maxSort = await Category.max('sortOrder') || 0;

    const newCategory = await Category.create({
      name: cleanName,
      slug,
      description: description ? description.trim() : '',
      icon: icon || 'Utensils',
      sortOrder: maxSort + 1
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: newCategory
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ success: false, message: 'Server error creating category.' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, sortOrder } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    if (name && name.trim()) {
      const cleanName = name.trim();
      category.name = cleanName;
      category.slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Also update categoryName in MenuItem table for consistency
      await MenuItem.update({ categoryName: cleanName }, { where: { categoryId: id } });
    }

    if (description !== undefined) category.description = description.trim();
    if (icon !== undefined) category.icon = icon;
    if (sortOrder !== undefined) category.sortOrder = parseInt(sortOrder, 10);

    await category.save();

    return res.json({
      success: true,
      message: 'Category updated successfully.',
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ success: false, message: 'Server error updating category.' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Check if category has menu items
    const itemCount = await MenuItem.count({ where: { categoryId: id } });
    if (itemCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${itemCount} dishes. Please reassign or delete the dishes first.`
      });
    }

    await category.destroy();
    return res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting category.' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
