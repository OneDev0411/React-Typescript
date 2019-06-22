import deal from 'fixtures/deal/seller-with-offer'

import { getAttributeValue } from '.'

describe('Test deal form get-attribute-value helper', () => {
  it('Should return correct value when attribute is legal_full_name', () => {
    // @ts-ignore
    const value = getAttributeValue(deal.roles[0], {
      attribute: 'legal_full_name'
    })

    expect(value).toBe('Mr Ramin Mousavi')
  })

  it('Should return correct value when attribute is array and legal_full_name', () => {
    // @ts-ignore
    const value = getAttributeValue(deal.roles[0], {
      attributes: ['wrong_field', 'legal_full_name']
    })

    expect(value).toBe('Mr Ramin Mousavi')
  })

  it('Should return correct value when attribute value is zero', () => {
    const role = {
      ...deal.roles[0],
      foo: 0
    }

    // @ts-ignore
    const value = getAttributeValue(role, {
      attribute: 'foo'
    })

    expect(value).toBe(0)
  })

  it('Should return correct value when attribute is not legal_full_name', () => {
    // @ts-ignore
    const value = getAttributeValue(deal.roles[0], {
      attribute: 'legal_first_name'
    })

    expect(value).toBe('Ramin')
  })
})
