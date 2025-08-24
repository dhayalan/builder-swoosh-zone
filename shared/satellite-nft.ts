export interface SatelliteRecord {
  timestamp: string;
  temperature: number;
  humidity: number;
  light: number;
  air_quality: number;
}

export interface NFTGenerationRequest {
  transactionHash: string;
  walletAddress: string;
  amount: string;
}

export interface NFTGenerationResponse {
  success: boolean;
  message: string;
  qrCodeUrl?: string;
  ipfsUrl?: string;
  satelliteData?: SatelliteRecord;
  contractAddress?: string;
  error?: string;
}
