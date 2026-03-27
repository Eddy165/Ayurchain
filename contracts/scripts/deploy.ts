import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy FarmerRegistry
  const FarmerRegistry = await ethers.getContractFactory("FarmerRegistry");
  const farmerRegistry = await FarmerRegistry.deploy();
  await farmerRegistry.waitForDeployment();
  const farmerRegistryAddress = await farmerRegistry.getAddress();
  console.log("FarmerRegistry deployed to:", farmerRegistryAddress);

  // 2. Deploy BatchTracker
  const BatchTracker = await ethers.getContractFactory("BatchTracker");
  const batchTracker = await BatchTracker.deploy();
  await batchTracker.waitForDeployment();
  const batchTrackerAddress = await batchTracker.getAddress();
  console.log("BatchTracker deployed to:", batchTrackerAddress);

  // 3. Deploy OwnershipTransfer
  const OwnershipTransfer = await ethers.getContractFactory("OwnershipTransfer");
  const ownershipTransfer = await OwnershipTransfer.deploy(batchTrackerAddress);
  await ownershipTransfer.waitForDeployment();
  const ownershipTransferAddress = await ownershipTransfer.getAddress();
  console.log("OwnershipTransfer deployed to:", ownershipTransferAddress);

  // 4. Deploy Certification
  const Certification = await ethers.getContractFactory("Certification");
  const certification = await Certification.deploy();
  await certification.waitForDeployment();
  const certificationAddress = await certification.getAddress();
  console.log("Certification deployed to:", certificationAddress);

  // Grant roles to allow backend deployer account to manage them
  console.log("Setting up roles...");
  // ADMIN_ROLE, CERTIFIER_ROLE, LAB_ROLE, PROCESSOR_ROLE, BRAND_ROLE setup
  const ADMIN_ROLE = await batchTracker.ADMIN_ROLE();
  const PROCESSOR_ROLE = await batchTracker.PROCESSOR_ROLE();
  const LAB_ROLE = await batchTracker.LAB_ROLE();
  const CERTIFIER_ROLE = await batchTracker.CERTIFIER_ROLE();
  const BRAND_ROLE = await batchTracker.BRAND_ROLE();
  
  // For the sake of the platform backend, the deployer wallet will hold these roles
  // and process updates on behalf of the users (gasless experience for users).
  await batchTracker.grantRole(PROCESSOR_ROLE, deployer.address);
  await batchTracker.grantRole(LAB_ROLE, deployer.address);
  await batchTracker.grantRole(CERTIFIER_ROLE, deployer.address);
  await batchTracker.grantRole(BRAND_ROLE, deployer.address);

  const farmerCertRole = await farmerRegistry.CERTIFIER_ROLE();
  await farmerRegistry.grantRole(farmerCertRole, deployer.address);

  const certRole = await certification.CERTIFIER_ROLE();
  await certification.grantRole(certRole, deployer.address);
  
  console.log("Roles assigned to deployer.");

  // Save addresses for Backend
  const backendConfigDir = path.join(__dirname, "../../../backend/src/config");
  if (!fs.existsSync(backendConfigDir)) {
    fs.mkdirSync(backendConfigDir, { recursive: true });
  }
  
  const addressesPath = path.join(backendConfigDir, "contractAddresses.json");
  const addresses = {
    FarmerRegistry: farmerRegistryAddress,
    BatchTracker: batchTrackerAddress,
    OwnershipTransfer: ownershipTransferAddress,
    Certification: certificationAddress
  };

  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log(`Contract addresses saved to ${addressesPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
