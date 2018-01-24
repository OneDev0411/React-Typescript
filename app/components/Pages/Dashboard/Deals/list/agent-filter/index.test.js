import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount, render } from 'enzyme'
import { expect } from 'chai'
import ReactTestUtils from 'react-dom/test-utils'
import ConnectedAgentFilter, { AgentFilter } from '.'
import store from '../../../../../../stores'
import setupDeals from '../../../../../../../tests/helpers/deals/setup-deals'

describe('Test agent filters in deals component', () => {
  beforeEach(() => {
    /* nothing */
  })

  test('Should render all given filters', () => {
    const Wrapper = <AgentFilter />

    const wrapper = shallow(Wrapper)

    expect(wrapper.findByAttr('filter-item').length).to.equal(4)
  })

  test('Should select "All" as default active filter', () => {
    const Wrapper = <AgentFilter />

    const wrapper = shallow(Wrapper)

    expect(wrapper
      .queryAttr('filter-item > .active')
      .findByAttr('title')
      .text()).to.equal('All')
  })

  test('Should select given filter as active filter', () => {
    const activeFilter = 'Pending'

    const props = {
      active: activeFilter,
      onChangeFilter: jest.fn()
    }

    const Wrapper = <AgentFilter {...props} />

    const wrapper = shallow(Wrapper)

    expect(wrapper
      .queryAttr('filter-item > .active')
      .findByAttr('title')
      .text()).to.equal(activeFilter)

    expect(props.onChangeFilter.mock.calls.length).to.equal(1)
  })

  test('Should change active filter on click', () => {
    const props = {
      onChangeFilter: jest.fn()
    }

    const Wrapper = <AgentFilter {...props} />

    const wrapper = shallow(Wrapper)

    const secondTab = wrapper.findByAttr('filter-item').at(1)
    const secondTabName = secondTab.findByAttr('title').text()

    secondTab.simulate('click')

    expect(props.onChangeFilter.mock.calls.length).to.equal(1)
  })

  test('Should show correct badge counter', () => {
    setupDeals()

    const Wrapper = <AgentFilter deals={store.getState().deals.list} />
    const wrapper = shallow(Wrapper)

    // the numbers come from deal fixtures
    const badges = [43, 11, 18, 1]

    badges.forEach((number, key) => {
      expect(wrapper
        .findByAttr('filter-item')
        .at(key)
        .findByAttr('badge')
        .text()).to.equal(number.toString())
    })
  })
})
