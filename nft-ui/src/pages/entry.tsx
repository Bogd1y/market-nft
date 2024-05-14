import { useAccount, useReadContract } from 'wagmi'
import { marketAbi } from '../types/marketAbi'
import useGetOrders from '../lib/query';
import SellOrderPreviewG from '../components/SellOrderPreviewG';

// export const MarketAddress = "0xDDa2BF4248fbA74F2effdD64a998d926E5071468" // deprectd
// export const MarketAddress = "0x0ED71E748c44eF5b14965BA9BfAF2fB640ddA5Fc" // depre
export const MarketAddress = "0x632D50611CFde37c2f07D7DF676AD4643804887c"
export const NftAddress = "0x87472da60A48927Db61bbd566d844DF8acD84A0c"

function Entry() {
  const account = useAccount()
  const orders = useGetOrders()

  console.log("GRAPH QL", orders.data?.createSellOrders);
  
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
    {/* <div className="w-full text-center text-white mt-20 font-semibold mb-10">SELL ORDERS</div>
    {data?.length ? <div className='flex flex-wrap gap-4'> {data.filter(d => d.status == 2).map((i, index) => <SellOrderPreview key={index} order={i} />)} </div> : <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>} */}
    <div className="w-full text-center text-white mt-10 font-semibold mb-10">SELL ORDERS G</div>
    {orders.data?.createSellOrders?.length ? <div className='flex flex-wrap gap-4 mb-10'> {orders.data?.createSellOrders.map((i, index) => <SellOrderPreviewG key={index} order={i} />)} </div> : <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>}
    {/* <div className="w-full text-center text-white mt-20 font-semibold mb-10">Buy ORDERS</div>
    {buyData?.length ? buyData.map((i, index) => <BuyOrderPreview key={index} order={i} /> ): <div className='w-full text-center text-white mt-20 font-semibold mb-10'>NO ORDERS YET</div>} */}

  </div>
 )
}

export default Entry
