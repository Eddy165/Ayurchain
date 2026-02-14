// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract OwnershipTransfer is AccessControl {
    bytes32 public constant TRANSFER_AGENT_ROLE =
        keccak256("TRANSFER_AGENT_ROLE");

    struct TransferEvent {
        bytes32 batchId;
        address from;
        address to;
        string metadataURI;
        uint256 timestamp;
    }

    // current owner per batch
    mapping(bytes32 => address) public currentOwner;
    mapping(bytes32 => TransferEvent[]) private transfersByBatch;

    event TransferLogged(
        bytes32 indexed batchId,
        address indexed from,
        address indexed to,
        string metadataURI,
        uint256 timestamp
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(TRANSFER_AGENT_ROLE, admin);
    }

    function initializeOwner(
        bytes32 batchId,
        address owner
    ) external onlyRole(TRANSFER_AGENT_ROLE) {
        require(currentOwner[batchId] == address(0), "Owner already set");
        currentOwner[batchId] = owner;
    }

    function logTransfer(
        bytes32 batchId,
        address to,
        string calldata metadataURI
    ) external {
        address owner = currentOwner[batchId];
        require(owner != address(0), "Batch owner not initialized");
        require(msg.sender == owner, "Only current owner can transfer");

        TransferEvent memory evt = TransferEvent({
            batchId: batchId,
            from: owner,
            to: to,
            metadataURI: metadataURI,
            timestamp: block.timestamp
        });

        transfersByBatch[batchId].push(evt);
        currentOwner[batchId] = to;

        emit TransferLogged(batchId, owner, to, metadataURI, block.timestamp);
    }

    function getTransfers(
        bytes32 batchId
    ) external view returns (TransferEvent[] memory) {
        return transfersByBatch[batchId];
    }
}

