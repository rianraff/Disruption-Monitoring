import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "../css/partials/Sidebar.css";

function Sidebar({ isCollapsed, activePage }) {
  return (
    <div className={`sidebar-container ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <img src="/img/logo.png" alt="Logo" className="logo" />
      </div>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link as={NavLink} to="/homepage" eventKey="/homepage">
            Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/preferences"
            eventKey="/preferences"
            active={activePage === "ArticlePreferences"}
          >
            Article Preferences
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/analytics" eventKey="/analytics">
            Analytics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/messages" eventKey="/messages">
            Messages
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="/settings" eventKey="/settings">
            Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default Sidebar;
