import { NavLink } from 'react-router-dom';

// De links naar alle pagina's in de menubalk.
function Navigation() {
  // NavLink maakt de link van de pagina waar je bent wit, end zorgt dat Home alleen op de homepagina wit is.
  return (
    <div className="navbar-nav ms-auto">
      <NavLink className="nav-link" to="/" end>
        Home
      </NavLink>

      <NavLink className="nav-link" to="/list">
        Pokemon
      </NavLink>

      <NavLink className="nav-link" to="/teams">
        Teams
      </NavLink>

      <NavLink className="nav-link" to="/favorieten">
        Favorieten
      </NavLink>
    </div>
  );
}

export default Navigation;
