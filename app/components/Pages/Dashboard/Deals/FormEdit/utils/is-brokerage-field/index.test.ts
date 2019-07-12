import { isBrokerageField, brokerageFields } from '.'

describe('Test deal form is-brokerage-field helper', () => {
  it('Should return true if attribute is brokerage field', () => {
    const annotation = {
      attribute: brokerageFields[0]
    }

    expect(isBrokerageField(annotation)).toBe(true)
  })

  it('Should return false if attribute is not a brokerage field', () => {
    expect(
      isBrokerageField({
        attribute: 'foo'
      })
    ).toBe(false)

    expect(isBrokerageField({})).toBe(false)
  })

  it('Should return true if one of attributes is brokerage field', () => {
    const annotation = {
      attributes: [brokerageFields[0]]
    }

    expect(isBrokerageField(annotation)).toBe(true)
  })

  it('Should return true if none of attributes are not brokerage field', () => {
    const annotation = {
      attributes: ['foo', 'bar']
    }

    expect(isBrokerageField(annotation)).toBe(false)
    expect(isBrokerageField({})).toBe(false)
  })
})
