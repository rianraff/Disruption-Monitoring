import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Image, Table } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import '../css/pages/FilteredArticles.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

const API_BASE_URL_FILTER = "http://localhost:5001/api/preferences/filter-articles";
const API_BASE_URL_SEARCH = "http://localhost:5001/api/preferences/search";

const FilteredArticles = () => {
  const { state: filterCriteria } = useLocation(); // Used for filters from ArticlePreferences
  const [searchParams] = useSearchParams(); // Used for URL parameters like query
  const [articles, setArticles] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const query = searchParams.get("query"); // Retrieve "query" from the URL

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        let response;

        if (query) {
          // If a search query exists, use the search API
          response = await axios.get(API_BASE_URL_SEARCH, {
            params: { query },
          });
        } else if (filterCriteria) {
          // If no query, fallback to filter criteria from ArticlePreferences
          response = await axios.get(API_BASE_URL_FILTER, {
            params: filterCriteria,
          });
        }

        if (response) {
          setArticles(response.data);
        } else {
          setArticles([]); // Reset if no valid response
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    // Run fetchArticles when `query` or `filterCriteria` changes
    fetchArticles();
  }, [query, filterCriteria]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                          <tr key={article.id}>
                            <td>
                              <Image src={article.imageurl} alt="Article Image" className="article-image" />
                            </td>
                            <td><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></td>
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
    </div>
  );
};

export default FilteredArticles;
