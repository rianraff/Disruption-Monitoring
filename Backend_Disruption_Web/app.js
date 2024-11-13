const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require('node-cron');

require('dotenv').config();

const articleRoutes = require("./routes/articleRoutes");
const userRoutes = require("./routes/userRoutes");
const preferenceRoutes = require("./routes/preferenceRoutes");
const analyticsRoutes = require('./routes/analyticRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
