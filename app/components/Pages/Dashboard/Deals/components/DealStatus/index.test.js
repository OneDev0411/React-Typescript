import React from 'react'
import { shallow, mount, render } from 'enzyme'
import toJson from 'enzyme-to-json'

import store from '../../../../../../stores'
import { TestBed } from '../../../../../../../tests/unit/TestBed'
import draftDeal from 'fixtures/deal/draft-seller.json'
import liveSellerDeal from 'fixtures/deal/live-seller.json'

import { DealStatus } from '.'

describe('Test DealStatus component', () => {
  it('Should not render when deal is draft', () => {
    const component = shallow(
      <TestBed>
        <DealStatus
          deal={draftDeal}
          isBacOffice={false}
        />
      </TestBed>
    )

    expect(component.isEmptyRender()).toBe(false)
  })

  it('Should render when deal is not draft', () => {
    const component = shallow(
      <TestBed>
        <DealStatus
          deal={liveSellerDeal}
          isBacOffice={false}
        />
      </TestBed>
    )

    expect(component.isEmptyRender()).toBe(false)
  })
})
