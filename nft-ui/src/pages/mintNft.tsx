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
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY0c8swp0p1RekkTQ5lgfyu4TiVWjVpHLK2w&usqp=CAU',
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