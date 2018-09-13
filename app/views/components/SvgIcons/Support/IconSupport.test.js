import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import Image from './IconSupport.js'

describe('IconSupport.svg generated styled component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallow(<Image />)
  })

  it('renders a <svg> tag without crashing', () => {
    expect(wrapper).toHaveTagName('svg')
  })

  it('renders correctly according to snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('has dimensions greater than zero', () => {
    const dimensions = Image.getDimensions()
    expect(dimensions.width).not.toBe('0')
    expect(parseInt(dimensions.width, 10)).toBeGreaterThan(0)
    expect(dimensions.height).not.toBe('0')
    expect(parseInt(dimensions.height, 10)).toBeGreaterThan(0)
  })
})
