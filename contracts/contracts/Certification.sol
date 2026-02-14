// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Certification is AccessControl {
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    struct Certificate {
        bytes32 batchId;
        string certHash;
        string certType;
        uint256 validUntil;
        bool revoked;
        string revokeReasonHash;
    }

    mapping(bytes32 => Certificate[]) private certificatesByBatch;

    event CertificateAdded(
        bytes32 indexed batchId,
        string certHash,
        string certType,
        uint256 validUntil
    );

    event CertificateRevoked(
        bytes32 indexed batchId,
        uint256 index,
        string reasonHash
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(CERTIFIER_ROLE, admin);
    }

    function addCertificate(
        bytes32 batchId,
        string calldata certHash,
        string calldata certType,
        uint256 validUntil
    ) external onlyRole(CERTIFIER_ROLE) {
        Certificate memory cert = Certificate({
            batchId: batchId,
            certHash: certHash,
            certType: certType,
            validUntil: validUntil,
            revoked: false,
            revokeReasonHash: ""
        });
        certificatesByBatch[batchId].push(cert);
        emit CertificateAdded(batchId, certHash, certType, validUntil);
    }

    function revokeCertificate(
        bytes32 batchId,
        uint256 index,
        string calldata reasonHash
    ) external onlyRole(CERTIFIER_ROLE) {
        require(index < certificatesByBatch[batchId].length, "Invalid index");
        Certificate storage cert = certificatesByBatch[batchId][index];
        require(!cert.revoked, "Already revoked");
        cert.revoked = true;
        cert.revokeReasonHash = reasonHash;
        emit CertificateRevoked(batchId, index, reasonHash);
    }

    function getCertificates(
        bytes32 batchId
    ) external view returns (Certificate[] memory) {
        return certificatesByBatch[batchId];
    }
}

