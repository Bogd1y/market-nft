import React, { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { marketAbi } from '../types/marketAbi';
import { MarketAddress } from './entry';
import { useLocation } from 'react-router-dom';

const CreateBuyOrder = () => {

  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract()
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const { state } = useLocation();
  
  const account = useAccount()

  const [formData, setFormData] = useState({
    orderId: state?.orderId?.toString() || 0,
    desiredPrice: state?.desiredPrice.toString() || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "createBuyOrder",
      args: [BigInt(formData.orderId), BigInt(formData.desiredPrice)],
      // value: BigInt(formData.desiredPrice)
    }, {
      onError: (error) => {
        console.error(error.message);
      }
    })
  };
  
  return (
    <div className="flex items-center justify-center mt-20">
      <form action="" onSubmit={handleSubmit} className='bg-gray shadow text-whiteish shadow-gray p-5 rounded-xl flex flex-col gap-5 min-w-[400px]'>
        <h1 className='text-center text-2xl mb-2 font-medium'>Create Buy Order</h1>

        <div className="flex gap-2 flex-col ">
          <label htmlFor="orderId">Order id</label>
          <input 
          value={formData.orderId}
          onChange={handleChange}           
          type="text" id='orderId' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        <div className="flex gap-2 flex-col ">
          <label htmlFor="desiredPrice">Desired price</label>
          <input
          value={formData.desiredPrice}
          onChange={handleChange}                       
          type="number" id='desiredPrice' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        <button type="submit" className="bg-bluish transition-all hover:bg-blue-600 mt-4 text-white py-2 rounded">
          Create Buy Order
        </button>
      </form>
    </div>
  )
}

export default CreateBuyOrder