// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "./NFT.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IWETH is IERC20 {
  function deposit() external payable;

  function withdraw(uint256 _amount) external;
}

contract Market {

  event CreateSellOrder(address _address, uint256 _tokenId, uint _desiredPrice, address _who);
  event CreateBuyOrder(uint256 _orderId, uint _desiredPrice, address who);
  event DirectBuy(uint256 _orderId, address _who);
  event CancelSell(uint256 _orderId);
  event BuyOrderFulfill(uint256 _orderId ); // buyOrderId 

  enum Status {
    canceled,
    complete,
    pending
  }

  struct Order {
    uint desiredPrice;
    uint orderId;
    Status status;
    uint tokenId;
    address tokenAddress;    
    address orderOwner; // owner of ITS order
  }
  struct BuyOrder {
    uint desiredPrice; // new price
    uint orderId; // orderId of its order
    Status status; // status
    uint tokenId; // id of buyable token
    address orderOwner; // owner of ITS order
    uint sellOrderId; // id of sell order
  }

  address admin;

  mapping (address => bool) blackList;

  mapping (uint orderId => Order sellOrder) public sellOrders;
  mapping (uint sellOrderId => BuyOrder[] buyOrders) buyOrdersBinded; // when user buy directly from offer or fulfill buyOrder -- clear all buyOrders
  // buyOrderId => order
  mapping (uint orderId => BuyOrder buyOrder) public buyOrders; // when user buy directly from offer all buy
  
  uint public nextOrderId = 0;
  uint public nextBuyOrderId = 0;

  receive() external payable {}

  constructor() {
    admin = msg.sender;
  }

  function checkNFT(address _address) view public returns(bool isAllowed) {
    isAllowed = blackList[_address] == false;
  }

  function addToBlackList(address _address) public {
    require(msg.sender == admin, "Not him");
    blackList[_address] = true;
  }

  /// @notice create sell order (need approve for THAT token id)
  function createSellOrder(address _address, uint256 _tokenId, uint _desiredPrice) public {

    require(checkNFT(_address), "NFT not allowed");

    IERC721 nft = IERC721(_address);

    require(nft.ownerOf(_tokenId) == msg.sender, "You don't own this NFT");
    require(nft.getApproved(_tokenId) == address(this), "Not approved");

    sellOrders[nextOrderId] = Order(_desiredPrice, nextOrderId, Status.pending, _tokenId, _address, msg.sender);
    nextOrderId++;

    emit CreateSellOrder(_address, _tokenId, _desiredPrice, msg.sender);
  }

  /// @notice buy buy sellOrder - closes sellOrder AND all buyOrders to that token
  function buy(uint256 _orderId) public payable {
    require(sellOrders[_orderId].status == Status.pending, "No such in sale");
    require(msg.value >= sellOrders[_orderId].desiredPrice, "Where is money?");

    IERC721 nft = IERC721(sellOrders[_orderId].tokenAddress);
    // IWETH weth = IWETH(sellOrders[_orderId].tokenAddress);

    payable(nft.ownerOf(sellOrders[_orderId].tokenId)).transfer(sellOrders[_orderId].desiredPrice);

    nft.transferFrom(nft.ownerOf(sellOrders[_orderId].tokenId), msg.sender, sellOrders[_orderId].tokenId);
    // weth.transferFrom(msg.sender, nft.ownerOf(sellOrders[_orderId].tokenId), sellOrders[_orderId].desiredPrice);

    complete(_orderId);
    emit DirectBuy(_orderId, msg.sender);
  }

  /// @notice propose new price to sellOrder
  function createBuyOrder(uint256 _orderId, uint _desiredPrice) public payable {
    require(sellOrders[_orderId].status == Status.pending, "No such in sale");
    require(msg.value >= _desiredPrice, "Where is money?");

    buyOrders[nextBuyOrderId] = BuyOrder(_desiredPrice, nextBuyOrderId, Status.pending, sellOrders[_orderId].tokenId, msg.sender, _orderId);
    buyOrdersBinded[_orderId].push(buyOrders[nextBuyOrderId]);
    nextBuyOrderId++;
    emit CreateBuyOrder(_orderId, _desiredPrice, msg.sender);
  }

  /// @notice cancel sell order
  function cancelSell(uint _orderId) public {

    require(sellOrders[_orderId].status == Status.pending, "No such in sale");
    require(sellOrders[_orderId].orderOwner == msg.sender, "You are not owner");

    complete(_orderId);
    emit CancelSell(_orderId);
  }

  /// @notice fulfill buy order
  function fulfill(uint256 _orderId) public {
    require(buyOrders[_orderId].status == Status.pending, "No such buy order");

    IERC721 nft = IERC721(sellOrders[buyOrders[_orderId].sellOrderId].tokenAddress);

    require(sellOrders[buyOrders[_orderId].sellOrderId].orderOwner == msg.sender, "You are not owner");

    payable(msg.sender).transfer(buyOrders[_orderId].desiredPrice);

    nft.transferFrom(msg.sender, buyOrders[_orderId].orderOwner, buyOrders[_orderId].tokenId);

    complete(buyOrders[_orderId].sellOrderId, _orderId);
    emit BuyOrderFulfill(_orderId);
  }

  function complete(uint _orderId) private {
    if(buyOrdersBinded[_orderId].length == 0) {
      sellOrders[_orderId].status = Status.complete;
      return;
    }

    for (uint i = 0; i < buyOrdersBinded[_orderId].length; i++) {
      payable(buyOrdersBinded[_orderId][i].orderOwner).transfer(buyOrdersBinded[_orderId][i].desiredPrice);
      buyOrdersBinded[_orderId][i].status = Status.canceled;
    }
    sellOrders[_orderId].status = Status.complete;
  }
  function complete(uint _orderId, uint _buyOrder) private {
    if(buyOrdersBinded[_orderId].length == 0) {
      sellOrders[_orderId].status = Status.complete;
      return;
    }

    for (uint i = 0; i < buyOrdersBinded[_orderId].length; i++) {
      if (_buyOrder == buyOrdersBinded[_orderId][i].orderId) {
        buyOrdersBinded[_orderId][i].status = Status.complete;
        continue;
      }
      payable(buyOrdersBinded[_orderId][i].orderOwner).transfer(buyOrdersBinded[_orderId][i].desiredPrice);
      buyOrdersBinded[_orderId][i].status = Status.canceled;
    }
    sellOrders[_orderId].status = Status.complete;
  }

  function getAllSellOrders() public view returns (Order[] memory) {
    Order[] memory orders = new Order[](nextOrderId);
    uint count = 0;
    for (uint i = 0; i < nextOrderId; i++) {
      orders[count] = sellOrders[i];
      count++;
    }
    return orders;
  }

  function getAllBuyOrders() public view returns (BuyOrder[] memory) {
    BuyOrder[] memory orders = new BuyOrder[](nextBuyOrderId);
    uint count = 0;
    for (uint i = 0; i < nextBuyOrderId; i++) {
      orders[count] = buyOrders[i];
      count++;
    }
    return orders;
  }

}
