import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../css/pages/PreferencePage.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ArticlePreferences = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const locationsData = await axios.get(`${API_BASE_URL}/available-locations`);
        setLocations(locationsData.data);

        const disruptionTypesData = await axios.get(`${API_BASE_URL}/available-disruption-types`);
        setDisruptionTypes(disruptionTypesData.data);

        const severityLevelsData = await axios.get(`${API_BASE_URL}/available-severity-levels`);
        setSeverityLevels(severityLevelsData.data);

        const suppliersData = await axios.get(`${API_BASE_URL}/available-suppliers`);
        setSuppliers(suppliersData.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };
    fetchDropdownData();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const filterCriteria = {
      fromDate: fromDate?.toISOString().split("T")[0],
      toDate: toDate?.toISOString().split("T")[0],
      locations: selectedLocations,
      radius,
      disruptionTypes: selectedDisruptionTypes,
      severityLevels: selectedSeverityLevels,
      suppliers: selectedSuppliers,
    };
    navigate('/filtered-articles', { state: filterCriteria });
  };

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
            <Row className="article-preferences-container">
              <Col xl={3} lg={4} md={12} xs={12}>
                <h4 className="preferences-title">Article Preferences</h4>
                <p className="preferences-description">
                  Search articles based on your preferred filters.
                </p>
              </Col>
              <Col xl={9} lg={8} md={12} xs={12}>
                <Card className="preferences-card">
                  <Card.Body>
                    <h4 className="filter-title">Filter Settings</h4>
                    <Form onSubmit={handleFilterSubmit}>
                      {/* Date Range Filter */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Publication Date Range</Form.Label>
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                            placeholderText="From Date"
                            className="form-control date-picker"
                          />
                        </Col>
                        <Col md={4}>
                          <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            placeholderText="To Date"
                            className="form-control date-picker"
                          />
                        </Col>
                      </Row>

                      {/* Remaining Filters */}
                      {/* (Copy-paste bagian filter yang sama seperti di atas) */}

                      <Row className="justify-content-end">
                        <Col md={8} className="text-right">
                          <Button type="submit" className="apply-filters-btn">
                            Apply Filters
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArticlePreferences;
