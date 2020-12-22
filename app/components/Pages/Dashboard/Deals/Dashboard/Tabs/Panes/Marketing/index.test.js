import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import draftDeal from 'fixtures/deal/draft-seller.json'
import liveDealWithListing from 'fixtures/deal/live-seller-with-listing.json'

import EmailMarketing from './EmailMarketing'
import SocialMarketing from './SocialMarketing'
import AgentNetwork from './AgentNetwork'
import OpenHouse from './OpenHouse'
import MyMarketingMatters from './MyMarketingMatters'
import Marketing from '.'

describe('Deal MarketingPane component', () => {
  it('renders with listing', () => {
    const wrapper = shallow(<Marketing deal={liveDealWithListing} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders without listing', () => {
    const wrapper = shallow(<Marketing deal={draftDeal} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders email, social, mmm and open house for deals with listing', () => {
    const wrapper = shallow(<Marketing deal={liveDealWithListing} />)

    expect(wrapper.children()).toHaveLength(4)
    expect(wrapper.find(EmailMarketing)).toHaveLength(1)
    expect(wrapper.find(MyMarketingMatters)).toHaveLength(1)
    expect(wrapper.find(SocialMarketing)).toHaveLength(1)
    expect(wrapper.find(AgentNetwork)).toHaveLength(0)
    expect(wrapper.find(OpenHouse)).toHaveLength(1)
  })

  it('renders only email, social and mmm for deals without listing (hip pockets)', () => {
    const wrapper = shallow(<Marketing deal={draftDeal} />)

    expect(wrapper.children()).toHaveLength(3)
    expect(wrapper.find(EmailMarketing)).toHaveLength(1)
    expect(wrapper.find(MyMarketingMatters)).toHaveLength(1)
    expect(wrapper.find(SocialMarketing)).toHaveLength(1)
    expect(wrapper.find(AgentNetwork)).toHaveLength(0)
    expect(wrapper.find(OpenHouse)).toHaveLength(0)
  })

})
