import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BuyOrderFulfill } from "../generated/schema"
import { BuyOrderFulfill as BuyOrderFulfillEvent } from "../generated/Marketok3/Marketok3"
import { handleBuyOrderFulfill } from "../src/marketok-3"
import { createBuyOrderFulfillEvent } from "./marketok-3-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let _orderId = BigInt.fromI32(234)
    let newBuyOrderFulfillEvent = createBuyOrderFulfillEvent(_orderId)
    handleBuyOrderFulfill(newBuyOrderFulfillEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BuyOrderFulfill created and stored", () => {
    assert.entityCount("BuyOrderFulfill", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BuyOrderFulfill",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "_orderId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
