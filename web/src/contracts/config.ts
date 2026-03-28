import { http, createConfig } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [polygonMumbai],
  connectors: [metaMask()],
  transports: {
    [polygonMumbai.id]: http(import.meta.env.VITE_POLYGON_RPC),
  },
})
