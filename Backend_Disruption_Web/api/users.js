// api/users.js

const userController = require("../controllers/usersController.js");
const authenticateToken = require('../middleware/authenticateToken');

module.exports = async (req, res) => {
  const { method, url } = req;
  const id = url.split('/').pop(); // Mengambil id dari URL jika ada

  try {
    if (method === 'POST' && url === '/api/users/register') {
      // Endpoint untuk registrasi user
      return await userController.createUser(req, res);

    } else if (method === 'POST' && url === '/api/users/login') {
      // Endpoint untuk login user
      return await userController.loginUser(req, res);

    } else if (method === 'GET' && url.startsWith('/api/users/') && id) {
      // Endpoint untuk mendapatkan user berdasarkan ID
      await authenticateToken(req, res, async () => {
        return await userController.getUserById(req, res);
      });

    } else if (method === 'PUT' && url.startsWith('/api/users/') && id) {
      // Endpoint untuk mengupdate user berdasarkan ID
      await authenticateToken(req, res, async () => {
        return await userController.updateUser(req, res);
      });

    } else if (method === 'DELETE' && url.startsWith('/api/users/') && id) {
      // Endpoint untuk soft delete user berdasarkan ID
      await authenticateToken(req, res, async () => {
        return await userController.deleteUser(req, res);
      });

    } else {
      // Jika metode atau URL tidak sesuai
      res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
