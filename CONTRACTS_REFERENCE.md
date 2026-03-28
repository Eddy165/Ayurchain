# AyurChain Smart Contracts Reference

All deployed contract addresses are dynamically stored and referenced from:
`backend/src/config/contractAddresses.json`

## 1. FarmerRegistry
Manages the onboarding and identity verification of Ayurvedic herb farmers by Certifying bodies.

### Core Functions
* `registerFarmer(string farmerId, string name, string location, string cropTypes, bytes32 aadhaarHash) external`
  * Registers a new farmer onto the blockchain. Requires `ADMIN_ROLE`.
* `verifyFarmer(string farmerId) external`
  * Toggles the target farmer's verification status to `true`. Requires `CERTIFIER_ROLE`.
* `getFarmer(string farmerId) external view`
  * Returns the full struct of farmer details and verification status.

### Events Emitted
* `FarmerRegistered(string indexed farmerId, string name, string location)`
* `FarmerVerified(string indexed farmerId, address certifier)`

---

## 2. BatchTracker
The core traceability contract tracking herbal batches as they traverse the supply chain nodes via RBAC validations.

### Core Functions
* `createBatch(string batchId, string farmerId, string herbName, string harvestLocation, uint256 harvestDate, string quantity, string ipfsDocHash) external`
  * Instantiates a new batch linking it to the registered farmer. Initializes stage to FarmHarvest.
* `transferBatch(string batchId, uint8 newStage, string actorId, string notes, string newIpfsHash) external`
  * Transitions batch to a new supply chain stage (e.g., Processing, LabTesting, BrandPackaged). Validates role permissions for the specific new stage transition.
* `certifyBatch(string batchId, string certDocHash) external`
  * Flags a batch as definitively certified and immutably logs the primary certification IPFS hash to the batch history directly.

### Events Emitted
* `BatchCreated(string indexed batchId, string indexed farmerId, string herbName)`
* `BatchTransferred(string indexed batchId, uint8 previousStage, uint8 newStage, address indexed actor)`
* `BatchCertified(string indexed batchId, address indexed certifier)`

---

## 3. OwnershipTransfer
Manages the legal and financial transition point custody of batches between discrete entities in the supply chain (e.g., Farmer to Processor, Processor to Brand).

*(Note: Phase 1 relies primarily on `BatchTracker.transferBatch` for state transition, but OwnershipTransfer handles financial ESCROW & final physical handshakes).*

### Core Functions
* `initiateTransfer(string batchId, address from, address to, uint256 value)`
  * Locks the batch for a pending ownership handover and escrows funds if applicable.
* `completeTransfer(string batchId)`
  * Finalizes the pending transfer, clears the escrow, and changes the master owner role of the batch.

### Events Emitted
* `TransferInitiated(string indexed batchId, address from, address to)`
* `TransferCompleted(string indexed batchId, address previousOwner, address newOwner)`

---

## 4. Certification
Handles the standalone NFT-like issuance of specific quality flags, lab results, and organic credentials tied fundamentally to a single batch.

### Core Functions
* `issueCertificate(string certId, string batchId, string certifierOrgName, string certType, string ipfsCertHash, uint256 expiresAt) external`
  * Generates an undeniable proof of certification linked to a batch.
* `revokeCertificate(string batchId, uint256 certIndex, string reasonHash) external`
  * Revokes an active certificate (e.g., upon finding severe pesticide contamination post-issuance).
* `getCertificates(string batchId) external view`
  * Aggregates and returns the entire array of issued certificates attached to the batchId.

### Events Emitted
* `CertificateIssued(string indexed certId, string indexed batchId, address issuedBy, string certType)`
* `CertificateRevoked(string indexed certId, address revokedBy, string reasonHash)`
