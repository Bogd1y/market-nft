import {
 time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre, { viem } from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("MarketPlace", function () {

  async function deployFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const publicClient = await hre.viem.getPublicClient();

    const nft = await hre.viem.deployContract("MyNFT")
    const market = await hre.viem.deployContract("Market")

    await nft.write.safeMint([owner.account.address, "1ID"])

    return {
      owner,
      otherAccount,
      publicClient,
      nft,
      market
    }
  }

  describe("Create Orders", async function () {

    it("Should create sell order", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 100000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await expect(market.write.createSellOrder([nft.address, tokenId, amount])).to.be.not.rejected
      await expect(market.write.createSellOrder([nft.address, tokenId, amount], {
        account: otherAccount.account
      })).to.be.rejectedWith("You don't own this NFT")

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])
      
    })
    it("Should not create sell order ", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 100000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])
      
      await expect(market.write.addToBlackList([nft.address])).to.be.not.rejected
      await expect(market.write.addToBlackList([nft.address], {
        account: otherAccount.account
      })).to.be.rejectedWith("Not him")

      await expect(market.write.createSellOrder([nft.address, tokenId, amount])).to.be.rejectedWith("NFT not allowed")
      
    })
    it("Should create sell order and buy order", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 100000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await market.write.createSellOrder([nft.address, tokenId, amount])

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])
      
      await expect(market.write.createBuyOrder([order[1], amount - 150n], {
        account: otherAccount.account,
      })).to.be.rejectedWith("Where is money?")
      await expect(market.write.createBuyOrder([213n, amount - 150n], {
        account: otherAccount.account,
      })).to.be.rejectedWith("No such in sale")

      await expect(market.write.createBuyOrder([order[1], amount - 150n], {
        account: otherAccount.account,
        value: amount - 150n
      })).to.be.not.rejected

    })
    it("Should create sell order and buy order and cencel sell order", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 100000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await market.write.createSellOrder([nft.address, tokenId, amount])

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])

      await expect(market.write.createBuyOrder([order[1], amount - 150n], {
        account: otherAccount.account,
        value: amount - 150n
      })).to.be.not.rejected

      await expect(market.write.cancelSell([order[1]], {
        account: otherAccount.account
      })).to.be.rejectedWith("You are not owner")

      await expect(market.write.cancelSell([213n])).to.be.rejectedWith("No such in sale")
      await expect(market.write.cancelSell([order[1]])).to.be.not.rejected
    })

  })

  describe("Buying", async function () {
    it("Should create sell order and directly buy it", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 100000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await market.write.createSellOrder([nft.address, tokenId, amount])

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])

      const blOfSellerBefore = await publicClient.getBalance({address: owner.account.address})

      await expect(market.write.buy([2123n], {
        account: otherAccount.account,
        value: order[0]
      })).to.be.rejectedWith("No such in sale")

      await expect(market.write.buy([order[1]], {
        account: otherAccount.account,
      })).to.be.rejectedWith("Where is money?")
      
      await expect(market.write.buy([order[1]], {
        account: otherAccount.account,
        value: order[0]
      })).to.be.not.rejected

      const blOfSellerAfter = await publicClient.getBalance({address: owner.account.address})

      expect(Number(blOfSellerAfter)).to.be.not.lessThan(Number(blOfSellerBefore))

      expect(await nft.read.balanceOf([otherAccount.account.address])).to.be.equal(1n)
      expect(await nft.read.balanceOf([market.address])).to.be.equal(0n)
      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(otherAccount.account.address)   

    })
    it("Should create sell order and buy it using buy order", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 1000000000000000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await market.write.createSellOrder([nft.address, tokenId, amount])

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])

      const blOfSellerBefore = await publicClient.getBalance({address: owner.account.address})

      await expect(market.write.createBuyOrder([order[1], amount - 150n], {
        account: otherAccount.account,
        value: amount - 150n
      })).to.be.not.rejected

      const buyOrderId = await market.read.nextBuyOrderId() - 1n

      await expect(market.write.fulfill([buyOrderId], {
        account: otherAccount.account.address
      })).to.be.rejectedWith("You are not owner")
      
      await expect(market.write.fulfill([buyOrderId + 10n], {
        account: otherAccount.account.address
      })).to.be.rejectedWith("No such buy order")

      await expect(market.write.fulfill([buyOrderId])).to.be.not.rejected

      const blOfSellerAfter = await publicClient.getBalance({address: owner.account.address})

      expect(Number(blOfSellerAfter)).to.be.not.lessThan(Number(blOfSellerBefore))

      expect(await nft.read.balanceOf([otherAccount.account.address])).to.be.equal(1n)
      expect(await nft.read.balanceOf([market.address])).to.be.equal(0n)
      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(otherAccount.account.address)   

    })
    it("Should create sell order and buy it using multiply buy order", async function () {
      const { owner, otherAccount, publicClient, nft, market } = await deployFixture()

      const amount = 1000000000000000n
      const tokenId = 0n

      await nft.write.approve([market.address, tokenId])

      await market.write.createSellOrder([nft.address, tokenId, amount])

      expect((await nft.read.ownerOf([tokenId])).toLowerCase()).to.be.equal(market.address)

      const order = await market.read.sellOrders([await market.read.nextOrderId() - 1n])
      
      order[4] = order[4].toLowerCase() as `0x${string}`;
      order[5] = order[5].toLowerCase() as `0x${string}`;

      expect(order).to.be.deep.equal([amount, await market.read.nextOrderId() - 1n, 2, tokenId, nft.address, owner.account.address])

      const blOfSellerBefore = await publicClient.getBalance({address: owner.account.address})

      const signers = await viem.getWalletClients()

      for (const signer of signers) {

        await expect(market.write.createBuyOrder([order[1], amount - 150n], {
          account: signer.account,
          value: amount - 150n
        })).to.be.not.rejected
      }

      const buyOrderId = await market.read.nextBuyOrderId() - 1n

      await expect(market.write.fulfill([buyOrderId])).to.be.not.rejected

      const blOfSellerAfter = await publicClient.getBalance({address: owner.account.address})

      expect(await market.read.getAllSellOrders()).to.be.at.lengthOf(1)
      expect(await market.read.getAllBuyOrders()).to.be.at.lengthOf(signers.length)
      

      expect(Number(blOfSellerAfter)).to.be.not.lessThan(Number(blOfSellerBefore))

      expect(await nft.read.balanceOf([(await market.read.buyOrders([buyOrderId]))[4]])).to.be.equal(1n)
      expect(await nft.read.balanceOf([market.address])).to.be.equal(0n)
      expect((await nft.read.ownerOf([tokenId]))).to.be.equal((await market.read.buyOrders([buyOrderId]))[4])   

    })
  })

})
