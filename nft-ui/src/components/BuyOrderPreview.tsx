import React from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { nftAbi } from '../types/nftAbi';
import { MarketAddress, NftAddress } from '../pages/entry';
import toast from 'react-hot-toast';
import { marketAbi } from '../types/marketAbi';
import { useNavigate } from "react-router-dom";

type orderT = {
  desiredPrice: bigint;
  orderId: bigint;
  status: number;
  tokenId: bigint;
  orderOwner: `0x${string}`;
  sellOrderId: bigint;
}

const BuyOrderPreview = ({order}: {order: orderT}) => {

  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract()
  const account = useAccount()
  const navigator = useNavigate()

  const { data: imgB64 } = useReadContract({
    abi: nftAbi,
    address: NftAddress,
    functionName: "tokenURI",
    args: [order.tokenId]
  })

  const handleBuy = () => {
    if (!account.address) return toast.error("no acc")

    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "buy",
      args: [order.orderId],
      value: order.desiredPrice 
    })
  }

  const handleNavigate = () => {
    navigator('/createBuy', {
      state: {
        orderId: order.orderId,
        desiredPrice: order.desiredPrice
      }
    })
  }
  
  return (
    <div className='bg-gray w-72 text-whiteish rounded-md flex-col flex mb-10'>
      <div className="text-center">{Number(order.tokenId)} : <span className='text-bluish font-medium'>{Number(order.desiredPrice)}</span> WEI </div>
      <img src={imgB64} alt="iamge" className='' />
      <div className="flex">
        <button onClick={handleBuy} className="w-full text-center py-1 bg-bluish rounded-b">Fullfill</button>
      </div>
    </div>
  )
}

export default BuyOrderPreview