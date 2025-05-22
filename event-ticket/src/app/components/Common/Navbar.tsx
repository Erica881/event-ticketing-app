import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogout = () => {
    logout();
    disconnect();
    navigate("/login");
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const renderWalletConnection = () => {
    if (account.status === 'connected' && account.addresses?.[0]) {
      const address = account.addresses[0];
      const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
      
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600">{shortAddress}</span>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Disconnect
          </button>
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Connect {connector.name}
          </button>
        ))}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <a href="/" onClick={handleNavigation("/")}>Home</a>
        </li>
        {isAuthenticated && (
          <li>
            <a href="/create-event" onClick={handleNavigation("/create-event")}>Create Event</a>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <a href="/my-tickets" onClick={handleNavigation("/my-tickets")}>My Tickets</a>
          </li>
        )}
        <li>
          <a href="/about" onClick={handleNavigation("/about")}>About Us</a>
        </li>
        <li>
          {renderWalletConnection()}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
