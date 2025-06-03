import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
// import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">EthTick</Link>
      </div>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {/* Assuming authenticated routes might be added later, similar to prototype */}
        {/* For now, keeping it simple based on existing EthTick structure */}
        <li>
          <Link href="/create-event">Create Event</Link>
        </li>
        <li>
          <Link href="/my-tickets">My Tickets</Link>
        </li>
        <li>
          <Link href="/about">About Us</Link>
        </li>
        <li className="wallet-menu-item">
          {" "}
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
