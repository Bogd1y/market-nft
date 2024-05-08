import { useAccount, useConnect, useDisconnect } from "wagmi"


const Header = () => {
  
  const account = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, connect, status, error } = useConnect()

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