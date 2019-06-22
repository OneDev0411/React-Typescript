import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import ActionButton from 'components/Button/ActionButton'

import { Header } from '.'

describe('Deal list page header', () => {
  it('renders the page header', () => {
    const wrapper = shallow(
      <Header
        user={{}}
        title=""
        isSideMenuOpen
        onMenuTriggerChange={() => null}
      />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders create deal button when side bar is open', () => {
    const wrapper = shallow(
      <Header
        user={{}}
        title=""
        isSideMenuOpen
        onMenuTriggerChange={() => null}
      />
    )

    expect(wrapper.find(ActionButton)).toHaveLength(1)
  })

  it('renders create deal button when side bar is closed', () => {
    const wrapper = shallow(
      <Header
        user={{}}
        title=""
        isSideMenuOpen
        onMenuTriggerChange={() => null}
      />
    )

    expect(wrapper.find(ActionButton)).toHaveLength(1)
  })
})
