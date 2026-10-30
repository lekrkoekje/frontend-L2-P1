import { NavLink } from 'react-router-dom';

function Navigation() {
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
