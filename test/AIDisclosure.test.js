const { expect } = require("chai");
const { ethers } = require("hardhat");
const crypto = require("crypto");

function hashContent(content) {
  return "0x" + crypto.createHash("sha256").update(content).digest("hex");
}
// 5 test cases

describe("AIDisclosure", function () {
  let contract, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const AIDisclosure = await ethers.getContractFactory("AIDisclosure");
    contract = await AIDisclosure.deploy();
  });

  it("should record a disclosure and emit event", async function () {
    const hash = hashContent("Hello, this is AI-generated content.");
    const tx = await contract.recordDisclosure(hash, true, "Claude", "fully generated", "");
    const receipt = await tx.wait();
    expect(receipt).to.exist;
  });

  it("should retrieve a recorded disclosure correctly", async function () {
    const hash = hashContent("Test article content");
    await contract.recordDisclosure(hash, true, "ChatGPT", "assisted", "ipfs://xyz");
    const result = await contract.verifyDisclosure(hash);
    expect(result.exists).to.be.true;
    expect(result.aiUsed).to.be.true;
    expect(result.aiToolName).to.equal("ChatGPT");
    expect(result.aiUsageType).to.equal("assisted");
    expect(result.creator).to.equal(owner.address);
  });

  it("should return false for unknown content hash", async function () {
    const fakeHash = hashContent("content that was never submitted");
    const result = await contract.verifyDisclosure(fakeHash);
    expect(result.exists).to.be.false;
  });

  it("should reject duplicate disclosures for the same content", async function () {
    const hash = hashContent("Same content");
    await contract.recordDisclosure(hash, false, "", "", "");
    await expect(
      contract.recordDisclosure(hash, false, "", "", "")
    ).to.be.revertedWith("Disclosure already recorded for this content");
  });

  it("should track creator history", async function () {
    const h1 = hashContent("Article 1");
    const h2 = hashContent("Article 2");
    await contract.connect(addr1).recordDisclosure(h1, true, "Midjourney", "image generation", "");
    await contract.connect(addr1).recordDisclosure(h2, false, "", "", "");
    const history = await contract.getCreatorHistory(addr1.address);
    expect(history.length).to.equal(2);
  });
});
