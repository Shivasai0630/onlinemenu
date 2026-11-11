const RestaurantInfo = require('../models/RestaurantInfo');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

const getRestaurantInfo = async (req, res) => {
  try {
    let info = await RestaurantInfo.findByPk(1);
    if (!info) {
      info = await RestaurantInfo.create({ id: 1 });
    }
    return res.json({ success: true, data: info });
  } catch (error) {
    console.error('Error fetching restaurant info:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving restaurant info.' });
  }
};

const updateRestaurantInfo = async (req, res) => {
  try {
    let info = await RestaurantInfo.findByPk(1);
    if (!info) {
      info = await RestaurantInfo.create({ id: 1 });
    }

    const {
      name,
      tagline,
      about,
      phone,
      whatsappNumber,
      email,
      address,
      openingHours,
      googleMapsUrl,
      instagramUrl,
      facebookUrl,
      tableReservationEnabled
    } = req.body;

    if (name) info.name = name.trim();
    if (tagline) info.tagline = tagline.trim();
    if (about !== undefined) info.about = about.trim();
    if (phone !== undefined) info.phone = phone.trim();
    if (whatsappNumber !== undefined) info.whatsappNumber = whatsappNumber.trim();
    if (email !== undefined) info.email = email.trim();
    if (address !== undefined) info.address = address.trim();
    if (openingHours !== undefined) info.openingHours = openingHours.trim();
    if (googleMapsUrl !== undefined) info.googleMapsUrl = googleMapsUrl.trim();
    if (instagramUrl !== undefined) info.instagramUrl = instagramUrl.trim();
    if (facebookUrl !== undefined) info.facebookUrl = facebookUrl.trim();
    if (tableReservationEnabled !== undefined) info.tableReservationEnabled = tableReservationEnabled;

    await info.save();

    return res.json({
      success: true,
      message: 'Restaurant information updated successfully.',
      data: info
    });
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    return res.status(500).json({ success: false, message: 'Server error updating restaurant info.' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalItems = await MenuItem.count();
    const totalCategories = await Category.count();
    const availableItems = await MenuItem.count({ where: { isAvailable: true } });
    const unavailableItems = await MenuItem.count({ where: { isAvailable: false } });
    const vegItems = await MenuItem.count({ where: { dietary: 'veg' } });
    const nonVegItems = await MenuItem.count({ where: { dietary: 'non-veg' } });
    const eggItems = await MenuItem.count({ where: { dietary: 'egg' } });
    const specialItems = await MenuItem.count({ where: { isSpecial: true } });
    const popularItems = await MenuItem.count({ where: { isPopular: true } });

    return res.json({
      success: true,
      data: {
        totalItems,
        totalCategories,
        availableItems,
        unavailableItems,
        vegItems,
        nonVegItems,
        eggItems,
        specialItems,
        popularItems
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving dashboard stats.' });
  }
};

module.exports = {
  getRestaurantInfo,
  updateRestaurantInfo,
  getDashboardStats
};
