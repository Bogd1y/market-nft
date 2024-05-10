import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  BuyOrderFulfill,
  CancelBuy,
  CancelSell,
  CreateBuyOrder,
  CreateSellOrder,
  DirectBuy
} from "../generated/Marketok3/Marketok3"

export function createBuyOrderFulfillEvent(_orderId: BigInt): BuyOrderFulfill {
  let buyOrderFulfillEvent = changetype<BuyOrderFulfill>(newMockEvent())

  buyOrderFulfillEvent.parameters = new Array()

  buyOrderFulfillEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )

  return buyOrderFulfillEvent
}

export function createCancelBuyEvent(_orderId: BigInt): CancelBuy {
  let cancelBuyEvent = changetype<CancelBuy>(newMockEvent())

  cancelBuyEvent.parameters = new Array()

  cancelBuyEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )

  return cancelBuyEvent
}

export function createCancelSellEvent(_orderId: BigInt): CancelSell {
  let cancelSellEvent = changetype<CancelSell>(newMockEvent())

  cancelSellEvent.parameters = new Array()

  cancelSellEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )

  return cancelSellEvent
}

export function createCreateBuyOrderEvent(
  _orderId: BigInt,
  _desiredPrice: BigInt,
  who: Address
): CreateBuyOrder {
  let createBuyOrderEvent = changetype<CreateBuyOrder>(newMockEvent())

  createBuyOrderEvent.parameters = new Array()

  createBuyOrderEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )
  createBuyOrderEvent.parameters.push(
    new ethereum.EventParam(
      "_desiredPrice",
      ethereum.Value.fromUnsignedBigInt(_desiredPrice)
    )
  )
  createBuyOrderEvent.parameters.push(
    new ethereum.EventParam("who", ethereum.Value.fromAddress(who))
  )

  return createBuyOrderEvent
}

export function createCreateSellOrderEvent(
  _address: Address,
  _tokenId: BigInt,
  _desiredPrice: BigInt,
  _who: Address,
  _orderId: BigInt
): CreateSellOrder {
  let createSellOrderEvent = changetype<CreateSellOrder>(newMockEvent())

  createSellOrderEvent.parameters = new Array()

  createSellOrderEvent.parameters.push(
    new ethereum.EventParam("_address", ethereum.Value.fromAddress(_address))
  )
  createSellOrderEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )
  createSellOrderEvent.parameters.push(
    new ethereum.EventParam(
      "_desiredPrice",
      ethereum.Value.fromUnsignedBigInt(_desiredPrice)
    )
  )
  createSellOrderEvent.parameters.push(
    new ethereum.EventParam("_who", ethereum.Value.fromAddress(_who))
  )
  createSellOrderEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )

  return createSellOrderEvent
}

export function createDirectBuyEvent(
  _orderId: BigInt,
  _who: Address
): DirectBuy {
  let directBuyEvent = changetype<DirectBuy>(newMockEvent())

  directBuyEvent.parameters = new Array()

  directBuyEvent.parameters.push(
    new ethereum.EventParam(
      "_orderId",
      ethereum.Value.fromUnsignedBigInt(_orderId)
    )
  )
  directBuyEvent.parameters.push(
    new ethereum.EventParam("_who", ethereum.Value.fromAddress(_who))
  )

  return directBuyEvent
}
