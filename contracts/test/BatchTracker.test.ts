import { expect } from "chai";
import { ethers } from "hardhat";

describe("BatchTracker", () => {
  it("creates batch and emits events", async () => {
    const [admin, farmer] = await ethers.getSigners();
    const BatchTracker = await ethers.getContractFactory("BatchTracker");
    const tracker = await BatchTracker.connect(admin).deploy(admin.address);
    await tracker.waitForDeployment();

    const batchId = ethers.id("BATCH-1");

    await expect(
      tracker
        .connect(admin)
        .createBatch(batchId, farmer.address, "ipfs://batch-metadata")
    )
      .to.emit(tracker, "BatchCreated")
      .withArgs(batchId, farmer.address, "ipfs://batch-metadata");

    await expect(
      tracker
        .connect(admin)
        .addProcessingEvent(batchId, "ipfs://processing-1")
    )
      .to.emit(tracker, "ProcessingEventAdded")
      .withArgs(batchId, "ipfs://processing-1");

    await expect(
      tracker
        .connect(admin)
        .addLabReport(batchId, "ipfs://report-hash", "PASS")
    )
      .to.emit(tracker, "LabReportAdded")
      .withArgs(batchId, "ipfs://report-hash", "PASS");
  });
});

