const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/auth');

router.get('/', restaurantController.getRestaurantInfo);
router.put('/', authMiddleware, restaurantController.updateRestaurantInfo);
router.get('/stats', authMiddleware, restaurantController.getDashboardStats);

module.exports = router;
