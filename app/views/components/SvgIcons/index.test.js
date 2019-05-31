import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import find from 'find'
import {sep} from 'path'

describe('Svg-generated styled components', () => {
  find.fileSync(/\.js$/, __dirname)
    .slice(0, -1) // exclude this test file
    .map(async (file) => {
      const Icon = require(file).default
      const wrapper = shallow(<Icon color="red" />)
      const iconName = file.split(sep).slice(-2).join('/').replace('.js', '')

      describe(iconName, () => {
        it('renders correctly according to snapshot', () => {
          expect(toJson(wrapper)).toMatchSnapshot()   
        })
      })
    })
})
