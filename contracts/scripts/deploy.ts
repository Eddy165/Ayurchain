import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy FarmerRegistry
  const FarmerRegistry = await ethers.getContractFactory("FarmerRegistry");
  const farmerRegistry = await FarmerRegistry.deploy(deployer.address);
  await farmerRegistry.waitForDeployment();
  const farmerRegistryAddress = await farmerRegistry.getAddress();
  console.log("FarmerRegistry deployed to:", farmerRegistryAddress);

  // Deploy BatchTracker
  const BatchTracker = await ethers.getContractFactory("BatchTracker");
  const batchTracker = await BatchTracker.deploy(deployer.address);
  await batchTracker.waitForDeployment();
  const batchTrackerAddress = await batchTracker.getAddress();
  console.log("BatchTracker deployed to:", batchTrackerAddress);

  // Deploy Certification
  const Certification = await ethers.getContractFactory("Certification");
  const certification = await Certification.deploy(deployer.address);
  await certification.waitForDeployment();
  const certificationAddress = await certification.getAddress();
  console.log("Certification deployed to:", certificationAddress);

  // Deploy OwnershipTransfer
  const OwnershipTransfer = await ethers.getContractFactory("OwnershipTransfer");
  const ownershipTransfer = await OwnershipTransfer.deploy(deployer.address);
  await ownershipTransfer.waitForDeployment();
  const ownershipTransferAddress = await ownershipTransfer.getAddress();
  console.log("OwnershipTransfer deployed to:", ownershipTransferAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("FarmerRegistry:", farmerRegistryAddress);
  console.log("BatchTracker:", batchTrackerAddress);
  console.log("Certification:", certificationAddress);
  console.log("OwnershipTransfer:", ownershipTransferAddress);
  
  console.log("\n=== Environment Variables ===");
  console.log(`FARMER_REGISTRY_ADDRESS=${farmerRegistryAddress}`);
  console.log(`BATCH_TRACKER_ADDRESS=${batchTrackerAddress}`);
  console.log(`CERTIFICATION_ADDRESS=${certificationAddress}`);
  console.log(`OWNERSHIP_TRANSFER_ADDRESS=${ownershipTransferAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
