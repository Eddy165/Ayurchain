import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

/**
 * Generate a unique QR token for a batch.
 */
export function generateQRToken(batchId: string): string {
  // uuid v4 is cryptographically random and URL-safe
  return uuidv4();
}

/**
 * Generate a QR code PNG data URL for a batch consumer scan URL.
 * @returns Base64-encoded PNG data URL
 */
export async function generateQRCode(token: string, batchId: string): Promise<string> {
  const scanUrl = `${FRONTEND_URL}/scan/${token}`;

  try {
    const dataUrl = await QRCode.toDataURL(scanUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#1a1a2e",
        light: "#ffffff",
      },
    });
    return dataUrl;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "QR generation error";
    console.error(JSON.stringify({ service: "qrService", fn: "generateQRCode", batchId, error: message }));
    throw new Error(`QR generation failed: ${message}`);
  }
}
