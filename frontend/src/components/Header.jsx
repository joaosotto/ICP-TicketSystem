import React, { useState, useEffect } from 'react';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleNavClick = (tabName) => {
    document.querySelector(`.tab[data-tab="${tabName}"]`)?.click();
    setMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="logo">
        <div className="logo-icon">
          <div className="logo-circle"></div>
          <div className="logo-pulse"></div>
        </div>
        <h1 className="logo-text">Quantum Tickets</h1>
      </div>
      
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        <a 
          href="#tickets" 
          className="nav-link" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('tickets');
          }}
        >
          <span className="nav-icon">🎟️</span>
          <span className="nav-text">Explore</span>
        </a>
        <a 
          href="#mytickets" 
          className="nav-link"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('mytickets');
          }}
        >
          <span className="nav-icon">🎭</span>
          <span className="nav-text">My Collection</span>
        </a>
      </nav>
    </header>
  );
}

export default Header;
