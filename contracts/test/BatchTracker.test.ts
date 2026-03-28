import { expect } from "chai";
import { ethers } from "hardhat";

describe("BatchTracker", function () {
  let batchTracker: any;
  let admin: any;
  let processor: any;
  let lab: any;
  let certifier: any;

  beforeEach(async function () {
    const [owner, processorAccount, labAccount, certifierAccount] = await ethers.getSigners();
    admin = owner;
    processor = processorAccount;
    lab = labAccount;
    certifier = certifierAccount;

    const BatchTracker = await ethers.getContractFactory("BatchTracker");
    batchTracker = await BatchTracker.deploy();

    // Grant roles
    await batchTracker.grantRole(await batchTracker.PROCESSOR_ROLE(), processor.address);
    await batchTracker.grantRole(await batchTracker.LAB_ROLE(), lab.address);
    await batchTracker.grantRole(await batchTracker.CERTIFIER_ROLE(), certifier.address);
  });

  describe("createBatch", function () {
    it("Should create a new batch and emit an event", async function () {
      const tx = await batchTracker.createBatch(
        "batch1",
        "farmer1",
        "Ashwagandha (Withania somnifera)",
        "Kerala, India",
        1690000000,
        "100 kg",
        "QHashxyz"
      );

      await expect(tx)
        .to.emit(batchTracker, "BatchCreated")
        .withArgs("batch1", "farmer1", "Ashwagandha (Withania somnifera)", await ethers.provider.getBlock(tx.blockNumber).then(b => b?.timestamp));

      const batch = await batchTracker.getBatch("batch1");
      expect(batch.herbName).to.equal("Ashwagandha (Withania somnifera)");
      expect(batch.currentStage).to.equal(0); // Stage.FarmHarvest
    });
  });

  describe("transferBatch", function () {
    beforeEach(async function () {
      await batchTracker.createBatch(
        "batch1",
        "farmer1",
        "Ashwagandha",
        "Kerala",
        1690000000,
        "100 kg",
        "QHashxyz"
      );
    });

    it("Should allow a processor to transfer the batch to Processing stage", async function () {
      const tx = await batchTracker.connect(processor).transferBatch(
        "batch1",
        1, // Stage.Processing
        "processor1",
        "Processed into powder",
        "QHashProcessed"
      );

      await expect(tx)
        .to.emit(batchTracker, "BatchTransferred")
        .withArgs("batch1", 1, processor.address);

      const stage = await batchTracker.getBatchStage("batch1");
      expect(stage).to.equal(1);
    });
  });

  describe("getBatchHistory", function () {
    beforeEach(async function () {
      await batchTracker.createBatch(
        "batch1",
        "farmer1",
        "Ashwagandha",
        "Kerala",
        1690000000,
        "100 kg",
        "QHashxyz"
      );
    });

    it("Should return an array of transfer events", async function () {
      await batchTracker.connect(processor).transferBatch(
        "batch1",
        1, // Stage.Processing
        "processor1",
        "Processed",
        "QHashP"
      );

      const history = await batchTracker.getBatchHistory("batch1");
      expect(history.length).to.equal(2);
      expect(history[0].stage).to.equal(0);
      expect(history[1].stage).to.equal(1);
    });
  });
});
