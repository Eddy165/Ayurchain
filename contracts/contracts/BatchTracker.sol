// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BatchTracker is AccessControl {
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");

    struct Batch {
        bytes32 batchId;
        address farmer;
        string metadataURI; // off-chain metadata hash/URI
        bool exists;
    }

    mapping(bytes32 => Batch) public batches;

    event BatchCreated(
        bytes32 indexed batchId,
        address indexed farmer,
        string metadataURI
    );
    event ProcessingEventAdded(bytes32 indexed batchId, string metadataURI);
    event LabReportAdded(
        bytes32 indexed batchId,
        string reportHash,
        string status
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(LAB_ROLE, admin);
        _grantRole(PROCESSOR_ROLE, admin);
    }

    function createBatch(
        bytes32 batchId,
        address farmer,
        string calldata metadataURI
    ) external {
        require(!batches[batchId].exists, "Batch already exists");
        batches[batchId] = Batch({
            batchId: batchId,
            farmer: farmer,
            metadataURI: metadataURI,
            exists: true
        });
        emit BatchCreated(batchId, farmer, metadataURI);
    }

    function addProcessingEvent(
        bytes32 batchId,
        string calldata metadataURI
    ) external onlyRole(PROCESSOR_ROLE) {
        require(batches[batchId].exists, "Batch not found");
        emit ProcessingEventAdded(batchId, metadataURI);
    }

    function addLabReport(
        bytes32 batchId,
        string calldata reportHash,
        string calldata status
    ) external onlyRole(LAB_ROLE) {
        require(batches[batchId].exists, "Batch not found");
        emit LabReportAdded(batchId, reportHash, status);
    }
}

