const pool = require("../config/db.js");

exports.saveUserPreferences = async (req, res) => {
  const { supplierIds, preferredLocations, preferredRadius } = req.body;
  const userId = req.user.userId;

  try {
    const insertPromises = [];
    supplierIds.forEach((supplierId) => {
      preferredLocations.forEach((location) => {
        const query = `
            INSERT INTO UserPreferences (UserId, SupplierId, PreferredLocation, PreferredRadius, IsDeleted)
            VALUES ($1, $2, $3, $4, false)
          `;
        insertPromises.push(
          pool.query(query, [userId, supplierId, location, preferredRadius])
        );
      });
    });

    await Promise.all(insertPromises);
    res.status(200).json({ message: "Preferences saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user preferences
exports.getUserPreferences = async (req, res) => {
  const userId = req.user.userId; // Get user ID from JWT token

  try {
    const result = await pool.query(
      "SELECT * FROM UserPreferences WHERE UserId = $1 AND IsDeleted = false",
      [userId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suppliers for preferences
exports.getSuppliers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT Id, BP_Name FROM suppliers WHERE isDeleted = false"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cities for preferences
exports.getCities = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT Id, location FROM cities WHERE isDeleted = false"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
