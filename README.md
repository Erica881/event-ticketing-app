# 🎫 EthTic: Decentralized NFT Event Ticketing & Smart Contract Escrow

![Solidity](https://img.shields.io/badge/Solidity-0.8.9-363636?style=for-the-badge&logo=solidity)
![Scroll L2](https://img.shields.io/badge/Scroll_Sepolia-zkEVM_L2-10b981?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-React-000000?style=for-the-badge&logo=next.js)
![Wagmi](https://img.shields.io/badge/Wagmi-Viem-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**EthTic** is a Web3 decentralized application (dApp) built on the **Scroll Sepolia Layer-2 Testnet** that eliminates ticket counterfeiting, scalping, and custodial refund risks. By minting event tickets as **ERC-721 Non-Fungible Tokens (NFTs)** and locking ticket proceeds inside an **autonomous Smart Contract Escrow Vault**, EthTic guarantees verifiable ticket ownership and instant, self-service user refunds if an event is cancelled.

---

## 🚨 Problem Statement

Traditional centralized ticketing platforms suffer from three critical vulnerabilities:
1. **Counterfeit & Duplicate Tickets:** Screenshot fraud and forged QR codes deceive secondary buyers.
2. **Opaque Scalping:** Bots mass-purchase inventory and resell tickets at extreme markups.
3. **Custodial Refund Delays:** When events are postponed or cancelled, ticket proceeds are often already spent or held by third-party intermediaries, leaving buyers waiting months for refunds.

---

## 🛡️ The EthTic Solution

* **🎟️ ERC-721 NFT Provenance:** Every ticket is a unique cryptographic token minted on-chain, providing immutable proof of ownership and strict supply enforcement.
* **🔒 State-Gated Smart Contract Escrow:** Ticket payments (ETH) are **locked inside the smart contract** rather than transferred immediately to the organizer.
* **🔄 Autonomous Self-Service Refunds:** If an organizer cancels an event on-chain, the escrow state unlocks for buyers—allowing attendees to independently claim **100% of their locked ETH** directly via MetaMask without middleman approval.
* **⚡ Layer-2 zkEVM Scaling (Scroll):** Deployed on the **Scroll Sepolia Testnet**, compressing gas fees by orders of magnitude compared to Ethereum Mainnet (L1) while preserving full EVM bytecode equivalence.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Smart Contracts** | `Solidity v0.8.9`, `ERC-721`, `Remix IDE` | On-chain NFT ticket minting, modifier access control, and escrow state machine. |
| **Blockchain Network** | `Scroll Sepolia Testnet (L2 zkEVM)` | Low-gas, high-throughput Layer-2 rollup execution. |
| **Frontend UI** | `Next.js`, `React`, `Tailwind CSS` | Responsive dashboard for browsing events, minting tickets, and managing refunds. |
| **Web3 Integration** | `Wagmi`, `Viem`, `RainbowKit`, `MetaMask` | Wallet connection, network switching, RPC state reads, and transaction signing. |

---

## 🔄 Core Smart Contract Workflows

### 1. Event Creation & Ticket Minting
1. **Organizer** initializes an event on-chain with parameters: `eventName`, `ticketPrice`, `maxSupply`, and `eventTimestamp`.
2. **Attendee** connects their MetaMask wallet via RainbowKit and purchases a ticket.
3. The contract verifies supply limits, mints an **ERC-721 NFT** to the buyer's address, and locks the paid ETH inside the contract's escrow balance.

### 2. Event Completion (Organizer Payout)
* Once the event concludes successfully (`Status == Completed`), the contract unlocks the payout gate.
* Only the verified `eventOrganizer` address can invoke the withdrawal function to receive the accumulated ticket sales.

### 3. Event Cancellation (Self-Service Buyer Refund)
* If the organizer cancels the event (`Status == Cancelled`), organizer withdrawals are permanently blocked.
* Ticket holders call the `claimRefund()` function directly from the dApp, invalidating their ticket and transferring their locked ETH straight back to their wallet.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* **Node.js** (v18+ recommended)
* **MetaMask** browser extension configured with the **Scroll Sepolia Testnet**
* Testnet ETH from a Scroll Sepolia Faucet

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ethtic-dapp.git
   cd ethtic-dapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your deployed contract address and WalletConnect Project ID:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedScrollContractAddress
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the dApp.

---

## 📁 Repository Structure

```text
ethtic-dapp/
├── contracts/               # Solidity 0.8.9 smart contracts (EthTic & ERC-721 logic)
├── src/
│   ├── components/          # UI cards, Navbar, and RainbowKit ConnectButton
│   ├── pages/               # Next.js routes (Marketplace, My Tickets, Organizer Portal)
│   ├── utils/               # Contract ABI, Wagmi/Viem client configurations
│   └── styles/              # Tailwind CSS styling
├── public/                  # Static assets and demo media
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

---

## 📜 Research & Publication Context
Developed as part of an **IEEE Research Study** exploring decentralized trust mechanisms, Layer-2 zkEVM gas efficiency, and automated consumer protection in Web3 ticketing ecosystems.
