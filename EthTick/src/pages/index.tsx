"use client";

import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "../components/Navbar";
import EventListPage from "../components/Events/EventList"; // Import the EventListPage component

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>EthTick - Event Ticketing</title>
        <meta
          name="description"
          content="Decentralized Event Ticketing Platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main>
        {" "}
        {/* Removed className="container" as EventListPage has its own */}
        <EventListPage />
      </main>

      {/* Footer can be part of a Layout component or kept here if simple */}
      {/* For now, let's keep it simple. The prototype's globals.css doesn't have a specific .footer style like Home.module.css did */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px 0",
          borderTop: "1px solid #333",
          marginTop: "30px",
        }}
      >
        <a
          href="https://rainbow.me"
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: "#f9cb28" }}
        >
          Powered by EthTick
        </a>
      </footer>
    </div>
  );
};

export default Home;
