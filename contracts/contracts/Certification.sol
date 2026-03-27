// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title Certification
 * @dev Issues, stores, and validates AYUSH-style certifications for batches.
 * @custom:author Senior Blockchain Engineer
 * @custom:date 2026-03-27
 */
contract Certification is AccessControl {
    bytes32 public constant DEFAULT_ADMIN = 0x00;
    bytes32 public constant CERTIFIER_ROLE = keccak256("CERTIFIER_ROLE");

    struct Certificate {
        string certId;
        string batchId;
        address issuedBy;
        string certifierOrgName;
        string certType; // e.g. "AYUSH_GMP", "ISO_22000", "ORGANIC"
        string ipfsCertHash;
        uint256 issuedAt;
        uint256 expiresAt;
        bool isRevoked;
    }

    mapping(string => Certificate[]) private _batchCertificates;
    mapping(string => Certificate) private _certificatesById;
    mapping(string => bool) private _certExists;

    event CertificateIssued(string indexed certId, string indexed batchId, address indexed certifier, string certType);
    event CertificateRevoked(string indexed certId, string reason);

    error CertAlreadyExists();
    error CertNotFound();

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // By default, deployer can manage roles and set up certifiers
    }

    /**
     * @dev Issue a new certificate for a specific batch.
     */
    function issueCertificate(
        string memory certId,
        string memory batchId,
        string memory certifierOrgName,
        string memory certType,
        string memory ipfsCertHash,
        uint256 expiresAt
    ) external onlyRole(CERTIFIER_ROLE) {
        if (_certExists[certId]) revert CertAlreadyExists();

        Certificate memory newCert = Certificate({
            certId: certId,
            batchId: batchId,
            issuedBy: msg.sender,
            certifierOrgName: certifierOrgName,
            certType: certType,
            ipfsCertHash: ipfsCertHash,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            isRevoked: false
        });

        _certificatesById[certId] = newCert;
        _batchCertificates[batchId].push(newCert);
        _certExists[certId] = true;

        emit CertificateIssued(certId, batchId, msg.sender, certType);
    }

    /**
     * @dev Revoke an existing certificate.
     */
    function revokeCertificate(string memory certId, string memory reason) external onlyRole(CERTIFIER_ROLE) {
        if (!_certExists[certId]) revert CertNotFound();

        Certificate storage cert = _certificatesById[certId];
        cert.isRevoked = true;

        // Also update inside the array for batch iteration
        Certificate[] storage batchCerts = _batchCertificates[cert.batchId];
        for (uint i = 0; i < batchCerts.length; i++) {
            if (keccak256(bytes(batchCerts[i].certId)) == keccak256(bytes(certId))) {
                batchCerts[i].isRevoked = true;
                break;
            }
        }

        emit CertificateRevoked(certId, reason);
    }

    /**
     * @dev Get all certificates for a batch.
     */
    function getCertificates(string memory batchId) external view returns (Certificate[] memory) {
        return _batchCertificates[batchId];
    }

    /**
     * @dev Validate if a specfic cert is valid.
     */
    function validateCertificate(string memory certId) external view returns (bool isValid, Certificate memory certDetails) {
        if (!_certExists[certId]) revert CertNotFound();
        
        Certificate memory cert = _certificatesById[certId];
        bool isNotExpired = cert.expiresAt == 0 || cert.expiresAt > block.timestamp;
        isValid = !cert.isRevoked && isNotExpired;
        
        return (isValid, cert);
    }

    /**
     * @dev Check if a batch has at least one valid certificate.
     */
    function isBatchCertified(string memory batchId) external view returns (bool) {
        Certificate[] memory certs = _batchCertificates[batchId];
        
        for (uint i = 0; i < certs.length; i++) {
            if (!certs[i].isRevoked && (certs[i].expiresAt == 0 || certs[i].expiresAt > block.timestamp)) {
                return true;
            }
        }
        return false;
    }
}
