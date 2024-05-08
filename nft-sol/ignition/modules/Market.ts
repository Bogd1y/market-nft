import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";


const MarketModule = buildModule("MarketModule", (m) => {

  const Market = m.contract("Market", [], {});
  const NFT = m.contract("MyNFT", [], {});

  return { Market, NFT };
});

export default MarketModule;
