import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { marketAbi } from '../types/marketAbi'
import SellOrderPreview from '../components/SellOrderPreview'
import BuyOrderPreview from '../components/BuyOrderPreview'
import Moralis from 'moralis';
import { useEffect, useId } from 'react';

export const MarketAddress = "0xDDa2BF4248fbA74F2effdD64a998d926E5071468"
export const NftAddress = "0x87472da60A48927Db61bbd566d844DF8acD84A0c"

function Entry() {
  const account = useAccount()
  const od = useId()

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
    {data?.length ? data.map(i => <SellOrderPreview key={od} order={i} /> ): <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>}
    <div className="w-full text-center text-white mt-20 font-semibold mb-10">Buy ORDERS</div>
    {buyData?.length ? buyData.map(i => <BuyOrderPreview key={od} order={i} /> ): <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>}
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