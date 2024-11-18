import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Image, Table } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import ArticleDetail from '../components/ArticleDetail';
import '../css/pages/FilteredArticles.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

// Ambil base URL API dari environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FilteredArticles = () => {
  const { state: filterCriteria } = useLocation();
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null); // Untuk artikel yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk status modal
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const query = searchParams.get("query");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let response;

        if (query) {
          response = await axios.get(`${API_BASE_URL}/preferences/search`, { params: { query } });
        } else if (filterCriteria) {
          response = await axios.get(`${API_BASE_URL}/preferences/filter-articles`, { params: filterCriteria });
        }

        setArticles(response ? response.data : []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, [query, filterCriteria]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fungsi untuk membuka modal detail artikel
  const handleRowClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
  };

  return (
    <div id="db-wrapper" className={`${sidebarOpen ? '' : 'toggled'}`}>
      <div className="navbar-vertical">
        <Sidebar isCollapsed={!sidebarOpen} activePage="ArticlePreferences" />
      </div>

      <div id="page-content">
        <div className="header">
          <NavbarTop toggleSidebar={toggleSidebar} />
        </div>

        <div className="content-area">
          <main className="main-content">
            <div className="filtered-articles-container">
              <h4 className="page-title">Filtered Articles</h4>
              <Card className="articles-card">
                <Card.Body>
                  {articles.length > 0 ? (
                    <Table responsive bordered hover className="articles-table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Title</th>
                          <th>Published Date</th>
                          <th>Location</th>
                          <th>Disruption Type</th>
                          <th>Severity</th>
                          <th>Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articles.map((article) => (
                          <tr key={article.id} onClick={() => handleRowClick(article)} style={{ cursor: 'pointer' }}>
                            <td><Image src={article.imageurl} alt="Article" className="article-image" /></td>
                            <td>{article.title}</td>
                            <td>{new Date(article.publisheddate).toLocaleDateString()}</td>
                            <td>{article.location || "Unknown"}</td>
                            <td>{article.disruptiontype}</td>
                            <td>
                              <span className={`status-badge ${article.severity.toLowerCase()}`}>
                                {article.severity}
                              </span>
                            </td>
                            <td>{article.sourcename}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No articles found for the selected criteria.</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Modal menggunakan komponen ArticleDetail */}
      {selectedArticle && (
        <ArticleDetail article={selectedArticle} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default FilteredArticles;
