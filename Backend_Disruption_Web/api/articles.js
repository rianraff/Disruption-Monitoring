// api/articles.js
const { 
  scrapeAndSaveArticles, 
  getFilteredArticles,
  getArticleById,
  deleteArticle
} = require('../controllers/articlesController');
const authenticateToken = require('../middleware/authenticateToken');

module.exports = async (req, res) => {
  const { method, url } = req;

  // Authentication middleware
  await authenticateToken(req, res); // Memastikan permintaan diautentikasi

  if (res.headersSent) return; // Jika autentikasi gagal, hentikan proses

  if (method === 'POST' && url === '/api/articles/scrape') {
    return scrapeAndSaveArticles(req, res);
  } 
  
  if (method === 'GET' && url === '/api/articles') {
    return getFilteredArticles(req, res);
  } 
  
  if (method === 'GET' && url.startsWith('/api/articles/')) {
    const id = url.split('/').pop();
    req.params = { id };
    return getArticleById(req, res);
  } 
  
  if (method === 'DELETE' && url.startsWith('/api/articles/')) {
    const id = url.split('/').pop();
    req.params = { id };
    return deleteArticle(req, res);
  } 

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
};
