import React, { useState } from 'react'
import { MarketAddress, NftAddress } from './entry';
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import toast from 'react-hot-toast';
import { marketAbi } from '../types/marketAbi';
import { BaseError } from 'viem';
import { nftAbi } from '../types/nftAbi';
import Moralis from 'moralis';
import { NftItem } from '../types/moralis';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '../wagmi';

const CreateSellOrder = () => {

  const [userTokens, setUserTokens] = useState<NftItem[] | []>([]);
  const { data: hash, error, writeContract, writeContractAsync } = useWriteContract()
  const { isSuccess: isConfirmed,  } = useWaitForTransactionReceipt({
    hash,
  })

  
  const account = useAccount()
  
  const [formData, setFormData] = useState({
    nftAddress: NftAddress,
    tokenId: '',
    desiredPrice: '',
  });
  
  const result = useReadContract({
    abi: nftAbi,
    address: NftAddress,
    functionName: 'getApproved',
    args: [BigInt(formData.tokenId)]
  })

  console.log(result.data, MarketAddress);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!account.address) return toast.error("no acc")

    e.preventDefault();

    const d = await writeContractAsync({
      abi: nftAbi,
      address: NftAddress,
      functionName: "approve",
      args: [MarketAddress, BigInt(formData.tokenId)]
    }, {
      onError: (e) => {
        console.error(e.message);
      },
    })

    await waitForTransactionReceipt(config, {
      hash: d
    })

    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "createSellOrder",
      args: [formData.nftAddress as `0x${string}`, BigInt(formData.tokenId), BigInt(formData.desiredPrice)]
    })
    if (error) {
      console.error(error?.message);
    }
    
  };
  
  const fetchData = async () => {

    if (!account.address) return toast("No cc ")
    
    try {

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        "chain": "0xaa36a7",
        "format": "decimal",
        "mediaItems": false,
        "address": account.address
      });

      console.log(response.raw);
      //@ts-ignore
      setUserTokens(response.raw.result as NftItem[])
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex items-start justify-center mt-20">
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
      <div className="h-[408px] bg-gray rounded-r p-5 relative -left-5 pl-10 shadow-gray shadow text-whiteish overflow-y-auto max-w-64 overflow-x-hidden text-ellipsis whitespace-nowrap">
      {userTokens?.length ? userTokens.map(i => <div key={i.token_hash} className='flex gap-3 cursor-pointer items-center' onClick={() => {
        setFormData({ desiredPrice: '0', nftAddress: i.token_address, tokenId: i.token_id });
      }}>
        <div className="size-10 object-cover">
          <img src={i.token_uri} alt="NFT" />
          </div>
        <div>{i.token_id}</div>
      </div>) :
        <div onClick={fetchData}>Get</div>}
      </div>
    </div>
  )
}

export default CreateSellOrder