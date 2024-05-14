import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract } from "wagmi"
import { marketAbi } from "../types/marketAbi"
import { MarketAddress } from "../pages/entry"


const Header = () => {
  
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, connect, status, error } = useConnect()
  const { data: hash, writeContract } = useWriteContract()

  const res = useReadContract({
    abi: marketAbi,
    address: MarketAddress,
    functionName: "balances",
    args: [account?.address || "0x0"]
  })

  const handleDep = () => {
    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "deposit",
      value: 100000000000000n
    })
  }

  const handleWithdraw = () => {
    writeContract({
      abi: marketAbi,
      address: MarketAddress,
      functionName: "withdraw",
      args: [100000000000000n]
    })
  }

  console.log(res.data);
  
  return (
    <nav>
      <ul className="flex items-center bg-bluish text-whiteish font-semibold text-base  justify-between gap-5 px-5 py-3">
        <div className="flex gap-5">
          <li className="inline-block w-fit relative mr-5">
            <a href="/" className="size-7 bg-blue-600 absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rounded-full"></a>
          </li>
          <li className="inline-block w-fit">
            <a href="/createBuy">Create buy order</a>
          </li>
          <li className="inline-block w-fit">
            <a href="/createSell">Create sell order</a>
          </li>
          <li className="inline-block w-fit">
            <a href="/mintNft">Mint nft </a>
          </li>
          <li className="inline-block w-fit">
            <a href="/proposes">Proposes </a>
          </li>
          <li className="w-fit flex gap-5">
            <div onClick={handleDep} className="cursor-pointer">Dep</div>
            <div className="">{(Number(res?.data) || 0) / 10**18}</div>
            <div onClick={handleWithdraw} className="cursor-pointer">Withdraw</div>
          </li>
        </div>
        {!account.address ? connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            Connect: {connector.name}
          </button>
        )) : <div className="w-24 truncate transition-all hover:w-[420px] text-sm">
          {account.address} <span className="cursor-pointer" onClick={() => disconnect()}>Disconnect</span>
        </div>}
        {/* <li onClick={} className="">
          Conect acc
        </li> */}
      </ul>

    </nav>
  )
}

export default Header