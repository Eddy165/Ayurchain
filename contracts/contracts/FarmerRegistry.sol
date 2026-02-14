// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract FarmerRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum KYCStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Farmer {
        address wallet;
        string metadataURI; // IPFS or off-chain metadata
        KYCStatus kycStatus;
    }

    mapping(address => Farmer) private farmers;

    event FarmerRegistered(address indexed farmer, string metadataURI);
    event FarmerKYCUpdated(address indexed farmer, KYCStatus status);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function registerFarmer(string calldata metadataURI) external {
        Farmer storage f = farmers[msg.sender];
        require(f.wallet == address(0), "Farmer already registered");

        farmers[msg.sender] = Farmer({
            wallet: msg.sender,
            metadataURI: metadataURI,
            kycStatus: KYCStatus.Pending
        });

        emit FarmerRegistered(msg.sender, metadataURI);
    }

    function updateKYC(
        address farmer,
        KYCStatus status
    ) external onlyRole(ADMIN_ROLE) {
        require(farmers[farmer].wallet != address(0), "Farmer not found");
        farmers[farmer].kycStatus = status;
        emit FarmerKYCUpdated(farmer, status);
    }

    function getFarmer(
        address farmer
    ) external view returns (Farmer memory) {
        require(farmers[farmer].wallet != address(0), "Farmer not found");
        return farmers[farmer];
    }
}

