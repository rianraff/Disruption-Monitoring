import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import AnalyticsCharts from '../components/AnalyticsCharts';
import ArticleDetail from '../components/ArticleDetail';
import ArticlesCard from '../components/ArticlesCard';
import MapCard from '../components/MapCard';
import '../css/pages/HomePage.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userName, setUserName] = useState('User');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Get API Base URL from environment variables
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const fetchData = async () => {
      if (token && userId) {
        try {
          // Fetch user data
          const userResponse = await axios.get(
            `${BASE_URL}/users/${userId}`, // Use BASE_URL from .env
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserName(userResponse.data.name);

          // Fetch articles data
          const articlesResponse = await axios.get(
            `${BASE_URL}/articles`, // Use BASE_URL from .env
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setFilteredArticles(articlesResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [BASE_URL]); // Add BASE_URL to dependency array to ensure it updates if it changes

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <div id="db-wrapper" className={`${sidebarOpen ? '' : 'toggled'}`}>
      <div className="navbar-vertical">
        <Sidebar isCollapsed={!sidebarOpen} />
      </div>

      <div id="page-content">
        <div className="header">
          <NavbarTop toggleSidebar={toggleSidebar} />
        </div>

        <div className="content-area">
          <main className="main-content">
            <div className="welcome-section">
              <h1 className="heading">Hello, {userName}</h1>
            </div>

            <div className="cards-layout">
              {/* Articles Card */}
              <ArticlesCard 
                articles={filteredArticles}
                onArticleClick={handleArticleClick} 
              />

              <Row className="mt-4">
                <Col lg={6}>
                  <Card className="equal-height-card mb-4">
                    <Card.Body>
                      <h2 className="section-title">Disruption Monitoring</h2>
                      <MapCard />
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6}>
                  <Card className="equal-height-card mb-4">
                    <Card.Body>
                      <h2 className="section-title">Analytics</h2>
                      <AnalyticsCharts />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </main>
        </div>

        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

export default HomePage;
