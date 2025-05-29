import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { FaWallet, FaEthereum } from "react-icons/fa";
import { SiCoinbase } from "react-icons/si";
import { IoWallet } from "react-icons/io5";

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const account = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isWalletExpanded, setIsWalletExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    disconnect();
    navigate("/login");
  };

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const getWalletIcon = (walletName: string) => {
    switch (walletName.toLowerCase()) {
      case "metamask":
        return <FaEthereum className="w-5 h-5" />;
      case "coinbase wallet":
        return <SiCoinbase className="w-5 h-5" />;
      default:
        return <IoWallet className="w-5 h-5" />;
    }
  };

  const renderWalletConnection = () => {
    if (account.status === "connected" && account.addresses?.[0]) {
      const address = account.addresses[0];
      const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

      return (
        <div className="wallet-connected">
          <span className="wallet-address">
            {shortAddress}
          </span>
          <button
            onClick={handleLogout}
            className="wallet-disconnect"
          >
            <IoWallet className="wallet-icon" />
            Disconnect
          </button>
        </div>
      );
    }

    return (
      <div className="wallet-container">
        <button
          onClick={() => setIsWalletExpanded(!isWalletExpanded)}
          className="wallet-connect-btn"
        >
          <FaWallet className="wallet-icon" />
          <span>Connect Wallet</span>
        </button>

        {isWalletExpanded && (
          <div className="wallet-dropdown">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsWalletExpanded(false);
                }}
                className="wallet-option"
              >
                {getWalletIcon(connector.name)}
                <span>{connector.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span className="logo-text">EventTix</span>
      </div>
      <ul>
        <li>
          <a href="/" onClick={handleNavigation("/")}>
            Home
          </a>
        </li>
        {isAuthenticated && (
          <li>
            <a href="/create-event" onClick={handleNavigation("/create-event")}>
              Create Event
            </a>
          </li>
        )}
        {isAuthenticated && (
          <li>
            <a href="/my-tickets" onClick={handleNavigation("/my-tickets")}>
              My Tickets
            </a>
          </li>
        )}
        <li>
          <a href="/about" onClick={handleNavigation("/about")}>
            About Us
          </a>
        </li>
        <li className="wallet-menu-item">{renderWalletConnection()}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
