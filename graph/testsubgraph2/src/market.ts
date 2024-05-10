import {
  BuyOrderFulfill as BuyOrderFulfillEvent,
  CancelBuy as CancelBuyEvent,
  CancelSell as CancelSellEvent,
  CreateBuyOrder as CreateBuyOrderEvent,
  CreateSellOrder as CreateSellOrderEvent,
  DirectBuy as DirectBuyEvent
} from "../generated/Market/Market"
import {
  BuyOrderFulfill,
  CancelBuy,
  CancelSell,
  CreateBuyOrder,
  CreateSellOrder,
  DirectBuy
} from "../generated/schema"

export function handleBuyOrderFulfill(event: BuyOrderFulfillEvent): void {
  let entity = new BuyOrderFulfill(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._orderId = event.params._orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelBuy(event: CancelBuyEvent): void {
  let entity = new CancelBuy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._orderId = event.params._orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelSell(event: CancelSellEvent): void {
  let entity = new CancelSell(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._orderId = event.params._orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateBuyOrder(event: CreateBuyOrderEvent): void {
  let entity = new CreateBuyOrder(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._orderId = event.params._orderId
  entity._desiredPrice = event.params._desiredPrice
  entity.who = event.params.who

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateSellOrder(event: CreateSellOrderEvent): void {
  let entity = new CreateSellOrder(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._address = event.params._address
  entity._tokenId = event.params._tokenId
  entity._desiredPrice = event.params._desiredPrice
  entity._who = event.params._who
  entity._orderId = event.params._orderId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDirectBuy(event: DirectBuyEvent): void {
  let entity = new DirectBuy(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._orderId = event.params._orderId
  entity._who = event.params._who

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
