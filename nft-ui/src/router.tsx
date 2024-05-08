import { createBrowserRouter } from "react-router-dom";
import Entry from "./pages/entry";
import CreateSellOrder from "./pages/createSellOrder";
import CreateBuyOrder from "./pages/createBuyOrder";
import MintNft from "./pages/mintNft";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Entry />
  },
  {
    path: '/createSell',
    element: <CreateSellOrder />
  },
  {
    path: '/createBuy',
    element: <CreateBuyOrder />
  },
  {
    path: '/mintNft',
    element: <MintNft />
  },
])