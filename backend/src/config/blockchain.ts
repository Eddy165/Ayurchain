import { ethers, JsonRpcProvider, Wallet } from "ethers";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

// Load Contract Addresses dynamically
const contractAddressesPath = path.join(__dirname, "contractAddresses.json");
let contractAddresses: any = {};
if (fs.existsSync(contractAddressesPath)) {
    const rawData = fs.readFileSync(contractAddressesPath, "utf-8");
    contractAddresses = JSON.parse(rawData);
}

const rpcUrl = process.env.POLYGON_RPC_URL || "https://rpc-mumbai.maticvigil.com";
export const provider = new JsonRpcProvider(rpcUrl);

const privateKey = process.env.DEPLOYER_PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
export const signer = new Wallet(privateKey, provider);

export const getAddresses = () => {
    return {
        FarmerRegistry: process.env.FARMER_REGISTRY_ADDRESS || contractAddresses.FarmerRegistry,
        BatchTracker: process.env.BATCH_TRACKER_ADDRESS || contractAddresses.BatchTracker,
        OwnershipTransfer: process.env.OWNERSHIP_TRANSFER_ADDRESS || contractAddresses.OwnershipTransfer,
        Certification: process.env.CERTIFICATION_ADDRESS || contractAddresses.Certification,
    };
};
