import axios from "axios";
import FormData from "form-data";

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";
const PINATA_PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

const isDevMode = !PINATA_API_KEY || !PINATA_SECRET_KEY;

/**
 * Upload a file buffer to Pinata IPFS.
 * Falls back to a placeholder in dev/demo mode if keys aren't set.
 * @returns IPFS CID string
 */
export async function uploadFileToPinata(file: Buffer, filename: string): Promise<string> {
  if (isDevMode) {
    console.warn("[ipfsService] Pinata keys not set. Returning placeholder IPFS hash.");
    return `PLACEHOLDER_HASH_${Date.now()}`;
  }

  try {
    const formData = new FormData();
    formData.append("file", file, { filename });

    const response = await axios.post(PINATA_PIN_FILE_URL, formData, {
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });

    return response.data.IpfsHash as string;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pinata upload error";
    console.error(JSON.stringify({ service: "ipfsService", fn: "uploadFileToPinata", error: message }));
    console.warn("[ipfsService] Pinata upload failed. Returning placeholder.");
    return `PLACEHOLDER_HASH_${Date.now()}`;
  }
}

/**
 * Upload a JSON metadata object to Pinata IPFS.
 * Falls back to a placeholder in dev/demo mode.
 * @returns IPFS CID string
 */
export async function uploadJSONToPinata(metadata: object, name: string): Promise<string> {
  if (isDevMode) {
    console.warn("[ipfsService] Pinata keys not set. Returning placeholder IPFS hash.");
    return `PLACEHOLDER_JSON_HASH_${Date.now()}`;
  }

  try {
    const response = await axios.post(
      PINATA_PIN_JSON_URL,
      {
        pinataMetadata: { name },
        pinataContent: metadata,
      },
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );
    return response.data.IpfsHash as string;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pinata upload error";
    console.error(JSON.stringify({ service: "ipfsService", fn: "uploadJSONToPinata", error: message }));
    console.warn("[ipfsService] Pinata upload failed. Returning placeholder.");
    return `PLACEHOLDER_JSON_HASH_${Date.now()}`;
  }
}
