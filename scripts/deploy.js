// Deploys the contract to blockchain


const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const AIDisclosure = await hre.ethers.getContractFactory("AIDisclosure");
  const contract = await AIDisclosure.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("AIDisclosure deployed to:", address);

  // Save ABI + address for the backend/frontend to use
  const artifact = await hre.artifacts.readArtifact("AIDisclosure");
  const deploymentInfo = {
    address,
    abi: artifact.abi,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment.json");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
