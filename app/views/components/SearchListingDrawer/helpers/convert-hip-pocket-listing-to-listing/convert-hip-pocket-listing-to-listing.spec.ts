import { getPropertyAddress } from './index'

describe('getPropertyAddress', () => {
  it('should return empty address if given address is undefined', () => {
    const address = undefined
    const expected = {
      street_number: '',
      street_name: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      full_address: ''
    }

    expect(getPropertyAddress(address)).toStrictEqual(expected)
  })

  it('should return empty address if given address is empty string', () => {
    const address = ''
    const expected = {
      street_number: '',
      street_name: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      full_address: ''
    }

    expect(getPropertyAddress(address)).toStrictEqual(expected)
  })

  it('should return address object if given address is "8865 North Meadowbrook Street Glasgow, KY 42141', () => {
    const address = '8865 North Meadowbrook Street Glasgow, KY 42141'
    const expected = {
      city: 'Glasgow',
      full_address: '8865 N Meadowbrook St Glasgow KY 42141',
      postal_code: '42141',
      state: 'KY',
      street_address: '8865 N Meadowbrook St',
      street_name: 'Meadowbrook',
      street_number: '8865'
    }

    expect(getPropertyAddress(address)).toStrictEqual(expected)
  })

  it('should return address object if given address is "22110 Dove Valley Lane 92141', () => {
    const address = '22110 Dove Valley Lane 92141'
    const expected = {
      city: undefined,
      full_address: '22110 Dove Valley Ln 92141',
      postal_code: '92141',
      state: undefined,
      street_address: '22110 Dove Valley Ln',
      street_name: 'Dove Valley',
      street_number: '22110'
    }

    expect(getPropertyAddress(address)).toStrictEqual(expected)
  })
})
