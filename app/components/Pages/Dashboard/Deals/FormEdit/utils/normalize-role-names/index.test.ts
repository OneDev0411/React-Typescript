import dealWithOffer from 'fixtures/deal/seller-with-offer'
import liveSeller from 'fixtures/deal/live-seller'
import liveBuyer from 'fixtures/deal/live-buyer'

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
    // @ts-ignore
    const list = normalizeRoleNames(liveSeller, ['PrimaryAgent'])

    expect(list).toStrictEqual(['SellerAgent'])
  })

  it('Should return correct list when there is PrimaryAgent and deal is Buying', () => {
    // @ts-ignore
    const list = normalizeRoleNames(liveBuyer, ['PrimaryAgent'])

    expect(list).toStrictEqual(['BuyerAgent'])
  })

  it('Should return correct list when there is InternalBuyerAgents and deal is DoubleEnded', () => {
    // @ts-ignore
    const list = normalizeRoleNames(setDoubleEnded(true), [
      'InternalBuyerAgents'
    ])

    expect(list).toStrictEqual(['BuyerAgent'])
  })

  it('Should return correct list when there is InternalBuyerAgents and deal is not DoubleEnded', () => {
    // @ts-ignore
    const list = normalizeRoleNames(setDoubleEnded(false), [
      'InternalBuyerAgents'
    ])

    expect(list).toStrictEqual(['InternalBuyerAgents'])
  })

  it('Should return correct list when there is ExternalBuyerAgents and deal is DoubleEnded', () => {
    // @ts-ignore
    const list = normalizeRoleNames(setDoubleEnded(true), [
      'ExternalBuyerAgents'
    ])

    expect(list).toStrictEqual(['ExternalBuyerAgents'])
  })

  it('Should return correct list when there is ExternalBuyerAgents and deal is not DoubleEnded', () => {
    // @ts-ignore
    const list = normalizeRoleNames(setDoubleEnded(false), [
      'ExternalBuyerAgents'
    ])

    expect(list).toStrictEqual(['BuyerAgent'])
  })
})
