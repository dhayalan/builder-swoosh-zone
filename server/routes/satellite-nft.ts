import { RequestHandler } from "express";
import axios from "axios";
import QRCode from "qrcode";
import FormData from "form-data";
import {
  SatelliteRecord,
  NFTGenerationRequest,
  NFTGenerationResponse,
} from "@shared/satellite-nft";

// === Configuration from Environment Variables ===
const FIREBASE_URL = process.env.FIREBASE_URL;
const FIREBASE_SECRET = process.env.FIREBASE_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;

// Validate required environment variables
if (!FIREBASE_URL || !FIREBASE_SECRET) {
  throw new Error(
    "Missing required Firebase configuration: FIREBASE_URL and FIREBASE_SECRET must be set",
  );
}

if (!PINATA_JWT) {
  throw new Error(
    "Missing required Pinata configuration: PINATA_JWT must be set",
  );
}

if (!NFT_CONTRACT_ADDRESS) {
  throw new Error(
    "Missing required NFT contract configuration: NFT_CONTRACT_ADDRESS must be set",
  );
}

async function getLatestSatelliteRecord(): Promise<SatelliteRecord> {
  try {
    const url = `${FIREBASE_URL}.json?auth=${FIREBASE_SECRET}`;
    const response = await axios.get(url);
    const data = response.data;

    if (!data) {
      throw new Error("No data found in Firebase");
    }

    // Flatten all records into one list (matching Python logic)
    const allRecords: SatelliteRecord[] = [];

    function walkTree(node: any) {
      if (typeof node === "object" && node !== null) {
        // Check if this is a valid satellite record
        if (
          node.timestamp &&
          typeof node.temperature === "number" &&
          typeof node.humidity === "number" &&
          typeof node.light === "number" &&
          typeof node.air_quality === "number"
        ) {
          allRecords.push(node);
        } else {
          // Recursively walk through child nodes
          Object.values(node).forEach((value) => walkTree(value));
        }
      }
    }

    walkTree(data);

    if (allRecords.length === 0) {
      throw new Error("No valid satellite records found");
    }

    // Pick latest by timestamp if possible, else just the last one
    try {
      const latest = allRecords
        .sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateA.getTime() - dateB.getTime();
        })
        .pop();

      return latest!;
    } catch (error) {
      return allRecords[allRecords.length - 1];
    }
  } catch (error) {
    console.error("Error fetching satellite data:", error);
    throw new Error(`Failed to fetch satellite data: ${error}`);
  }
}

async function generateQRCode(data: SatelliteRecord): Promise<Buffer> {
  try {
    const qrString = JSON.stringify(data, null, 2);
    const qrBuffer = await QRCode.toBuffer(qrString, {
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrBuffer;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}

async function uploadToPinata(
  qrBuffer: Buffer,
  fileName: string,
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", qrBuffer, {
      filename: fileName,
      contentType: "image/png",
    });

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      },
    );

    if (response.status === 200) {
      const ipfsHash = response.data.IpfsHash;
      return `ipfs://${ipfsHash}`;
    } else {
      throw new Error(`Pinata upload failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error(`Failed to upload to Pinata: ${error}`);
  }
}

export const generateSatelliteNFT: RequestHandler = async (req, res) => {
  try {
    const { transactionHash, walletAddress, amount }: NFTGenerationRequest =
      req.body;

    console.log(
      `🚀 Starting NFT generation for transaction: ${transactionHash}`,
    );

    // Step 1: Fetch latest satellite data from Firebase
    console.log("🔍 Fetching latest satellite record from Firebase...");
    const satelliteRecord = await getLatestSatelliteRecord();
    console.log("📊 Latest satellite data:", satelliteRecord);

    // Step 2: Generate QR code from satellite data
    console.log("📱 Generating QR code...");
    const qrBuffer = await generateQRCode(satelliteRecord);

    // Step 3: Upload QR code to Pinata IPFS
    console.log("🌐 Uploading QR code to Pinata IPFS...");
    const fileName = `satellite-nft-${Date.now()}.png`;
    const ipfsUrl = await uploadToPinata(qrBuffer, fileName);

    // Step 4: Convert buffer to base64 for frontend display
    const qrCodeDataUrl = `data:image/png;base64,${qrBuffer.toString("base64")}`;

    console.log("✅ NFT generation completed successfully!");
    console.log("🔗 IPFS URL:", ipfsUrl);

    const response: NFTGenerationResponse = {
      success: true,
      message: "Satellite NFT generated successfully!",
      qrCodeUrl: qrCodeDataUrl,
      ipfsUrl: ipfsUrl,
      satelliteData: satelliteRecord,
      contractAddress: NFT_CONTRACT_ADDRESS,
    };

    res.json(response);
  } catch (error) {
    console.error("❌ NFT generation failed:", error);

    const errorResponse: NFTGenerationResponse = {
      success: false,
      message: "Failed to generate satellite NFT",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(500).json(errorResponse);
  }
};
