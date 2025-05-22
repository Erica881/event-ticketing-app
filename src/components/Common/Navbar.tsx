import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isAuthenticated && (
          <li>
            <Link to="/create-event">Create Event</Link>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <Link to="/my-tickets">My Tickets</Link>
          </li>
        )}
        <li>
          <Link to="/about">About Us</Link>
        </li>
        {isAuthenticated ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/login">Connect Wallet</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
