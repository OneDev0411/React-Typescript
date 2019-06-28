import React from 'react'
import { shallow, mount, render } from 'enzyme'
import toJson from 'enzyme-to-json'

import store from '../../../../../../stores'
import draftDeal from 'fixtures/deal/draft-seller'
import liveSellerDeal from 'fixtures/deal/live-seller'

import { DealStatus } from '.'

describe('Test DealStatus component', () => {
  it('Should not render when deal is draft', () => {
    const component = shallow(
      <DealStatus
        deal={draftDeal}
        isBacOffice={false}
      />
    )

    expect(component.isEmptyRender()).toBe(true)
  })

  it('Should render when deal is not draft', () => {
    const component = shallow(
      <DealStatus
        deal={liveSellerDeal}
        isBacOffice={false}
      />
    )

    expect(component.isEmptyRender()).toBe(false)
  })
})