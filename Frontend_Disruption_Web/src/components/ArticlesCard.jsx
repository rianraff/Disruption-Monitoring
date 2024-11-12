import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/components/ArticlesCard.css";

const API_BASE_URL = "http://localhost:5001/api";

const ArticlesCard = ({ onArticleClick }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/articles`);
        setArticles(response.data || []);
      } catch (error) {
        console.error("Failed to load articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/articles/scrape`);
      const updatedArticles = await axios.get(`${API_BASE_URL}/articles`);
      setArticles(updatedArticles.data || []);
    } catch (error) {
      console.error("Failed to refresh articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="articles-card">
      <div className="articles-header">
        <h2 className="articles-title">Latest Articles</h2>
        <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      
      <div className="table-wrapper">
        <table className="articles-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentArticles.map((article) => (
              <tr key={article.id} onClick={() => onArticleClick(article)}>
                <td>{article.title}</td>
                <td>{new Date(article.publisheddate).toLocaleDateString()}</td>
                <td>{article.location || "Unknown"}</td>
                <td>{article.disruptiontype}</td>
                <td>
                  <span className={`badge ${article.severity.toLowerCase()}`}>
                    {article.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArticlesCard;
