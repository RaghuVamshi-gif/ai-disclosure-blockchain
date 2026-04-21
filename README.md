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
