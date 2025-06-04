import React from "react";
import Head from "next/head";
import Navbar from "./Navbar";

const AboutUsPage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>About Us - EthTick</title>
        <meta name="description" content="Learn about our Event Ticketing System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container">
        <h2>About Us</h2>
        <p>
          Welcome to our Event Ticketing System! We aim to provide a seamless
          experience for discovering, creating, and managing event tickets.
        </p>
        <p>
          This platform is designed with a minimalist black and white aesthetic
          for clarity and ease of use.
        </p>
        <p>
          Our mission is to connect event organizers with attendees in an
          efficient and user-friendly manner.
        </p>
        <p>Thank you for using our system!</p>
      </main>
    </div>
  );
};

export default AboutUsPage;
