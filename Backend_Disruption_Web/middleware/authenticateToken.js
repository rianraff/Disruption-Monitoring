const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from header

  if (!token) {
    res.status(401).json({ message: 'Access Token Required' });
    return false; // Hentikan eksekusi jika tidak ada token
  }

  try {
    // Verifikasi token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Simpan data pengguna ke dalam request
    return true; // Lanjutkan eksekusi jika token valid
  } catch (err) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
    return false; // Hentikan eksekusi jika token tidak valid atau kedaluwarsa
  }
};

module.exports = authenticateToken;