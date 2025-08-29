import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Results', path: '/results' },
  { label: 'Files', path: '/files' },
];

function Navbar({ loggedInUser, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <Link to="/" className="company-name">inSightFull</Link>
      </div>
      <div className="navbar-center">
        <div className={`menu-items ${menuOpen ? 'open' : ''}`}>
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-btn ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="navbar-right">
        {loggedInUser ? (
          <>
            <span style={{ color: 'white', marginRight: '1rem', fontWeight: '500' }}>Hi, {loggedInUser}</span>
            <button className="login-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>Login</button>
        )}
        <button className="hamburger" onClick={handleMenuToggle} aria-label="Toggle menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
