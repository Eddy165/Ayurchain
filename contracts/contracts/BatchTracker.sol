// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title BatchTracker
 * @dev Core contract — creates herb batches and tracks them through the supply chain immutably.
 * @custom:author Senior Blockchain Engineer
 * @custom:date 2026-03-27
 */
contract BatchTracker is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");
    bytes32 public constant BRAND_ROLE = keccak256("BRAND_ROLE");

    enum Stage { FarmHarvest, Processing, LabTesting, Certified, BrandPackaged, RetailReady }

    struct Batch {
        string batchId;
        string farmerId;
        string herbName;
        string harvestLocation;
        uint256 harvestDate;
        string quantity;
        Stage currentStage;
        bool isCertified;
        string ipfsDocHash;
        uint256 createdAt;
    }

    struct TransferEvent {
        Stage stage;
        address actorAddress;
        string actorId;
        string notes;
        string ipfsHash;
        uint256 timestamp;
    }

    mapping(string => Batch) private _batches;
    mapping(string => bool) private _batchExists;
    mapping(string => TransferEvent[]) private _batchHistory;

    event BatchCreated(string indexed batchId, string indexed farmerId, string herbName, uint256 timestamp);
    event BatchTransferred(string indexed batchId, Stage newStage, address indexed actor);
    event BatchCertified(string indexed batchId, address indexed certifier);

    error BatchAlreadyExists();
    error BatchNotFound();
    error UnauthorizedStageTransfer();

    modifier validBatch(string memory batchId) {
        if (!_batchExists[batchId]) revert BatchNotFound();
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new batch. Only accessible by ADMIN_ROLE.
     */
    function createBatch(
        string memory batchId,
        string memory farmerId,
        string memory herbName,
        string memory harvestLocation,
        uint256 harvestDate,
        string memory quantity,
        string memory ipfsDocHash
    ) external onlyRole(ADMIN_ROLE) {
        if (_batchExists[batchId]) revert BatchAlreadyExists();

        _batches[batchId] = Batch({
            batchId: batchId,
            farmerId: farmerId,
            herbName: herbName,
            harvestLocation: harvestLocation,
            harvestDate: harvestDate,
            quantity: quantity,
            currentStage: Stage.FarmHarvest,
            isCertified: false,
            ipfsDocHash: ipfsDocHash,
            createdAt: block.timestamp
        });
        
        _batchExists[batchId] = true;

        _batchHistory[batchId].push(TransferEvent({
            stage: Stage.FarmHarvest,
            actorAddress: msg.sender,
            actorId: farmerId,
            notes: "Batch created at FarmHarvest stage",
            ipfsHash: ipfsDocHash,
            timestamp: block.timestamp
        }));

        emit BatchCreated(batchId, farmerId, herbName, block.timestamp);
    }

    /**
     * @dev Transfer the batch to a new stage in the supply chain.
     */
    function transferBatch(
        string memory batchId,
        Stage newStage,
        string memory actorId,
        string memory notes,
        string memory newIpfsHash
    ) external validBatch(batchId) {
        // Enforce role-based access control based on the intended next stage
        if (newStage == Stage.Processing && !hasRole(PROCESSOR_ROLE, msg.sender)) revert UnauthorizedStageTransfer();
        if (newStage == Stage.LabTesting && !hasRole(LAB_ROLE, msg.sender)) revert UnauthorizedStageTransfer();
        if (newStage == Stage.Certified && !hasRole(CERTIFIER_ROLE, msg.sender)) revert UnauthorizedStageTransfer();
        if ((newStage == Stage.BrandPackaged || newStage == Stage.RetailReady) && !hasRole(BRAND_ROLE, msg.sender)) revert UnauthorizedStageTransfer();

        Batch storage batch = _batches[batchId];
        batch.currentStage = newStage;
        
        if (bytes(newIpfsHash).length > 0) {
            batch.ipfsDocHash = newIpfsHash;
        }

        _batchHistory[batchId].push(TransferEvent({
            stage: newStage,
            actorAddress: msg.sender,
            actorId: actorId,
            notes: notes,
            ipfsHash: newIpfsHash,
            timestamp: block.timestamp
        }));

        emit BatchTransferred(batchId, newStage, msg.sender);
    }

    /**
     * @dev Certify a batch. Only accessible by CERTIFIER_ROLE.
     */
    function certifyBatch(string memory batchId, string memory certDocHash) 
        external 
        validBatch(batchId) 
        onlyRole(CERTIFIER_ROLE) 
    {
        Batch storage batch = _batches[batchId];
        batch.isCertified = true;
        
        if (bytes(certDocHash).length > 0) {
            batch.ipfsDocHash = certDocHash;
        }
        
        emit BatchCertified(batchId, msg.sender);
    }

    /**
     * @dev Retrieve current batch state.
     */
    function getBatch(string memory batchId) external view validBatch(batchId) returns (Batch memory) {
        return _batches[batchId];
    }

    /**
     * @dev Retrieve history of batch events.
     */
    function getBatchHistory(string memory batchId) external view validBatch(batchId) returns (TransferEvent[] memory) {
        return _batchHistory[batchId];
    }

    /**
     * @dev Retrieve current stage of the batch.
     */
    function getBatchStage(string memory batchId) external view validBatch(batchId) returns (Stage) {
        return _batches[batchId].currentStage;
    }
}
