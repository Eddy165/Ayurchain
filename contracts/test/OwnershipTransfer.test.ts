import { expect } from "chai";
import { ethers } from "hardhat";

describe("OwnershipTransfer", () => {
  let transfer: any;
  let admin: any;
  let owner: any;
  let receiver: any;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    admin = signers[0];
    owner = signers[1];
    receiver = signers[2];

    const OwnershipTransfer = await ethers.getContractFactory("OwnershipTransfer");
    transfer = await OwnershipTransfer.deploy(ethers.ZeroAddress);
  });

  it("logs transfer and enforces current owner", async () => {
    const batchId = "BATCH-3";

    await transfer.connect(admin).setInitialOwner(batchId, owner.address);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const beforeTimestamp = block?.timestamp || 0;

    const tx = await transfer.connect(owner).initiateTransfer(
      batchId,
      "processorEntity",
      "retailerEntity",
      receiver.address,
      "Transferred to retailer",
      2, // LabTesting enum or whatever
      "ipfs://transfer"
    );

    await expect(tx)
      .to.emit(transfer, "OwnershipTransferred")
      .withArgs(
        batchId,
        owner.address,
        receiver.address,
        (timestamp: bigint) => timestamp >= beforeTimestamp
      );

    const currentOwner = await transfer.getCurrentOwner(batchId);
    expect(currentOwner).to.equal(receiver.address);
  });
});