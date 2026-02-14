export enum UserRole {
  FARMER = "FARMER",
  PROCESSOR = "PROCESSOR",
  LAB = "LAB",
  CERTIFIER = "CERTIFIER",
  BRAND = "BRAND",
  CONSUMER = "CONSUMER",
  ADMIN = "ADMIN",
}

export enum BatchStatus {
  CREATED = "CREATED",
  IN_PROCESSING = "IN_PROCESSING",
  UNDER_TEST = "UNDER_TEST",
  CERTIFIED = "CERTIFIED",
  REJECTED = "REJECTED",
  PACKAGED = "PACKAGED",
  IN_MARKET = "IN_MARKET",
}

export enum KYCStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum CertificateType {
  AYUSH = "AYUSH",
  FSSAI = "FSSAI",
  ORGANIC = "ORGANIC",
  EXPORT = "EXPORT",
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  kycStatus: KYCStatus;
  walletAddress?: string;
  languages: string[];
  organization?: string;
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  passwordHash: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBatch {
  _id?: string;
  batchId: string;
  shortBatchRef: string; // Short reference for QR codes
  farmerId: string;
  speciesName: string;
  quantity: number;
  unit: string;
  harvestDate: Date;
  geoLocation: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  initialQualityGrade: string;
  photos?: string[]; // IPFS hashes
  status: BatchStatus;
  currentOwnerId?: string;
  blockchainTxHash?: string;
  metadataHash?: string; // IPFS hash for batch metadata
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITransfer {
  _id?: string;
  batchId: string;
  fromUserId: string;
  toUserId: string;
  transferType: string; // HARVEST_TO_PROCESSOR, PROCESSOR_TO_LAB, etc.
  metadataHash?: string;
  blockchainTxHash?: string;
  timestamp: Date;
}

export interface ILabReport {
  _id?: string;
  batchId: string;
  labId: string;
  testParameters: {
    moisture?: number;
    pesticideResidues?: string;
    heavyMetals?: string;
    dnaBarcoding?: boolean;
    [key: string]: any;
  };
  resultStatus: "PASS" | "FAIL" | "PENDING";
  reportFileHash: string; // IPFS hash
  blockchainTxHash?: string;
  createdAt: Date;
}

export interface ICertification {
  _id?: string;
  batchId: string;
  certifierId: string;
  certificateType: CertificateType;
  expiryDate: Date;
  certificateFileHash: string; // IPFS hash
  blockchainTxHash?: string;
  revoked: boolean;
  revokeReasonHash?: string;
  createdAt: Date;
}

export interface IProcessingEvent {
  _id?: string;
  batchId: string;
  processorId: string;
  eventType: string; // CLEANING, DRYING, GRINDING, STORAGE
  metadataHash?: string;
  blockchainTxHash?: string;
  timestamp: Date;
}
