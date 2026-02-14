import { create } from "ipfs-http-client";
import { config } from "../config";

class IPFSService {
  private client: any;

  constructor() {
    // Use Pinata or public IPFS gateway
    if (config.pinataApiKey && config.pinataSecretKey) {
      // Pinata IPFS client
      this.client = create({
        host: "api.pinata.cloud",
        port: 443,
        protocol: "https",
        headers: {
          pinata_api_key: config.pinataApiKey,
          pinata_secret_api_key: config.pinataSecretKey,
        },
      });
    } else {
      // Public IPFS gateway (for development)
      this.client = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
      });
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const result = await this.client.add({
        path: fileName,
        content: fileBuffer,
      });
      return result.cid.toString();
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload to IPFS");
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const jsonString = JSON.stringify(data);
      const result = await this.client.add(jsonString);
      return result.cid.toString();
    } catch (error) {
      console.error("IPFS JSON upload error:", error);
      throw new Error("Failed to upload JSON to IPFS");
    }
  }

  getGatewayURL(cid: string): string {
    return `${config.ipfsGateway}${cid}`;
  }
}

export const ipfsService = new IPFSService();
