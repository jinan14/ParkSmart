import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ParkSmart
      </Link>
      <div className="navbar-links">
        {user ? (
          <>
            <Link to="/profile">{user.fullName}</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
