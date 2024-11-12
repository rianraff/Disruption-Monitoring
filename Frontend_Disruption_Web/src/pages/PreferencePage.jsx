import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../css/pages/PreferencePage.css';
import NavbarTop from '../partials/NavbarTop';
import Sidebar from '../partials/Sidebar';

const API_BASE_URL = "http://localhost:5001/api/preferences";

const ArticlePreferences = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [radius, setRadius] = useState('');
  const [disruptionTypes, setDisruptionTypes] = useState([]);
  const [selectedDisruptionTypes, setSelectedDisruptionTypes] = useState([]);
  const [severityLevels, setSeverityLevels] = useState([]);
  const [selectedSeverityLevels, setSelectedSeverityLevels] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
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

  const handleSelectAll = (setSelected, options) => {
    setSelected((prevSelected) =>
      prevSelected.length === options.length ? [] : options
    );
  };

  const handleCheckboxChange = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

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

                      {/* Location Filter with Dropdown */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Location</Form.Label>
                        </Col>
                        <Col md={8}>
                          <DropdownButton title="Select Locations" variant="outline-secondary" className="w-100">
                            <Dropdown.Item as="div" onClick={() => handleSelectAll(setSelectedLocations, locations)}>
                              <Form.Check
                                type="checkbox"
                                label="All"
                                checked={selectedLocations.length === locations.length}
                              />
                            </Dropdown.Item>
                            {locations.map((location) => (
                              <Dropdown.Item as="div" key={location}>
                                <Form.Check
                                  type="checkbox"
                                  label={location}
                                  checked={selectedLocations.includes(location)}
                                  onChange={() => handleCheckboxChange(location, selectedLocations, setSelectedLocations)}
                                />
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                          <div className="selected-items">
                            {selectedLocations.join(', ')}
                          </div>
                        </Col>
                      </Row>

                      {/* Radius Filter */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Radius (in km)</Form.Label>
                        </Col>
                        <Col md={8}>
                          <Form.Control
                            type="number"
                            placeholder="Enter radius"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                          />
                        </Col>
                      </Row>

                      {/* Disruption Types Filter with Dropdown */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Disruption Types</Form.Label>
                        </Col>
                        <Col md={8}>
                          <DropdownButton title="Select Disruption Types" variant="outline-secondary" className="w-100">
                            <Dropdown.Item as="div" onClick={() => handleSelectAll(setSelectedDisruptionTypes, disruptionTypes)}>
                              <Form.Check
                                type="checkbox"
                                label="All"
                                checked={selectedDisruptionTypes.length === disruptionTypes.length}
                              />
                            </Dropdown.Item>
                            {disruptionTypes.map((type) => (
                              <Dropdown.Item as="div" key={type}>
                                <Form.Check
                                  type="checkbox"
                                  label={type}
                                  checked={selectedDisruptionTypes.includes(type)}
                                  onChange={() => handleCheckboxChange(type, selectedDisruptionTypes, setSelectedDisruptionTypes)}
                                />
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                          <div className="selected-items">
                            {selectedDisruptionTypes.join(', ')}
                          </div>
                        </Col>
                      </Row>

                      {/* Severity Levels Filter with Dropdown */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Severity Levels</Form.Label>
                        </Col>
                        <Col md={8}>
                          <DropdownButton title="Select Severity Levels" variant="outline-secondary" className="w-100">
                            <Dropdown.Item as="div" onClick={() => handleSelectAll(setSelectedSeverityLevels, severityLevels)}>
                              <Form.Check
                                type="checkbox"
                                label="All"
                                checked={selectedSeverityLevels.length === severityLevels.length}
                              />
                            </Dropdown.Item>
                            {severityLevels.map((level) => (
                              <Dropdown.Item as="div" key={level}>
                                <Form.Check
                                  type="checkbox"
                                  label={level}
                                  checked={selectedSeverityLevels.includes(level)}
                                  onChange={() => handleCheckboxChange(level, selectedSeverityLevels, setSelectedSeverityLevels)}
                                />
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                          <div className="selected-items">
                            {selectedSeverityLevels.join(', ')}
                          </div>
                        </Col>
                      </Row>

                      {/* Suppliers Filter with Dropdown */}
                      <Row className="filter-row mb-4">
                        <Col md={3}>
                          <Form.Label>Suppliers</Form.Label>
                        </Col>
                        <Col md={8}>
                          <DropdownButton title="Select Suppliers" variant="outline-secondary" className="w-100">
                            <Dropdown.Item as="div" onClick={() => handleSelectAll(setSelectedSuppliers, suppliers)}>
                              <Form.Check
                                type="checkbox"
                                label="All"
                                checked={selectedSuppliers.length === suppliers.length}
                              />
                            </Dropdown.Item>
                            {suppliers.map((supplier) => (
                              <Dropdown.Item as="div" key={supplier}>
                                <Form.Check
                                  type="checkbox"
                                  label={supplier}
                                  checked={selectedSuppliers.includes(supplier)}
                                  onChange={() => handleCheckboxChange(supplier, selectedSuppliers, setSelectedSuppliers)}
                                />
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                          <div className="selected-items">
                            {selectedSuppliers.join(', ')}
                          </div>
                        </Col>
                      </Row>

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
