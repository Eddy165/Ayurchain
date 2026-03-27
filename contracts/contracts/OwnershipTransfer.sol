// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Minimal interface for calling BatchTracker
interface IBatchTracker {
    enum Stage { FarmHarvest, Processing, LabTesting, Certified, BrandPackaged, RetailReady }
    function transferBatch(
        string memory batchId,
        Stage newStage,
        string memory actorId,
        string memory notes,
        string memory newIpfsHash
    ) external;
}

/**
 * @title OwnershipTransfer
 * @dev Tracks custody/ownership of a batch as it moves between entities.
 * @custom:author Senior Blockchain Engineer
 * @custom:date 2026-03-27
 */
contract OwnershipTransfer is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct OwnershipRecord {
        string batchId;
        string fromEntityId;
        string toEntityId;
        address fromAddress;
        address toAddress;
        uint256 transferredAt;
        string notes;
    }

    IBatchTracker public batchTracker;

    mapping(string => OwnershipRecord[]) private _ownershipChains;
    mapping(string => address) private _currentOwners;

    event OwnershipTransferred(string indexed batchId, address indexed from, address indexed to, uint256 timestamp);

    error NotCurrentOwner();
    error ZeroAddress();

    constructor(address _batchTrackerAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        
        if (_batchTrackerAddress != address(0)) {
            batchTracker = IBatchTracker(_batchTrackerAddress);
        }
    }

    /**
     * @dev Set the BatchTracker address (only ADMIN_ROLE)
     */
    function setBatchTracker(address _batchTrackerAddress) external onlyRole(ADMIN_ROLE) {
        if (_batchTrackerAddress == address(0)) revert ZeroAddress();
        batchTracker = IBatchTracker(_batchTrackerAddress);
    }

    /**
     * @dev Called once when a batch is first created to set the initial owner.
     * Could be called by an admin or directly when minting.
     */
    function setInitialOwner(string memory batchId, address initialOwnerAddress) external onlyRole(ADMIN_ROLE) {
        _currentOwners[batchId] = initialOwnerAddress;
    }

    /**
     * @dev Transfer ownership and optionally increment stage.
     */
    function initiateTransfer(
        string memory batchId,
        string memory fromEntityId,
        string memory toEntityId,
        address toAddress,
        string memory notes,
        IBatchTracker.Stage newStage,
        string memory newIpfsHash
    ) external {
        if (_currentOwners[batchId] != address(0) && _currentOwners[batchId] != msg.sender) {
            revert NotCurrentOwner();
        }
        if (toAddress == address(0)) revert ZeroAddress();

        _ownershipChains[batchId].push(OwnershipRecord({
            batchId: batchId,
            fromEntityId: fromEntityId,
            toEntityId: toEntityId,
            fromAddress: msg.sender,
            toAddress: toAddress,
            transferredAt: block.timestamp,
            notes: notes
        }));
        
        address fromAddress = _currentOwners[batchId] == address(0) ? msg.sender : _currentOwners[batchId];

        _currentOwners[batchId] = toAddress;

        // Optionally interact with BatchTracker if defined.
        if (address(batchTracker) != address(0)) {
            // Note: msg.sender calling OwnershipTransfer must be a valid role to transfer stages on the Tracker,
            // OR OwnershipTransfer needs admin rights inside BatchTracker.
            batchTracker.transferBatch(batchId, newStage, toEntityId, notes, newIpfsHash);
        }

        emit OwnershipTransferred(batchId, fromAddress, toAddress, block.timestamp);
    }

    /**
     * @dev Get the full chain of ownership transfers.
     */
    function getOwnershipChain(string memory batchId) external view returns (OwnershipRecord[] memory) {
        return _ownershipChains[batchId];
    }

    /**
     * @dev Get the current owner of the batch.
     */
    function getCurrentOwner(string memory batchId) external view returns (address) {
        return _currentOwners[batchId];
    }
}
