export interface User {
  _id: string;
  name: string;
  email: string;
  role: "farmer" | "processor" | "lab" | "certifier" | "brand" | "admin";
  orgName?: string;
  location?: string;
  phone?: string;
}

export interface JourneyStep {
  stage: number | string;
  actorName: string;
  actorRole?: string;
  timestamp: string;
  notes: string;
  ipfsHash: string;
  txHash: string;
}

export interface Certificate {
  certType: string;
  certifierOrgName: string;
  issuedAt: string;
  expiresAt: string;
  ipfsHash: string;
}

export interface TransferEvent {
  stage: number;
  actorId: string | User;
  actorName?: string;
  notes?: string;
  ipfsHash?: string;
  txHash?: string;
  timestamp: string;
}

export interface LabReport {
  _id: string;
  batchId: string;
  labId: string | User;
  reportTitle: string;
  reportType: string;
  ipfsHash: string;
  fileUrl?: string;
  status: string;
  findings?: string;
  testDate: string;
}

export interface Batch {
  _id: string;
  batchId: string;
  farmerId: string | User;
  herbName: string;
  scientificName?: string;
  harvestLocation?: string;
  harvestDate: string;
  quantity?: string;
  currentStage: number | string;
  status?: string;
  isCertified: boolean;
  qrToken?: string;
  transferHistory: TransferEvent[];
}

export interface ConsumerScanResult {
  batchId: string;
  herbName: string;
  scientificName: string;
  farmerName: string;
  farmerLocation: string;
  harvestDate: string;
  currentStage: string | number;
  isCertified: boolean;
  journey: JourneyStep[];
  certificates: Certificate[];
  blockchainVerified: boolean;
  trustScore: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface BatchState {
  batches: Batch[];
  currentBatch: Batch | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  orgName?: string;
  location?: string;
  phone?: string;
}
