const pool = require("../config/db.js");

const User = {
  create: async (name, email, password, isAdmin = false) => {
    const query = `
      INSERT INTO Users (Name, Email, Password, IsAdmin, Created_At, IsDeleted)
      VALUES ($1, $2, $3, $4, NOW(), false)
      RETURNING Id;
    `;
    const values = [name, email, password, isAdmin];
    try {
      const result = await pool.query(query, values);
      return result.rows[0].id; // Return the generated user Id
    } catch (error) {
      throw new Error(error.message);
    }
  },

  findById: async (userId) => {
    const query = `SELECT * FROM Users WHERE Id = $1 AND IsDeleted = false`;
    try {
      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  findByEmail: async (email) => {
    const query = `SELECT * FROM Users WHERE Email = $1 AND IsDeleted = false`;
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (userId, updatedFields) => {
    const { name, email, password, isAdmin } = updatedFields;
    const query = `
      UPDATE Users
      SET Name = COALESCE($1, Name), Email = COALESCE($2, Email), 
          Password = COALESCE($3, Password), IsAdmin = COALESCE($4, IsAdmin)
      WHERE Id = $5 AND IsDeleted = false
      RETURNING *;
    `;
    const values = [name, email, password, isAdmin, userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  delete: async (userId) => {
    const query = `
      UPDATE Users SET IsDeleted = true WHERE Id = $1;
    `;
    try {
      await pool.query(query, [userId]);
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = User;
