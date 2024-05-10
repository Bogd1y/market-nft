import { useQuery } from "@tanstack/react-query";
import { request, gql } from "graphql-request";

const QUERY = gql`
  query MyQuery {
    createSellOrders(first: 5) {
      id
      blockNumber
      blockTimestamp
      _tokenId
      _address
    }
    cancelSells(first: 5) {
      id
      _orderId
      blockNumber
      blockTimestamp
    }
  }
`;

interface QueryData {
  createSellOrders: {
    id: string
    blockNumber: string
    blockTimestamp: string
    _tokenId: string
    _address: string

  }[];
}

const fetchData = async (): Promise<QueryData> => {
  // const data = await request("https://api.studio.thegraph.com/query/74495/testsubgraph/v0.0.1", QUERY);
  const data = await request("https://api.studio.thegraph.com/query/74495/testsubgraph/v0.0.2", QUERY);
  return data as QueryData;
};

const useGetOrders = () => {
  return useQuery<QueryData>({queryKey: ["myQuery"], queryFn: fetchData});
};

export default useGetOrders;