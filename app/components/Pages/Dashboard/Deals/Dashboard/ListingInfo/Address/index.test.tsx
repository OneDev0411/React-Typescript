import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import withAddress from 'fixtures/deal/live-seller'
import withoutAddress from 'fixtures/deal/live-seller-without-address'

import { Address } from '.'

describe('Deal address component', () => {
  it('renders with address', () => {
    const wrapper = render(<Address deal={withAddress} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders without address', () => {
    const wrapper = render(<Address deal={withoutAddress} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders button with "Edit Address" CTA for deals with address', () => {
    const wrapper = render(<Address deal={withAddress} />)

    expect(
      wrapper
        .children()
        .last()
        .text()
    ).toBe('Edit Address')
  })

  it('renders button with "+ Add Address" CTA for deals without address', () => {
    const wrapper = render(<Address deal={withoutAddress} />)

    expect(
      wrapper
        .children()
        .last()
        .text()
    ).toBe('+ Add Address')
  })
})
