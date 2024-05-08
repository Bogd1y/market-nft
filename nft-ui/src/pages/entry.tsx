import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { marketAbi } from '../types/marketAbi'
import SellOrderPreview from '../components/SellOrderPreview'
import BuyOrderPreview from '../components/BuyOrderPreview'

export const MarketAddress = "0xB45052DD52e14591C5cb4307e8fbd4bC11608f20"
export const NftAddress = "0x5f401c9cF95cB75bC8B28981D3d77b6513Ad652A"

function Entry() {
  const account = useAccount()

  const { data } = useReadContract({
    abi: marketAbi,
    address: MarketAddress,
    functionName: "getAllSellOrders"
  })

  const { data: buyData } = useReadContract({
    abi: marketAbi,
    address: MarketAddress,
    functionName: "getAllBuyOrders"
  })
  
 return (
  <div className='max-w-4xl mx-auto'>
    <div className="w-full text-center text-white mt-20 font-semibold mb-10">SELL ORDERS</div>
    {data?.length ? data.map(i => <SellOrderPreview key={i.orderId} order={i} /> ): <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>}
    <div className="w-full text-center text-white mt-20 font-semibold mb-10">Buy ORDERS</div>
    {buyData?.length ? buyData.map(i => <BuyOrderPreview key={i.orderId} order={i} /> ): <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>}
  </div>
 )
}

export default Entry

// return (
//   <>
//     <div>
//       <h2>Account</h2>

//       <div>
//         status: {account.status}
//         <br />
//         addresses: {JSON.stringify(account.addresses)}
//         <br />
//         chainId: {account.chainId}
//       </div>

//       {account.status === 'connected' && (
//         <button type="button" onClick={() => disconnect()}>
//           Disconnect
//         </button>
//       )}
//     </div>

//     <div>
//       <h2>Connect</h2>
//       {connectors.map((connector) => (
//         <button
//           key={connector.uid}
//           onClick={() => connect({ connector })}
//           type="button"
//         >
//           {connector.name}
//         </button>
//       ))}
//       <div>{status}</div>
//       <div>{error?.message}</div>
//     </div>
//   </>
// )