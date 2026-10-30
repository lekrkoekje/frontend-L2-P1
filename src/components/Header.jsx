import { useState } from 'react';
import { Link } from 'react-router-dom';

import Navigation from './Navigation';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <img className="logo me-2" src="/favicon.svg" alt="Logo" />
          Pokemon Team Manager
        </Link>

        <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={menuOpen ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'} onClick={() => setMenuOpen(false)}>
          <Navigation />
        </div>
      </div>
    </nav>
  );
}

export default Header;
