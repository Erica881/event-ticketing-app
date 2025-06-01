import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" className={router.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/create-event"
            className={router.pathname === "/create-event" ? "active" : ""}
          >
            Create Event
          </Link>
        </li>
        <li>
          <Link
            href="/my-tickets"
            className={router.pathname === "/my-tickets" ? "active" : ""}
          >
            My Tickets
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={router.pathname === "/about" ? "active" : ""}
          >
            About Us
          </Link>
        </li>
        <li className="connect-button">
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
