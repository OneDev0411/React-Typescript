import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { SOCIAL_NETWORKS } from '../constants'

import SocialActions from '.'

describe('MC SocialActions component', () => {
  it('renders', () => {
    const wrapper = shallow(
      <SocialActions onClick={() => null} networks={SOCIAL_NETWORKS} />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders all needed buttons based on networks prop', () => {
    const wrapper = shallow(
      <SocialActions onClick={() => null} networks={SOCIAL_NETWORKS} />
    )

    expect(wrapper.children()).toHaveLength(SOCIAL_NETWORKS.length)

    SOCIAL_NETWORKS.map((network, index) => {
      const socialButton = wrapper.childAt(index)

      expect(socialButton.childAt(0).hasClass(network.icon)).toBeTruthy()
    })
  })
})
