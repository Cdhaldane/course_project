import React from 'react';
import { Link } from 'react-router-dom';
import './styles/App.css';

function Header() {
  return (
    <header className="Header">
      <nav className="Header-nav">
        <Link className="Header-brand" to="/">Vortex Hotels</Link>
        <ul className="Header-list">
          {/* <li className="Header-item">
            <Link className="Header-link" to="/booking">My Booking</Link>
          </li> */}
          <li className="Header-item">
            <Link className="Header-link" to="/tables">Tables</Link>
          </li>
          {/* <li className="Header-item">
            <Link className="Header-link" to="/contact">Contact Us</Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}

export default Header;