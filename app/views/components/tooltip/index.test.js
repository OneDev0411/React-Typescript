import React from 'react'
import renderer from 'react-test-renderer'
import { expect } from 'chai'
import { shallow, mount, render } from 'enzyme'
import ReactTestUtils from 'react-dom/test-utils'
import Tooltip from '.'

describe('Test Tooltip component', () => {
  test('Should contain Tooltip object', () => {
    const Wrapper = (
      <Tooltip caption="tooltip works">
        <div>Hover Me!</div>
      </Tooltip>
    )

    const wrapper = shallow(Wrapper)

    expect(wrapper.find('OverlayTrigger').length).to.equal(1)
  })

  test('Should not contain Tooltip object when caption is not defined', () => {
    const Wrapper = (
      <Tooltip>
        <div>Hover Me!</div>
      </Tooltip>
    )

    const wrapper = shallow(Wrapper)

    expect(wrapper.find('OverlayTrigger').length).to.equal(0)
  })

  test('Should render Tooltip', () => {
    const Wrapper = (
      <Tooltip caption="tooltip works">
        <div>Hover Me!</div>
      </Tooltip>
    )

    const wrapper = shallow(Wrapper)

    const tooltip = shallow(wrapper.find('OverlayTrigger').prop('overlay'))

    expect(tooltip.find('.tooltip-inner').text()).to.equal('tooltip works')
  })
})
