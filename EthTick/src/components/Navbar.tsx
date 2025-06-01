import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const router = useRouter();

  // Helper function to determine if a link is active, can be more sophisticated
  const isActive = (pathname: string) => router.pathname === pathname;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/" legacyBehavior>
          <a className="logo-text">EthTick</a>
        </Link>
      </div>
      <ul>
        <li>
          <Link href="/" legacyBehavior>
            <a className={isActive("/") ? "active" : ""}>Home</a>
          </Link>
        </li>
        {/* Assuming authenticated routes might be added later, similar to prototype */}
        {/* For now, keeping it simple based on existing EthTick structure */}
        <li>
          <Link href="/create-event" legacyBehavior>
            <a className={isActive("/create-event") ? "active" : ""}>
              Create Event
            </a>
          </Link>
        </li>
        <li>
          <Link href="/my-tickets" legacyBehavior>
            <a className={isActive("/my-tickets") ? "active" : ""}>
              My Tickets
            </a>
          </Link>
        </li>
        <li>
          <Link href="/about" legacyBehavior>
            <a className={isActive("/about") ? "active" : ""}>About Us</a>
          </Link>
        </li>
        <li className="wallet-menu-item"> {/* Use prototype's class for styling */}
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
