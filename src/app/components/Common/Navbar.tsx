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
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-600">
            {shortAddress}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center gap-2"
          >
            <IoWallet className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      );
    }

    return (
      // <div className="relative">
      //   <button
      //     onClick={() => setIsWalletExpanded(!isWalletExpanded)}
      //     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm flex items-center gap-2"
      //   >
      //     <FaWallet className="w-4 h-4 flex items-center gap-2 " />
      //     Connect Wallet
      //   </button>
      <div className="relative">
        <button
          onClick={() => setIsWalletExpanded(!isWalletExpanded)}
          className="bg-blue-500 text-white px-3 py-1 rounded gap-3 hover:bg-blue-600 text-sm flex items-center space-x-2"
        >
          <FaWallet className="w-4 h-4 m-8" />
          <span>Connect Wallet</span>
        </button>

        {isWalletExpanded && (
          <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setIsWalletExpanded(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
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
        <li>{renderWalletConnection()}</li>
      </ul>
    </nav>
  );
};

export default Navbar;
