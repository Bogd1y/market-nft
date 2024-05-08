import { http, createConfig, webSocket } from 'wagmi'
import { localhost, mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  // chains: [mainnet, sepolia],
  chains: [localhost],
  // connectors: [
  //   injected(),
  //   coinbaseWallet({ appName: 'Create Wagmi' }),
  //   walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  // ],
  transports: {
    // [mainnet.id]: http(),
    // [sepolia.id]: http(),
    [localhost.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
