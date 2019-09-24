import baseDeal from 'fixtures/deal/seller-with-offer.json'

import { isDoubleEnded } from '.'

function withContext(ender_type: string | null = null) {
  return {
    ...baseDeal,
    context: {
      ...baseDeal.context,
      ender_type: {
        ...baseDeal.context.ender_type,
        text: ender_type
      }
    }
  }
}

describe('Test deal double ended context', () => {
  it('Should return true when ender_type is AgentDoubleEnder', () => {
    const deal = withContext('AgentDoubleEnder')

    expect(isDoubleEnded(deal as any)).toBe(true)
  })

  it('Should return true when ender_type is OfficeDoubleEnder', () => {
    const deal = withContext('OfficeDoubleEnder')

    expect(isDoubleEnded(deal as any)).toBe(true)
  })

  it('Should return false when ender_type is null', () => {
    const deal = withContext(null)

    expect(isDoubleEnded(deal as any)).toBe(false)
  })
})
