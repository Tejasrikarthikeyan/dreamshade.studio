import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.jpg" alt="dreamshade.studio Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ paddingTop: '0.25rem' }}>dreamshade.studio</span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/collection" className="nav-link" onClick={() => setIsOpen(false)}>Collection</Link>
          <Link to="/commission" className="nav-link" style={{ color: 'var(--accent)' }} onClick={() => setIsOpen(false)}>Custom Drawing</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
