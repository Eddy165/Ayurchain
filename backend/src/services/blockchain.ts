import { ethers } from "ethers";
import { config } from "../config";
import FarmerRegistryABI from "../abis/FarmerRegistry.json";
import BatchTrackerABI from "../abis/BatchTracker.json";
import CertificationABI from "../abis/Certification.json";
import OwnershipTransferABI from "../abis/OwnershipTransfer.json";

class BlockchainService {
  // Using ! (definite assignment) because these are conditionally assigned from env config
  private provider!: ethers.JsonRpcProvider;
  private signer!: ethers.Wallet;
  private farmerRegistry!: ethers.Contract;
  private batchTracker!: ethers.Contract;
  private certification!: ethers.Contract;
  private ownershipTransfer!: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.polygonRpcUrl);
    if (config.deployerPrivateKey) {
      this.signer = new ethers.Wallet(config.deployerPrivateKey, this.provider);
    } else {
      console.warn("DEPLOYER_PRIVATE_KEY not set - blockchain features will be disabled");
      return;
    }

    // Initialize contracts (only if addresses are provided)
    if (config.contractAddresses.farmerRegistry) {
      this.farmerRegistry = new ethers.Contract(
        config.contractAddresses.farmerRegistry,
        FarmerRegistryABI,
        this.signer
      );
    }

    if (config.contractAddresses.batchTracker) {
      this.batchTracker = new ethers.Contract(
        config.contractAddresses.batchTracker,
        BatchTrackerABI,
        this.signer
      );
    }

    if (config.contractAddresses.certification) {
      this.certification = new ethers.Contract(
        config.contractAddresses.certification,
        CertificationABI,
        this.signer
      );
    }

    if (config.contractAddresses.ownershipTransfer) {
      this.ownershipTransfer = new ethers.Contract(
        config.contractAddresses.ownershipTransfer,
        OwnershipTransferABI,
        this.signer
      );
    }
  }

  // Farmer Registry methods
  async registerFarmer(farmerAddress: string, metadataURI: string): Promise<string> {
    if (!this.farmerRegistry) {
      throw new Error("FarmerRegistry contract not initialized");
    }
    const tx = await this.farmerRegistry.registerFarmer(metadataURI);
    await tx.wait();
    return tx.hash;
  }

  async updateKYC(farmerAddress: string, status: number): Promise<string> {
    const tx = await this.farmerRegistry.updateKYC(farmerAddress, status);
    await tx.wait();
    return tx.hash;
  }

  async getFarmer(farmerAddress: string) {
    return await this.farmerRegistry.getFarmer(farmerAddress);
  }

  // Batch Tracker methods
  async createBatch(batchId: string, farmerAddress: string, metadataURI: string): Promise<string> {
    if (!this.batchTracker) {
      throw new Error("BatchTracker contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.batchTracker.createBatch(batchIdBytes32, farmerAddress, metadataURI);
    await tx.wait();
    return tx.hash;
  }

  async addProcessingEvent(batchId: string, metadataURI: string): Promise<string> {
    if (!this.batchTracker) {
      throw new Error("BatchTracker contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.batchTracker.addProcessingEvent(batchIdBytes32, metadataURI);
    await tx.wait();
    return tx.hash;
  }

  async addLabReport(batchId: string, reportHash: string, status: string): Promise<string> {
    if (!this.batchTracker) {
      throw new Error("BatchTracker contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.batchTracker.addLabReport(batchIdBytes32, reportHash, status);
    await tx.wait();
    return tx.hash;
  }

  // Certification methods
  async addCertificate(
    batchId: string,
    certHash: string,
    certType: string,
    validUntil: number
  ): Promise<string> {
    if (!this.certification) {
      throw new Error("Certification contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.certification.addCertificate(
      batchIdBytes32,
      certHash,
      certType,
      validUntil
    );
    await tx.wait();
    return tx.hash;
  }

  async revokeCertificate(batchId: string, index: number, reasonHash: string): Promise<string> {
    if (!this.certification) {
      throw new Error("Certification contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.certification.revokeCertificate(batchIdBytes32, index, reasonHash);
    await tx.wait();
    return tx.hash;
  }

  async getCertificates(batchId: string) {
    if (!this.certification) {
      throw new Error("Certification contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    return await this.certification.getCertificates(batchIdBytes32);
  }

  // Ownership Transfer methods
  async initializeOwner(batchId: string, ownerAddress: string): Promise<string> {
    if (!this.ownershipTransfer) {
      throw new Error("OwnershipTransfer contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.ownershipTransfer.initializeOwner(batchIdBytes32, ownerAddress);
    await tx.wait();
    return tx.hash;
  }

  async logTransfer(batchId: string, toAddress: string, metadataURI: string): Promise<string> {
    if (!this.ownershipTransfer) {
      throw new Error("OwnershipTransfer contract not initialized");
    }
    const batchIdBytes32 = ethers.id(batchId);
    const tx = await this.ownershipTransfer.logTransfer(batchIdBytes32, toAddress, metadataURI);
    await tx.wait();
    return tx.hash;
  }

  async getTransfers(batchId: string) {
    if (!this.ownershipTransfer) {
      return [];
    }
    const batchIdBytes32 = ethers.id(batchId);
    return await this.ownershipTransfer.getTransfers(batchIdBytes32);
  }

  async getCurrentOwner(batchId: string): Promise<string> {
    if (!this.ownershipTransfer) {
      return "";
    }
    const batchIdBytes32 = ethers.id(batchId);
    return await this.ownershipTransfer.currentOwner(batchIdBytes32);
  }
}

export const blockchainService = new BlockchainService();
