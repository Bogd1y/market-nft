import React, { useState } from 'react'
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { nftAbi } from '../types/nftAbi';
import { NftAddress } from './entry';
import toast from 'react-hot-toast';
import { BaseError } from 'viem';

const MintNft = () => {

  const { data: hash, error, writeContract } = useWriteContract()
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  const account = useAccount()

  const [formData, setFormData] = useState({
    uri: 'data:image/jpeg;base64,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',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!account.address) return toast.error("no acc")

    e.preventDefault();

    writeContract({
      abi: nftAbi,
      address: NftAddress,
      functionName: "safeMint",
      args: [account.address, formData.uri]
    })

  };
  
  return (
    <div className="flex items-center justify-center mt-20">
      <form onSubmit={handleSubmit} className='bg-gray shadow text-whiteish shadow-gray p-5 rounded-xl flex flex-col gap-5 min-w-[400px]'>
        <h1 className='text-center text-2xl mb-2 font-medium'>Mint</h1>


        <div className="flex gap-2 flex-col ">
          <label htmlFor="uri">Desired price</label>
          <input
          value={formData.uri}
          onChange={handleChange}                       
          type="text" id='uri' className='rounded text-dark px-2 font-medium py-1 shadow shadow-dark' />
        </div>

        {isConfirmed && <p className='text-green-500 text-xs'>Transaction confirmed.</p>}
        {error && <p className='text-red-500 text-xs'>{(error as BaseError).shortMessage}</p>}
        
        <button type="submit" className="bg-bluish transition-all hover:bg-blue-600 mt-4 text-white py-2 rounded">
            Mint
        </button>
      </form>
    </div>
  )
}

export default MintNft