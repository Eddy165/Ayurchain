import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BatchTracker } from "../typechain-types"; // Needs compilation first

describe("BatchTracker Contract", function () {
  let batchTracker: any; // Using any to avoid typechain required compilation errors immediately
  let admin: HardhatEthersSigner;
  let processor: HardhatEthersSigner;
  let unauth: HardhatEthersSigner;

  beforeEach(async function () {
    [admin, processor, unauth] = await ethers.getSigners();
    
    const BatchTracker = await ethers.getContractFactory("BatchTracker");
    batchTracker = await BatchTracker.deploy();
    await batchTracker.waitForDeployment();

    const PROCESSOR_ROLE = await batchTracker.PROCESSOR_ROLE();
    await batchTracker.grantRole(PROCESSOR_ROLE, processor.address);
  });

  it("Should create a batch successfully", async function () {
    const tx = await batchTracker.connect(admin).createBatch(
      "BATCH-001",
      "FARMER-123",
      "Ashwagandha",
      "Kerala",
      1711500000,
      "500kg",
      "ipfsHash123"
    );
    await tx.wait();

    const batch = await batchTracker.getBatch("BATCH-001");
    expect(batch.batchId).to.equal("BATCH-001");
    expect(batch.herbName).to.equal("Ashwagandha");
    expect(batch.currentStage).to.equal(0); // FarmHarvest
  });

  it("Should transfer batch to Processing stage by authorized processor", async function () {
    await batchTracker.connect(admin).createBatch(
        "BATCH-002",
        "FARMER-123",
        "Tulsi",
        "Assam",
        1711500000,
        "200kg",
        "ipfsHash1"
    );

    const tx = await batchTracker.connect(processor).transferBatch(
        "BATCH-002",
        1, // Processing
        "PROC-999",
        "Processed successfully",
        "ipfsHash2"
    );
    await tx.wait();

    const batch = await batchTracker.getBatch("BATCH-002");
    expect(batch.currentStage).to.equal(1);
    
    const history = await batchTracker.getBatchHistory("BATCH-002");
    expect(history.length).to.equal(2);
    expect(history[1].stage).to.equal(1);
    expect(history[1].notes).to.equal("Processed successfully");
  });

  it("Should reject transfer if caller does not have required role", async function () {
    await batchTracker.connect(admin).createBatch(
        "BATCH-003",
        "FARMER-123",
        "Neem",
        "Delhi",
        1711500000,
        "100kg",
        "ipfsHash3"
    );

    await expect(
        batchTracker.connect(unauth).transferBatch(
            "BATCH-003",
            1, // Processing
            "PROC-000",
            "Failing transfer",
            "ipfsHashFail"
        )
    ).to.be.revertedWithCustomError(batchTracker, "UnauthorizedStageTransfer");
  });
});
