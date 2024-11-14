const db = require('../config/db');
const { getDisruptionTypeTotals, getWeeklyDisruptionTypeCounts, getSeverityLevelCounts, getTotalSeverityCounts } = require('../controllers/analyticsController');

module.exports = async (req, res) => {
  const { method, url } = req;

  // Menentukan endpoint berdasarkan URL
  if (method === 'GET' && url === '/api/analytics/disruption-type-totals') {
    return getDisruptionTypeTotals(req, res);
  } 
  else if (method === 'GET' && url === '/api/analytics/weekly-disruption-type-counts') {
    return getWeeklyDisruptionTypeCounts(req, res);
  } 
  else if (method === 'GET' && url === '/api/analytics/severity-level-counts') {
    return getSeverityLevelCounts(req, res);
  } 
  else if (method === 'GET' && url === '/api/analytics/total-severity-counts') {
    return getTotalSeverityCounts(req, res);
  } 
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};
