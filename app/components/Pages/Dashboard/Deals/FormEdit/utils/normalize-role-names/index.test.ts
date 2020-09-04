import dealWithOffer from 'fixtures/deal/seller-with-offer.json'
import liveSeller from 'fixtures/deal/live-seller.json'
import liveBuyer from 'fixtures/deal/live-buyer.json'

import { normalizeRoleNames } from '.'

function setDoubleEnded(isDoubleEnded) {
  return {
    ...dealWithOffer,
    context: {
      ...dealWithOffer.context,
      ender_type: {
        ...dealWithOffer.context.ender_type,
        text: isDoubleEnded ? 'AgentDoubleEnder' : null
      }
    }
  }
}

describe('Test deal form normalize-role-names helper', () => {
  it('Should return correct list when there is PrimaryAgent and deal is Selling', () => {
    const list = normalizeRoleNames(liveSeller as any, ['PrimaryAgent'])

    expect(list).toStrictEqual(['SellerAgent'])
  })

  it('Should return correct list when there is PrimaryAgent and deal is Buying', () => {
    const list = normalizeRoleNames(liveBuyer as any, ['PrimaryAgent'])

    expect(list).toStrictEqual(['BuyerAgent'])
  })

  it('Should return correct list when there is InternalBuyerAgents and deal is DoubleEnded', () => {
    const list = normalizeRoleNames(setDoubleEnded(true) as any, [
      'InternalBuyerAgent'
    ])

    expect(list).toStrictEqual(['BuyerAgent'])
  })

  it('Should return correct list when there is InternalBuyerAgents and deal is not DoubleEnded', () => {
    const list = normalizeRoleNames(setDoubleEnded(false) as any, [
      'InternalBuyerAgent'
    ])

    expect(list).toStrictEqual(['InternalBuyerAgent'])
  })

  it('Should return correct list when there is ExternalBuyerAgents and deal is DoubleEnded', () => {
    const list = normalizeRoleNames(setDoubleEnded(true) as any, [
      'ExternalBuyerAgent'
    ])

    expect(list).toStrictEqual(['ExternalBuyerAgent'])
  })

  it('Should return correct list when there is ExternalBuyerAgents and deal is not DoubleEnded', () => {
    const list = normalizeRoleNames(setDoubleEnded(false) as any, [
      'ExternalBuyerAgent'
    ])

    expect(list).toStrictEqual(['BuyerAgent'])
  })

  it('Should return correct list when there is InternalBuyer and deal is Buying', () => {
    const list = normalizeRoleNames(liveBuyer as any, ['InternalBuyer'])

    expect(list).toStrictEqual(['Buyer'])
  })

  it('Should return correct list when there is InternalSeller and deal is Selling', () => {
    const list = normalizeRoleNames(liveSeller as any, ['InternalSeller'])

    expect(list).toStrictEqual(['Seller'])
  })
})
