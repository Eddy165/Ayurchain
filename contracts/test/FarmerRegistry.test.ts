import { expect } from "chai";
import { ethers } from "hardhat";

describe("FarmerRegistry", function () {
  let farmerRegistry: any;
  let admin: any;
  let certifier: any;

  beforeEach(async function () {
    const [owner, certifierAccount] = await ethers.getSigners();
    admin = owner;
    certifier = certifierAccount;

    const FarmerRegistry = await ethers.getContractFactory("FarmerRegistry");
    farmerRegistry = await FarmerRegistry.deploy();

    await farmerRegistry.grantRole(await farmerRegistry.CERTIFIER_ROLE(), certifier.address);
  });

  describe("registerFarmer", function () {
    it("Should register a new farmer and emit event", async function () {
      const aadhaarHash = ethers.id("123456789012");
      const tx = await farmerRegistry.registerFarmer(
        "0xfarmerAddress",
        "Ramesh Kumar",
        "Kerala",
        "Ashwagandha, Tulsi",
        aadhaarHash
      );

      await expect(tx)
        .to.emit(farmerRegistry, "FarmerRegistered")
        .withArgs("0xfarmerAddress", "Ramesh Kumar", await ethers.provider.getBlock(tx.blockNumber).then(b => b?.timestamp));

      const farmer = await farmerRegistry.getFarmer("0xfarmerAddress");
      expect(farmer.name).to.equal("Ramesh Kumar");
      expect(farmer.isVerified).to.equal(false);
    });
  });

  describe("verifyFarmer", function () {
    beforeEach(async function () {
      const aadhaarHash = ethers.id("123456789012");
      await farmerRegistry.registerFarmer(
        "0xfarmerAddress",
        "Ramesh Kumar",
        "Kerala",
        "Ashwagandha",
        aadhaarHash
      );
    });

    it("Should allow only certifier to verify a farmer", async function () {
      const tx = await farmerRegistry.connect(certifier).verifyFarmer("0xfarmerAddress");

      await expect(tx)
        .to.emit(farmerRegistry, "FarmerVerified")
        .withArgs("0xfarmerAddress", certifier.address);

      const isVerified = await farmerRegistry.isFarmerVerified("0xfarmerAddress");
      expect(isVerified).to.equal(true);
    });

    it("Should revert if non-certifier tries to verify", async function () {
      await expect(
        farmerRegistry.connect(admin).verifyFarmer("0xfarmerAddress")
      ).to.be.revertedWithCustomError(farmerRegistry, "AccessControlUnauthorizedAccount");
    });
  });

  describe("isFarmerVerified", function () {
    it("Should return boolean status of verification", async function () {
      const aadhaarHash = ethers.id("1234");
      await farmerRegistry.registerFarmer("0x123", "Amit", "Delhi", "Neem", aadhaarHash);
      
      expect(await farmerRegistry.isFarmerVerified("0x123")).to.equal(false);
      
      await farmerRegistry.connect(certifier).verifyFarmer("0x123");
      expect(await farmerRegistry.isFarmerVerified("0x123")).to.equal(true);
    });
  });
});
