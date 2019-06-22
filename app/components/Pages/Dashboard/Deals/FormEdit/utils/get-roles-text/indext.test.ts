import deal from 'fixtures/deal/seller-with-offer'

import { getRoleText } from '.'

describe('Test deal form get-role-names helper', () => {
  it('Should return correct names when annotation type is Roles and attribute is legal_full_name', () => {
    // @ts-ignore
    const names = getRoleText(deal.roles, deal, ['SellerAgent', 'Seller'], {
      type: 'Roles',
      attribute: 'legal_full_name'
    })

    expect(names).toBe('Mr Ramin Mousavi, Shayan Hamidi')
  })

  it('Should return correct names when annotation type is Roles and attribute is not legal_full_name', () => {
    // @ts-ignore
    const names = getRoleText(deal.roles, deal, ['SellerAgent', 'Seller'], {
      type: 'Roles',
      attribute: 'legal_first_name'
    })

    expect(names).toBe('Ramin, Shayan')
  })

  it('Should return correct names when annotation type is Roles and attribute is nested', () => {
    // @ts-ignore
    const names = getRoleText(deal.roles, deal, ['SellerAgent', 'Seller'], {
      type: 'Roles',
      attribute: 'user.display_name'
    })

    expect(names).toBe('ramin@rechat.com, Shayan Hamidi')
  })

  it('Should return correct names when annotation type is Role', () => {
    // @ts-ignore
    const names = getRoleText(deal.roles, deal, ['SellerAgent', 'Seller'], {
      type: 'Role',
      attribute: 'legal_first_name',
      number: 1
    })

    expect(names).toBe('Shayan')
  })
})
