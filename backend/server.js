const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Load deployment info
const deployment = JSON.parse(fs.readFileSync("./deployment.json", "utf8"));

// This part connects to the blockchain
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Use the first Hardhat test account as the backend signer
// To write anything to the blockchain you need a wallet with a private key. This is like a digital signature that proves who is submitting the transaction.
const HARDHAT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const signer = new ethers.Wallet(HARDHAT_PRIVATE_KEY, provider);

const contract = new ethers.Contract(deployment.address, deployment.abi, signer);

/**
 * Helper: hash content to bytes32 using SHA-256
 */
function hashContent(content) {
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  return "0x" + hash;
}

/**
 * POST /api/disclose
 * User sends their content from the website
* Backend takes that content and generates a SHA-256 hash of it
* That hash along with AI details gets sent to the smart contract on the blockchain
* Blockchain stores it permanently
* Backend sends back the transaction hash and block number as confirmation
 */
app.post("/api/disclose", async (req, res) => {
  try {
    const { content, aiUsed, aiToolName, aiUsageType, metadataURI } = req.body;

    if (!content) return res.status(400).json({ error: "content is required" });

    const contentHash = hashContent(content);

    const tx = await contract.recordDisclosure(
      contentHash,
      aiUsed || false,
      aiToolName || "",
      aiUsageType || "",
      metadataURI || ""
    );

    const receipt = await tx.wait();

    res.json({
      success: true,
      contentHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      message: "Disclosure permanently recorded on blockchain"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/verify/:contentHash
 * User sends a content hash
* Backend asks the smart contract "does this hash exist?"
* If yes, returns all details — AI used, tool name, creator address, timestamp
* If no, returns "not found"
 */
app.get("/api/verify/:contentHash", async (req, res) => {
  try {
    const { contentHash } = req.params;
    const result = await contract.verifyDisclosure(contentHash);

    if (!result.exists) {
      return res.status(404).json({ found: false, message: "No disclosure found for this content" });
    }

    res.json({
      found: true,
      contentHash,
      aiUsed: result.aiUsed,
      aiToolName: result.aiToolName,
      aiUsageType: result.aiUsageType,
      creator: result.creator,
      timestamp: Number(result.timestamp),
      timestampReadable: new Date(Number(result.timestamp) * 1000).toISOString(),
      metadataURI: result.metadataURI
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/hash
 * User sends content
* Backend just returns the SHA-256 hash of it
* Useful for frontend to show the hash before recording
 */
app.post("/api/hash", (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "content is required" });
  res.json({ contentHash: hashContent(content) });
});

/**
 * GET /api/history/:address
 * Takes a wallet address
* Returns all content hashes ever submitted by that address
* Shows the full history of a creator's disclosures
 */
app.get("/api/history/:address", async (req, res) => {
  try {
    const hashes = await contract.getCreatorHistory(req.params.address);
    res.json({ address: req.params.address, disclosures: hashes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`AI Disclosure API running on http://localhost:${PORT}`);
  console.log(`Contract address: ${deployment.address}`);
});
