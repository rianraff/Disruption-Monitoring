import React, { useState } from "react";
import { Button, Dropdown, Form, Navbar } from "react-bootstrap";
import { Menu } from "react-feather";
import { useNavigate } from 'react-router-dom';
import "../css/partials/NavbarTop.css";

const NavbarTop = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/filtered-articles?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Navbar className="navbar-top">
      <div className="navbar-left">
        <Button variant="link" className="menu-button" onClick={toggleSidebar}>
          <Menu size="24px" color="#0059ff" />
        </Button>
        <Form className="search-form" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </Form>
      </div>
      <div className="navbar-right">
        <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
          <Dropdown.Toggle as="div" id="dropdown-basic" className="profile-icon-container no-arrow">
            <img src="/img/profile-icon.png" alt="Profile" className="profile-icon" />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className="profile-dropdown-menu">
            <Dropdown.Item href="/profile">View Profile</Dropdown.Item>
            <Dropdown.Item href="/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="/logout" className="logout-item">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default NavbarTop;
