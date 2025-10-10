import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Movie App</h1>
        <div className="navbar-links">
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-link active" : "nav-link"}
          >
            List View
          </Link>
          <Link
            to="/gallery"
            className={location.pathname === "/gallery" ? "nav-link active" : "nav-link"}
          >
            Gallery View
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

