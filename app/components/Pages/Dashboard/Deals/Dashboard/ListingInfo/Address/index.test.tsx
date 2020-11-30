import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import withAddress from 'fixtures/deal/live-seller.json'
import withoutAddress from 'fixtures/deal/live-seller-without-address.json'

import { AppTheme } from '../../../../../../../AppTheme'
import { TestBed } from '../../../../../../../../tests/unit/TestBed'

import { Address } from '.'

describe('Deal address component', () => {
  it('renders with address', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <Address deal={withAddress as any} />
        </AppTheme>
      </TestBed>
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders without address', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <Address deal={withoutAddress as any} />
        </AppTheme>
      </TestBed>
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders button with "Edit Address" CTA for deals with address', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <Address deal={withAddress as any} />
        </AppTheme>
      </TestBed>
    )

    expect(wrapper.children().last().text()).toBe('Edit')
  })

  it('renders button with "+ Add Address" CTA for deals without address', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <Address deal={withoutAddress as any} />
        </AppTheme>
      </TestBed>
    )

    expect(wrapper.children().last().text()).toBe('+ Add Address')
  })
})
