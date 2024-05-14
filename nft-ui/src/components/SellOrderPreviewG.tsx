import React, { useId } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { nftAbi } from '../types/nftAbi';
import { MarketAddress, NftAddress } from '../pages/entry';
import toast from 'react-hot-toast';
import { marketAbi } from '../types/marketAbi';
import { useNavigate } from "react-router-dom";

type orderT = {
  id: string,
  _orderId: string,
  blockNumber: string,
  blockTimestamp: string
}
// type orderT = {
//     id: string
//     blockNumber: string
//     blockTimestamp: string
//     _tokenId: string
//     _address: string
//   }

const SellOrderPreviewG = ({order}: {order: orderT}) => {

  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract()
  const account = useAccount()
  const navigator = useNavigate()

  const { data: orderok } = useReadContract({
    abi: marketAbi,
    address: MarketAddress,
    functionName: "sellOrders",
    args: [BigInt(order?._orderId)]
  })

  const { data: imgB64 } = useReadContract({
    abi: nftAbi,
    address: NftAddress,
    functionName: "tokenURI",
    args: [orderok?.[3] || 0n]
  })

  const handleBuy = () => {
    if (!account.address) return toast.error("no acc")
    if (!orderok?.length)  return toast.error("no")

    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "buy",
      args: [orderok[1]],
      value: orderok[0] 
    }, {
      onError: (e) => {
        console.error(e);
      }
    })
  }

  const handleNavigate = () => {
    if (!orderok?.length)  return toast.error("no")

    navigator('/createBuy', {
      state: {
        orderId: orderok[1],
        desiredPrice: orderok[0]
      }
    })
  }
  
  if(!orderok || orderok?.[2] !=2 ) return null

  return (
    <div className='bg-gray w-72 text-whiteish rounded-md flex-col flex'>
      <div className="text-center">{Number(orderok?.[1])} : <span className='text-bluish font-medium'>{Number(orderok?.[0])}</span> WEI </div>
      <img src={imgB64} alt="iamge" className='' />
      <div className="flex">
        {/* {order.status} */}
        <button onClick={handleBuy} className="w-2/4 text-center py-1 bg-bluish rounded-bl">Buy</button>
        <button onClick={handleNavigate} className="w-2/4 text-center py-1 ">Order</button>
      </div>
    </div>
  )
}

export default SellOrderPreviewG