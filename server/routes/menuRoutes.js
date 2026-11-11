const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', menuController.getAllMenuItems);
router.get('/:id', menuController.getMenuItemById);

// Protected admin routes
router.post('/', authMiddleware, upload.single('image'), menuController.createMenuItem);
router.put('/:id', authMiddleware, upload.single('image'), menuController.updateMenuItem);
router.delete('/:id', authMiddleware, menuController.deleteMenuItem);
router.patch('/:id/toggle-availability', authMiddleware, menuController.toggleAvailability);
router.patch('/:id/toggle-special', authMiddleware, menuController.toggleSpecial);

module.exports = router;
