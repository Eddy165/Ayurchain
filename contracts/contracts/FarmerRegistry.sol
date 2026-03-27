// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FarmerRegistry
 * @dev On-chain verified registry of all farmers for AyurChain.
 * @custom:author Senior Blockchain Engineer
 * @custom:date 2026-03-27
 */
contract FarmerRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    struct Farmer {
        string farmerId;
        string name;
        string location;
        string cropTypes;
        bytes32 aadhaarHash;
        bool isVerified;
        uint256 registeredAt;
    }

    mapping(string => Farmer) private _farmers;
    mapping(string => bool) private _farmerExists;

    event FarmerRegistered(string indexed farmerId, string name, uint256 timestamp);
    event FarmerVerified(string indexed farmerId, address indexed certifier);
    event FarmerRevoked(string indexed farmerId);

    error FarmerAlreadyExists();
    error FarmerNotFound();
    error FarmerNotVerified();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Register a new farmer. Only accessible by ADMIN_ROLE.
     */
    function registerFarmer(
        string memory farmerId,
        string memory name,
        string memory location,
        string memory cropTypes,
        bytes32 aadhaarHash
    ) external onlyRole(ADMIN_ROLE) {
        if (_farmerExists[farmerId]) {
            revert FarmerAlreadyExists();
        }

        _farmers[farmerId] = Farmer({
            farmerId: farmerId,
            name: name,
            location: location,
            cropTypes: cropTypes,
            aadhaarHash: aadhaarHash,
            isVerified: false,
            registeredAt: block.timestamp
        });
        _farmerExists[farmerId] = true;

        emit FarmerRegistered(farmerId, name, block.timestamp);
    }

    /**
     * @dev Verify a farmer's credentials. Only accessible by CERTIFIER_ROLE.
     */
    function verifyFarmer(string memory farmerId) external onlyRole(CERTIFIER_ROLE) {
        if (!_farmerExists[farmerId]) {
            revert FarmerNotFound();
        }
        
        _farmers[farmerId].isVerified = true;
        emit FarmerVerified(farmerId, msg.sender);
    }

    /**
     * @dev Revoke a farmer's registration. Only accessible by ADMIN_ROLE.
     */
    function revokeFarmer(string memory farmerId) external onlyRole(ADMIN_ROLE) {
        if (!_farmerExists[farmerId]) {
            revert FarmerNotFound();
        }
        
        delete _farmers[farmerId];
        _farmerExists[farmerId] = false;
        
        emit FarmerRevoked(farmerId);
    }

    /**
     * @dev Get a farmer's details.
     */
    function getFarmer(string memory farmerId) external view returns (Farmer memory) {
        if (!_farmerExists[farmerId]) {
            revert FarmerNotFound();
        }
        return _farmers[farmerId];
    }

    /**
     * @dev Check if a farmer is verified.
     */
    function isFarmerVerified(string memory farmerId) external view returns (bool) {
        if (!_farmerExists[farmerId]) {
            revert FarmerNotFound();
        }
        return _farmers[farmerId].isVerified;
    }
}
