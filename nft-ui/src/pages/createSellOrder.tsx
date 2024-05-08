import React, { useState } from 'react'
import { MarketAddress, NftAddress } from './entry';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import toast from 'react-hot-toast';
import { marketAbi } from '../types/marketAbi';
import { BaseError } from 'viem';
import { nftAbi } from '../types/nftAbi';

const CreateSellOrder = () => {

  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract()
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  const account = useAccount()

  const [formData, setFormData] = useState({
    nftAddress: NftAddress,
    tokenId: '',
    desiredPrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!account.address) return toast.error("no acc")

    e.preventDefault();

    await writeContractAsync({
      abi: nftAbi,
      address: NftAddress,
      functionName: "approve",
      args: [MarketAddress, BigInt(formData.tokenId)]
    })


    await writeContractAsync({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "createSellOrder",
      args: [formData.nftAddress as `0x${string}`, BigInt(formData.tokenId), BigInt(formData.desiredPrice)]
    })
    if (error) {
      console.error(error?.message);
    }
    
  };
  
  return (
    <div className="flex items-center justify-center mt-20">
      <form onSubmit={handleSubmit} className='bg-gray shadow text-whiteish shadow-gray p-5 rounded-xl flex flex-col gap-5 min-w-[400px]'>
        <h1 className='text-center text-2xl mb-2 font-medium'>Create Sell Order</h1>

        <div className="flex gap-2 flex-col ">
          <label htmlFor="nftAddress">NFT C address</label>
          <input 
          value={formData.nftAddress}
          onChange={handleChange} 
          type="text" id='nftAddress' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        <div className="flex gap-2 flex-col ">
          <label htmlFor="tokenId">Token id</label>
          <input 
          value={formData.tokenId}
          onChange={handleChange}           
          type="text" id='tokenId' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        <div className="flex gap-2 flex-col ">
          <label htmlFor="desiredPrice">Desired price</label>
          <input
          value={formData.desiredPrice}
          onChange={handleChange}                       
          type="number" id='desiredPrice' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        {isConfirmed && <p className='text-green-500 text-xs'>Transaction confirmed.</p>}
        {error && <p className='text-red-500 text-xs'>{(error as BaseError).shortMessage || error.message}</p>}

        <button type="submit" className="bg-bluish transition-all hover:bg-blue-600 mt-4 text-white py-2 rounded">
          Create Sell Order
        </button>
      </form>
    </div>
  )
}

export default CreateSellOrder