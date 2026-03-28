import { useAccount, useConnect, useDisconnect, useBalance, useWalletClient } from 'wagmi'
import { metaMask } from 'wagmi/connectors'

export function useWallet() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { data: walletClient } = useWalletClient()

  const connectMetaMask = () => connect({ connector: metaMask() })

  const isCorrectNetwork = chainId === Number(import.meta.env.VITE_CHAIN_ID)

  const switchToPolygon = async () => {
    await walletClient?.switchChain({ id: Number(import.meta.env.VITE_CHAIN_ID) })
  }

  const truncatedAddress = address
    ? `${address.slice(0,6)}...${address.slice(-4)}`
    : null

  return {
    address, isConnected, isConnecting, balance, walletClient,
    connectMetaMask, disconnect, isCorrectNetwork, switchToPolygon,
    truncatedAddress,
  }
}
