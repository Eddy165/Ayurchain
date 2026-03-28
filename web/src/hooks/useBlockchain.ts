import { usePublicClient, useWalletClient } from 'wagmi'
import { CONTRACT_ADDRESSES } from '../contracts/addresses'
import BatchTrackerABI   from '../contracts/abis/BatchTracker.json'
import FarmerRegistryABI from '../contracts/abis/FarmerRegistry.json'
import CertificationABI  from '../contracts/abis/Certification.json'
import OwnershipTransferABI from '../contracts/abis/OwnershipTransfer.json'
import { CreateBatchInput } from '../types/batch.types'

export function useBlockchain() {
  const publicClient  = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // ── BATCH TRACKER ────────────────────────────────────────

  const createBatch = async (input: CreateBatchInput): Promise<string> => {
    const hash = await walletClient!.writeContract({
      address: CONTRACT_ADDRESSES.BatchTracker,
      abi: BatchTrackerABI.abi,
      functionName: 'createBatch',
      args: [
        input.herbName,
        BigInt(input.quantity),
        input.harvestLocation.state,
        input.harvestDate,
        input.ipfsCIDs[0] ?? '',
      ],
    })
    const receipt = await publicClient!.waitForTransactionReceipt({ hash, timeout: 30_000 })
    return receipt.transactionHash
  }

  const updateBatchStage = async (
    contractBatchId: string,
    newStage: number,
    ipfsCID: string
  ): Promise<string> => {
    const hash = await walletClient!.writeContract({
      address: CONTRACT_ADDRESSES.BatchTracker,
      abi: BatchTrackerABI.abi,
      functionName: 'updateStage',
      args: [contractBatchId, BigInt(newStage), ipfsCID],
    })
    const receipt = await publicClient!.waitForTransactionReceipt({ hash })
    return receipt.transactionHash
  }

  const getBatchHistory = async (contractBatchId: string) => {
    return publicClient!.readContract({
      address: CONTRACT_ADDRESSES.BatchTracker,
      abi: BatchTrackerABI.abi,
      functionName: 'getBatchHistory',
      args: [contractBatchId],
    })
  }

  const verifyBatch = async (contractBatchId: string): Promise<boolean> => {
    const result = await publicClient!.readContract({
      address: CONTRACT_ADDRESSES.BatchTracker,
      abi: BatchTrackerABI.abi,
      functionName: 'verifyBatch',
      args: [contractBatchId],
    }) as boolean
    return result
  }

  // ── OWNERSHIP TRANSFER ───────────────────────────────────

  const transferOwnership = async (
    contractBatchId: string,
    toAddress: `0x${string}`
  ): Promise<string> => {
    const hash = await walletClient!.writeContract({
      address: CONTRACT_ADDRESSES.OwnershipTransfer,
      abi: OwnershipTransferABI.abi,
      functionName: 'transfer',
      args: [contractBatchId, toAddress],
    })
    const receipt = await publicClient!.waitForTransactionReceipt({ hash })
    return receipt.transactionHash
  }

  // ── CERTIFICATION ────────────────────────────────────────

  const issueCertification = async (
    contractBatchId: string,
    certHash: string
  ): Promise<string> => {
    const hash = await walletClient!.writeContract({
      address: CONTRACT_ADDRESSES.Certification,
      abi: CertificationABI.abi,
      functionName: 'certify',
      args: [contractBatchId, certHash],
    })
    const receipt = await publicClient!.waitForTransactionReceipt({ hash })
    return receipt.transactionHash
  }

  // ── FARMER REGISTRY ──────────────────────────────────────

  const registerFarmer = async (
    farmerAddress: `0x${string}`,
    metadataHash: string
  ): Promise<string> => {
    const hash = await walletClient!.writeContract({
      address: CONTRACT_ADDRESSES.FarmerRegistry,
      abi: FarmerRegistryABI.abi,
      functionName: 'register',
      args: [farmerAddress, metadataHash],
    })
    const receipt = await publicClient!.waitForTransactionReceipt({ hash })
    return receipt.transactionHash
  }

  return {
    createBatch, updateBatchStage, getBatchHistory, verifyBatch,
    transferOwnership, issueCertification, registerFarmer,
  }
}
