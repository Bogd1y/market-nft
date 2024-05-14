import React, { useEffect, useState } from 'react'
import useGetOrders, { QueryData } from '../lib/query';
import { useReadContract, useWriteContract } from 'wagmi';
import { marketAbi } from '../types/marketAbi';
import { MarketAddress } from '../pages/entry';
import { config } from '../wagmi';
import { readContract } from 'wagmi/actions';
import { useAccount } from 'wagmi';
import SellOrderPreview from './SellOrderPreview';
import SellOrderPreviewG from './SellOrderPreviewG';

const BuyOrdersForMe = () => {

  const orders = useGetOrders()

  // const { data: imgB64} = useReadContract({
  //   abi: marketAbi,
  //   address: MarketAddress,
  //   functionName: "buyOrdersBinded",
  //   args: []
  // })

  const [sellOrdersData, setSellOrdersData] = useState<[]>([]);
  const account = useAccount()
  
  return (
    <div className="text-whiteish p-10 flex flex-col justify-center items-start gap-3"> 
    {orders.data?.createSellOrders.length ? orders.data?.createSellOrders.filter(i => i._who == account.address?.toLocaleLowerCase()).map(i => (
      <div key={i.id} className="flex gap-3">
        <SellOrderPreviewG order={i}  />
        <BuyOrders i={i}/>
      </div>
    )) 
      : <div>No orders for you yet</div>}
    </div>
  )
}
type createSellOrder = {
  id: string
  blockNumber: string
  blockTimestamp: string
  _tokenId: string
  _address: string
  _orderId: string
  _who: string
}

type createBuyOrders = {
  id: string
  _orderId: string
  blockNumber: string
  blockTimestamp: string
}
const BuyOrders = ({i}: {i: createSellOrder}) => {

  const orders = useGetOrders()
  const { data: hash, error, writeContract} = useWriteContract()

  const stat = useReadContract({
    abi: marketAbi,
    address: MarketAddress,
    functionName: "sellOrders",
    args: [BigInt(i._orderId)]
  })

  const [buyOrders, setBuyOrders] = useState<{sId: bigint, dPrice: bigint, bId: bigint}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!orders.data?.createBuyOrders) return
      const temp = await Promise.all(orders.data?.createBuyOrders.map(async buyOrder => {
        const data = await readContract(config, {
          abi: marketAbi,
          address: MarketAddress,
          functionName: "buyOrders",
          args: [BigInt(buyOrder._orderId)]
        });
        // return { ...buyOrder, sellOrderId: data };
        // return { ...buyOrder, sellOrderId: data[0] };
        console.log(data);
        
        return {sId: data[5], dPrice: data[0], bId: data[1]};
      }));
      setBuyOrders(temp);
    };
    fetchData();
  }, [orders.data]);

  const handleFulfill = (oId: bigint) => {
    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "fulfill",
      args: [oId]
    }, {
      onError(error, variables, context) {
        console.error(error);
      },
    })
  }
  console.log(stat.data?.[2]);
  
  return (
    <div className='flex flex-col gap-2'>{buyOrders.filter(d => Number(d.sId) == +i._orderId).map(i => <div key={i.bId}>
      <div className="bg-gray p-2 rounded shadow font-medium flex gap-1">
        Buy order for: OID {Number(i.sId)} PRice: {Number(i.dPrice)} <div onClick={() => handleFulfill(BigInt(i.bId))} className="font-bold text-bluish cursor-pointer">Fulfill</div>
      </div>
    </div>)}</div>
  )
}


export default BuyOrdersForMe