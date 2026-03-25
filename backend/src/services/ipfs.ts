// import { create } from "ipfs-http-client";
import { config } from "../config";

class IPFSService {
  private client: any;

  constructor() {
    // Dummy client
    this.client = null;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      // Dummy CID
      return "QmDummyCIDForOptionalIPFS" + Math.floor(Math.random() * 1000000);
    } catch (error) {
      console.error("IPFS upload error:", error);
      throw new Error("Failed to upload to IPFS");
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      // Dummy CID
      return "QmDummyJSONCIDForOptionalIPFS" + Math.floor(Math.random() * 1000000);
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
