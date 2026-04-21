# Blockchain Based AI Content Disclosure System

## Problem Statement
Today AI tools like ChatGPT, Claude, and Midjourney are widely used to create 
digital content. But there is no reliable way to know if AI was used. Existing 
disclosures can be edited or deleted. AI detection tools are inaccurate and can 
wrongly accuse innocent people. So there is no trust or accountability in digital 
content creation today.

## Solution
Instead of detecting AI, we let creators voluntarily declare how they used AI 
and store that declaration permanently on the Ethereum blockchain where it cannot 
be changed or deleted by anyone including us.

## How it Works
1. Creator pastes their content into the website
2. System generates a SHA-256 hash of the content
3. Creator declares whether AI was used and which tool they used
4. Declaration is stored permanently on the blockchain
5. Anyone can verify it anytime by entering the content hash

## Features
- Record AI usage disclosures permanently on blockchain
- Verify any disclosure by entering content hash
- View complete history of disclosures by any creator
- SHA-256 hashing ensures content privacy
- Immutable records that cannot be edited or deleted
- Publicly verifiable by anyone in the world

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.20 |
| Blockchain | Ethereum (Hardhat local node) |
| Backend | Node.js + Express + Ethers.js |
| Frontend | React + Vite |
| Testing | Mocha + Chai |
| Hashing | SHA-256 (Node.js crypto) |

## Project Structure
ai-disclosure-blockchain/
│
├── contracts/
│   └── AIDisclosure.sol       # Smart contract
│
├── scripts/
│   └── deploy.js              # Deployment script
│
├── test/
│   └── AIDisclosure.test.js   # Smart contract tests
│
├── backend/
│   └── server.js              # Node.js REST API
│
├── frontend/
│   └── src/
│       └── App.jsx            # React frontend
│
├── hardhat.config.js          # Blockchain configuration
└── deployment.json            # Generated after deploy

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/disclose | Record a new AI disclosure |
| GET | /api/verify/:hash | Verify a disclosure by content hash |
| POST | /api/hash | Get SHA-256 hash of content |
| GET | /api/history/:address | Get all disclosures by a wallet address |

## Smart Contract Functions

| Function | Description |
|---|---|
| recordDisclosure() | Stores AI disclosure permanently on blockchain |
| verifyDisclosure() | Retrieves disclosure details by content hash |
| getCreatorHistory() | Returns all content hashes by a creator address |

## How to Run

### Prerequisites
- Node.js v22 or higher
- WSL (Windows Subsystem for Linux) or Linux/Mac terminal

### Step 1 - Clone the repository
git clone https://github.com/yourusername/ai-disclosure-blockchain.git
cd ai-disclosure-blockchain

### Step 2 - Install dependencies
npm install
cd frontend && npm install
cd ..

### Step 3 - Start the blockchain node (Terminal 1)
npx hardhat node

### Step 4 - Deploy the smart contract (Terminal 2)
npx hardhat run scripts/deploy.js --network localhost

### Step 5 - Start the backend (Terminal 3)
node backend/server.js

### Step 6 - Start the frontend (Terminal 4)
cd frontend
npm run dev

### Step 7 - Open browser
http://localhost:5173

## Running Tests
npx hardhat test

### Test Results
AIDisclosure
✔ should record a disclosure and emit event
✔ should retrieve a recorded disclosure correctly
✔ should return false for unknown content hash
✔ should reject duplicate disclosures for the same content
✔ should track creator history
5 passing

## Why Blockchain

| Problem | Our Solution |
|---|---|
| Disclosures can be deleted | Blockchain records are permanent |
| Disclosures can be edited | Blockchain records are immutable |
| No way to verify | Anyone can query the blockchain |
| Detection tools are inaccurate | We record declarations not detections |
| False accusations | No detection means no false accusations |

## Default Test Wallet
When running locally the default Hardhat wallet address is:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Use this address in the Creator History tab to see all recorded disclosures.

## Future Improvements
- Deploy to Sepolia public testnet
- MetaMask wallet integration for real user identities
- IPFS storage for actual content
- Browser extension for automatic verification
- Mobile application

## Team
- Project: Blockchain Based AI Content Disclosure System
- Technology: Ethereum Blockchain + React + Node.js

## License
MIT License
