import { expect } from "chai";
import { ethers } from "hardhat";

describe("FarmerRegistry", () => {
  it("registers a farmer and updates KYC", async () => {
    const [admin, farmer] = await ethers.getSigners();
    const FarmerRegistry = await ethers.getContractFactory("FarmerRegistry");
    const registry = await FarmerRegistry.connect(admin).deploy(admin.address);
    await registry.waitForDeployment();

    await expect(
      registry.connect(farmer).registerFarmer("ipfs://farmer-metadata")
    )
      .to.emit(registry, "FarmerRegistered")
      .withArgs(farmer.address, "ipfs://farmer-metadata");

    await expect(
      registry
        .connect(admin)
        .updateKYC(farmer.address, 1) // Approved
    )
      .to.emit(registry, "FarmerKYCUpdated")
      .withArgs(farmer.address, 1);

    const stored = await registry.getFarmer(farmer.address);
    expect(stored.wallet).to.equal(farmer.address);
    expect(stored.kycStatus).to.equal(1n);
  });
});

