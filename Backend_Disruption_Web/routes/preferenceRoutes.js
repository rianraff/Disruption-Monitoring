const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const authenticateToken = require('../middleware/authenticateToken');

// Get suppliers for preference form
router.get('/suppliers', preferencesController.getSuppliers);

// Get cities for preference form
router.get('/cities', preferencesController.getCities);

// Save user preferences (multiple suppliers and locations)
router.post('/save', authenticateToken, preferencesController.saveUserPreferences);

// Get user preferences
router.get('/user', authenticateToken, preferencesController.getUserPreferences);

module.exports = router;