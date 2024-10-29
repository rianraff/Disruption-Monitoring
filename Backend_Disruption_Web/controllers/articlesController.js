const pool = require("../config/db.js");
require("dotenv").config();
const OpenAI = require("openai");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const axios = require("axios");

// [FUNCTIONAL] Function to check if an article already exists in the database
const checkArticleExists = async (url) => {
  try {
    const result = await pool.query(
      "SELECT id FROM articles WHERE url = $1 AND isdeleted = false",
      [url]
    );
    return result.rowCount > 0; // Return true if article exists
  } catch (error) {
    console.error("Error checking article existence:", error.message);
    return false;
  }
};

// Function to get latitude and longitude using Google Geocoding API
const getLatLngFromLocation = async (location) => {
  if (!location || location === "Unknown") {
    return { lat: null, lng: null };
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location
      )}&key=${process.env.GOOGLE_GEOCODING_API_KEY}`
    );

    const data = response.data;

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.warn(`No results found for location: ${location}`);
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error(
      `Error fetching lat/lng for location "${location}":`,
      error.message
    );
    return { lat: null, lng: null };
  }
};

// [FUNCTIONAL] Function to detect severity and location using OpenAI GPT-4o-Mini
const detectSeverityAndLocation = async (text) => {
  const prompt = `Based on this article description: "${text}", classify the severity of the disruption into one of the following: Low, Medium, High. 
                  Also, classify the country location of the disruption. Format the response as: "Severity: <Low/Medium/High>, Location: <country>". 
                  If unsure or unknown, just put the response as: "Severity: Low, Location: Unknown".`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that categorizes disruption severity and location.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 20,
  });

  const response =
    completion.choices[0]?.message?.content?.trim() ||
    "Severity: Low, Location: No Location Detected";

  const [severity, location] = response
    .split(",")
    .map((part) => part.split(":")[1].trim());

  return { severity, location };
};

// [FUNCTIONAL] Function to detect disruption type using OpenAI GPT-4o-Mini
const detectDisruptionType = async (text) => {
  const prompt = `Classify the disruption in the following article into one of these categories: 
                  'Airport Disruption', 
                  'Bankruptcy', 
                  'Business Spin-Off', 
                  'Business Sale',
                  'Chemical Spill',
                  'Corruption',
                  'Company Split',
                  'Cyber Attack',
                  'FDA/EMA/OSHA Action',
                  'Factory Fire',
                  'Fine',
                  'Geopolitical',
                  'Leadership Transition',
                  'Legal Action',
                  'Merger & Acquisition',
                  'Port Disruption',
                  'Protest/Riot',
                  'Supply Shortage',
                  'Earthquake',
                  'Extreme Weather',
                  'Flood',
                  'Hurricane',
                  'Tornado',
                  'Volcano',
                  'Human Health',
                  'Power Outage',
                  'CNA',
                  'Port Disruption',
                  or 'Unknown'. Just choose one, no explanation!`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that categorizes disruptions type AND can only choose one without explanation.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 10,
  });

  const disruption =
    completion.choices[0]?.message?.content?.trim() || "Unknown";
  return disruption;
};

// [FUNCTIONAL] Function to save articles to the database (batch insertion)
const saveArticlesToDatabase = async (articles) => {
  const query = `
      INSERT INTO articles (title, text, disruptiontype, severity, sourcename, publisheddate, url, imageurl, created_at, location, lat, lng, radius, isdeleted)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11, $12, $13)
      RETURNING id;
    `;

  const promises = articles.map((article) => {
    const values = [
      article.title,
      article.text,
      article.disruptionType,
      article.severity,
      article.sourceName,
      article.publishedDate,
      article.url,
      article.imageUrl,
      article.location,
      article.lat || 0.0,
      article.lng || 0.0,
      article.radius || null,
      article.isDeleted || false,
    ];

    return pool.query(query, values);
  });

  try {
    const results = await Promise.all(promises);
    results.forEach((result) => {
      const insertedId = result.rows[0].id;
      console.log(`Article saved to database with ID: ${insertedId}.`);
    });
  } catch (error) {
    console.error("Error saving articles to the database:", error.message);
  }
};

// Utility function to extract the first two paragraphs
const extractFirstTwoParagraphs = (text) => {
  const paragraphs = text.split("\n\n"); // Assuming paragraphs are separated by two newlines
  return paragraphs.slice(0, 2).join("\n\n");
};

// Utility function to clean up the truncated "chars" message at the end of article content
const cleanArticleContent = (content) => {
  const charPattern = /\[\+\d+ chars\]/g; // Matches patterns like [+1234 chars]
  return content.replace(charPattern, "").trim(); // Remove the pattern and trim extra spaces
};

// Function to scrape and save articles
const scrapeAndSaveArticles = async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      q: "disruption",
      from: new Date(new Date().setDate(new Date().getDate() - 7))
        .toISOString()
        .slice(0, 10),
      language: "en",
      sortBy: "publishedAt",
      pageSize: 10,
    });

    if (response.status === "ok" && response.articles.length > 0) {
      const articlesToSave = [];

      for (const article of response.articles) {
        // Use utility function to extract the first two paragraphs and clean up content
        let text = article.content
          ? extractFirstTwoParagraphs(article.content)
          : article.description || article.title || "No Content Available";

        // Clean up the "chars" truncation pattern if present
        text = cleanArticleContent(text);

        const articleExists = await checkArticleExists(article.url);
        if (articleExists) {
          console.log(`Article "${article.title}" already exists. Skipping...`);
          continue;
        }

        const disruptionType = await detectDisruptionType(text);
        const { severity, location } = await detectSeverityAndLocation(text);
        const { lat, lng } = await getLatLngFromLocation(location);

        const articleData = {
          title: article.title || "No Title",
          text: text, // Save the cleaned content here
          location: location,
          disruptionType: disruptionType,
          severity: severity,
          sourceName: article.source.name || "Unknown",
          publishedDate: article.publishedAt || new Date(),
          url: article.url,
          imageUrl: article.urlToImage || "No Image",
          lat: lat,
          lng: lng,
        };

        articlesToSave.push(articleData);
      }

      // Save all articles to the database
      await saveArticlesToDatabase(articlesToSave);
      res
        .status(200)
        .json({ message: "Articles scraped and saved successfully." });
    } else {
      res.status(400).json({ message: "No articles found." });
    }
  } catch (error) {
    console.error("Error scraping articles:", error.message);
    res.status(500).json({ message: "Error scraping articles." });
  }
};

// [FUNCTIONAL] Function to get all articles from the database
const getAllArticles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE isdeleted = false ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting articles:", error.message);
    res.status(500).json({ message: "Error getting articles." });
  }
};

// [FUNCTIONAL] Function to get all articles from the database with optional filtering
const getFilteredArticles = async (req, res) => {
  const disruptionType = req.query.disruptionType;

  try {
    let query;
    let values = [];

    // If disruptionType is provided, filter by it
    if (disruptionType) {
      query =
        "SELECT * FROM articles WHERE disruptiontype = $1 AND isdeleted = false ORDER BY created_at DESC";
      values = [disruptionType];
    } else {
      // If no filtering, just get all articles
      query =
        "SELECT * FROM articles WHERE isdeleted = false ORDER BY created_at DESC";
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting articles:", error.message);
    res.status(500).json({ message: "Error getting articles." });
  }
};

// [FUNCTIONAL] Function to get a single article by ID
const getArticleById = async (req, res) => {
  const articleId = req.params.id;

  try {
    const result = await pool.query(
      "SELECT * FROM articles WHERE id = $1 AND isdeleted = false",
      [articleId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Article not found." });
    }
  } catch (error) {
    console.error("Error getting article:", error.message);
    res.status(500).json({ message: "Error getting article." });
  }
};

// Function to soft delete an article
const deleteArticle = async (req, res) => {
  const articleId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE articles SET isdeleted = true WHERE id = $1",
      [articleId]
    );
    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Article ${articleId} deleted successfully.` });
    } else {
      res.status(404).json({ message: "Article not found." });
    }
  } catch (error) {
    console.error("Error deleting article:", error.message);
    res.status(500).json({ message: "Error deleting article." });
  }
};

// articlesController.js

const getArticlesByPreferences = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get user preferences for location from the database
    const userPreferences = await pool.query(
      `SELECT cities.id FROM userpreferences 
       JOIN cities ON userpreferences.preferredlocation = cities.id
       WHERE userpreferences.userid = $1 AND userpreferences.isdeleted = false`,
      [userId]
    );

    if (userPreferences.rows.length === 0) {
      return res.status(404).json({ message: "No preferences found for this user" });
    }

    // Get the preferred locations (array of city names)
    const preferredLocations = userPreferences.rows.map(row => row.location);

    // Fetch articles that match the user's preferred locations
    const articlesResult = await pool.query(
      `SELECT * FROM articles WHERE location = ANY($1::text[]) AND isdeleted = false`,
      [preferredLocations]
    );

    res.status(200).json(articlesResult.rows);
  } catch (error) {
    console.error("Error fetching filtered articles:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  scrapeAndSaveArticles,
  getAllArticles,
  getFilteredArticles,
  getArticlesByPreferences,
  getArticleById,
  deleteArticle,
};
