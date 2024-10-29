const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController.js");
const authenticateToken = require('../middleware/authenticateToken');

// Create a new user (Registration)
router.post("/register", userController.createUser);

// Login route
router.post("/login", userController.loginUser);

// Get user by Id
router.get("/:id", authenticateToken, userController.getUserById);

// Update user details
router.put("/:id", authenticateToken, userController.updateUser);

// Soft delete user
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;