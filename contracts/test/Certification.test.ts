import { expect } from "chai";
import { ethers } from "hardhat";

describe("Certification", () => {
  let cert: any;
  let admin: any;
  let certifierAccount: any;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    admin = signers[0];
    certifierAccount = signers[1];

    const Certification = await ethers.getContractFactory("Certification");
    cert = await Certification.deploy();

    await cert.grantRole(await cert.CERTIFIER_ROLE(), certifierAccount.address);
  });

  it("adds and revokes certificate", async () => {
    const batchId = "BATCH-2";
    const certId = "CERT-001";
    const validUntil = Math.floor(Date.now() / 1000) + 3600;

    await expect(
      cert.connect(certifierAccount).issueCertificate(
        certId,
        batchId,
        "Ayush Dept",
        "AYUSH_GMP",
        "ipfs://cert-hash",
        validUntil
      )
    )
      .to.emit(cert, "CertificateIssued")
      .withArgs(certId, batchId, certifierAccount.address, "AYUSH_GMP");

    await expect(
      cert.connect(certifierAccount).revokeCertificate(certId, "Expired")
    )
      .to.emit(cert, "CertificateRevoked")
      .withArgs(certId, "Expired");

    const certs = await cert.getCertificates(batchId);
    expect(certs.length).to.equal(1);
    expect(certs[0].isRevoked).to.equal(true);
  });
});
