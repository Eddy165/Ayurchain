import { expect } from "chai";
import { ethers } from "hardhat";

describe("Certification", () => {
  it("adds and revokes certificate", async () => {
    const [admin] = await ethers.getSigners();
    const Certification = await ethers.getContractFactory("Certification");
    const cert = await Certification.connect(admin).deploy(admin.address);
    await cert.waitForDeployment();

    const batchId = ethers.id("BATCH-2");
    const validUntil = Math.floor(Date.now() / 1000) + 3600;

    await expect(
      cert
        .connect(admin)
        .addCertificate(batchId, "ipfs://cert-hash", "AYUSH", validUntil)
    )
      .to.emit(cert, "CertificateAdded")
      .withArgs(batchId, "ipfs://cert-hash", "AYUSH", validUntil);

    await expect(
      cert
        .connect(admin)
        .revokeCertificate(batchId, 0, "ipfs://revoke-reason")
    )
      .to.emit(cert, "CertificateRevoked")
      .withArgs(batchId, 0, "ipfs://revoke-reason");

    const certs = await cert.getCertificates(batchId);
    expect(certs.length).to.equal(1);
    expect(certs[0].revoked).to.equal(true);
  });
});

