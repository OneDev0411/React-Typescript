import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Menu } from './index'

describe('MC Menu', () => {
  it('renders list of templates type', () => {
    expect(toJson(shallow(
      <Menu />
    ))).toMatchSnapshot()
  })
})
