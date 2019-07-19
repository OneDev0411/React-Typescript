import deal from 'fixtures/deal/seller-with-offer'

import { getRoleText } from '.'

describe('Test deal form get-role-names helper', () => {
  it('Should return correct names when annotation type is Roles and attribute is legal_full_name', () => {
    const names = getRoleText(
      deal.roles as any,
      deal as any,
      ['SellerAgent', 'Seller'],
      {
        type: 'Roles',
        attribute: 'legal_full_name'
      }
    )

    expect(names).toBe('Mr Ramin Mousavi, Shayan Hamidi')
  })

  it('Should return correct names when annotation type is Roles and attribute is not legal_full_name', () => {
    const names = getRoleText(
      deal.roles as any,
      deal as any,
      ['SellerAgent', 'Seller'],
      {
        type: 'Roles',
        attribute: 'legal_first_name'
      }
    )

    expect(names).toBe('Ramin, Shayan')
  })

  it('Should return correct names when annotation type is Roles and attribute is nested', () => {
    const names = getRoleText(
      deal.roles as any,
      deal as any,
      ['SellerAgent', 'Seller'],
      {
        type: 'Roles',
        attribute: 'user.display_name'
      }
    )

    expect(names).toBe('ramin@rechat.com')
  })

  it('Should return correct names when annotation type is Role', () => {
    const names = getRoleText(
      deal.roles as any,
      deal as any,
      ['SellerAgent', 'Seller'],
      {
        type: 'Role',
        attribute: 'legal_first_name',
        number: 1
      }
    )

    expect(names).toBe('Shayan')
  })
})
