const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require('axios');

// Get location from User's IP
const getLocationFromIP = async (ip) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.IPINFO_TOKEN}`);
    const [lat, lng] = response.data.loc.split(","); // 'loc' berisi 'latitude,longitude'
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  } catch (error) {
    console.error("Error getting location from IP:", error.message);
    return { lat: null, lng: null };
  }
};

// Register a new user
exports.createUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const userId = await User.create(name, email, hashedPassword, isAdmin);
    res.status(201).json({ message: "User created successfully", userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Get User's IP from header or connection
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = await getLocationFromIP(ip);

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user.id,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by Id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    const updatedUser = await User.update(id, updatedFields);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user (soft delete)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.delete(id);
    res.status(200).json({ message: `User ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
