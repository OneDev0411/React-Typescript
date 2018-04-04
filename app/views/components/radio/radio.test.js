import React from 'react'
import renderer from 'react-test-renderer'
import { expect } from 'chai'
import { shallow, mount, render } from 'enzyme'
import ReactTestUtils from 'react-dom/test-utils'
import Radio from './index'

describe('Test radio button component', () => {
  test('Should render radio button with title', () => {
    const title = 'Sample Checkbox'
    const Wrapper = <Radio square title={title} disabled={false} selected={false} />

    const wrapper = shallow(Wrapper)

    expect(wrapper.findAttr('radio-label').text()).to.equal(title)
  })

  test('Should select and unselect radio button on clicking', () => {
    const Wrapper = <Radio square title="Sample" disabled={false} selected={false} />

    const wrapper = shallow(Wrapper)

    expect(wrapper.find('.selected').length).to.equal(0)

    // change "selected" prop
    wrapper.setProps({ selected: true })

    expect(wrapper.find('.selected').length).to.equal(1)
  })

  test('Should render checkbox when square prop is passed', () => {
    const Wrapper = <Radio square title="Sample" disabled={false} selected={false} />

    const wrapper = shallow(Wrapper)

    expect(wrapper.find('.square').length).to.equal(1)
  })
})
