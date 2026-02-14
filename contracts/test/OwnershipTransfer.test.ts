import { expect } from "chai";
import { ethers } from "hardhat";

describe("OwnershipTransfer", () => {
  it("logs transfer and enforces current owner", async () => {
    const [admin, owner, receiver] = await ethers.getSigners();
    const OwnershipTransfer = await ethers.getContractFactory(
      "OwnershipTransfer"
    );
    const transfer = await OwnershipTransfer.connect(admin).deploy(
      admin.address
    );
    await transfer.waitForDeployment();

    const batchId = ethers.id("BATCH-3");

    await transfer
      .connect(admin)
      .initializeOwner(batchId, owner.address);

    // Get the block timestamp before the transfer
    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const beforeTimestamp = block?.timestamp || 0;

    // Execute transfer and wait for event
    const tx = await transfer
      .connect(owner)
      .logTransfer(batchId, receiver.address, "ipfs://transfer");
    
    const receipt = await tx.wait();
    
    // Check event was emitted
    await expect(tx)
      .to.emit(transfer, "TransferLogged")
      .withArgs(
        batchId,
        owner.address,
        receiver.address,
        "ipfs://transfer",
        (timestamp: bigint) => timestamp >= beforeTimestamp
      );

    // Verify current owner was updated
    const currentOwner = await transfer.currentOwner(batchId);
    expect(currentOwner).to.equal(receiver.address);
  });
});