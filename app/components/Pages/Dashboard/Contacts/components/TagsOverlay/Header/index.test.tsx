import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { Link } from 'react-router'
import { mdiClose } from '@mdi/js'

import IconButton from 'components/Button/IconButton'

import Header from '.'

describe('TagsOverlay header', () => {
  it('renders', () => {
    const wrapper = shallow(
      <Header title="manage tags here" onClose={() => null} />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders proper title', () => {
    const wrapper = shallow(
      <Header title="manage tags here" onClose={() => null} />
    )

    expect(wrapper.text()).toContain('manage tags here')
  })

  it('renders link to tag management settings', () => {
    const wrapper = shallow(
      <Header title="manage tags here" onClose={() => null} />
    )

    expect(wrapper.find(Link)).toHaveLength(1)
  })

  it('renders close button', () => {
    const wrapper = shallow(
      <Header title="manage tags here" onClose={() => null} />
    )

    expect(wrapper.find(IconButton)).toHaveLength(1)
    expect(wrapper.find({ path: mdiClose })).toHaveLength(1)
  })
})
