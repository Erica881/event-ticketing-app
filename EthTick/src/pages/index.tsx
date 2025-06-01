"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Navbar from "../components/Navbar";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Event Ticketing</title>
        <meta name="description" content="Event Ticketing System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="container">
        <div className="connect-wallet-container">
          <h1>Welcome to Event Ticketing</h1>
          <p>Connect your wallet to get started</p>
          <ConnectButton />

          <div className={styles.grid}>
            <a className={styles.card} href="https://rainbowkit.com">
              <h2>RainbowKit Documentation &rarr;</h2>
              <p>Learn how to customize your wallet connection flow.</p>
            </a>

            <a className={styles.card} href="https://wagmi.sh">
              <h2>wagmi Documentation &rarr;</h2>
              <p>Learn how to interact with Ethereum.</p>
            </a>

            <a
              className={styles.card}
              href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
            >
              <h2>RainbowKit Examples &rarr;</h2>
              <p>Discover boilerplate example RainbowKit projects.</p>
            </a>

            <a className={styles.card} href="https://nextjs.org/docs">
              <h2>Next.js Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a
              className={styles.card}
              href="https://github.com/vercel/next.js/tree/canary/examples"
            >
              <h2>Next.js Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              className={styles.card}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          footer
        </a>
      </footer>
    </div>
  );
};

export default Home;
