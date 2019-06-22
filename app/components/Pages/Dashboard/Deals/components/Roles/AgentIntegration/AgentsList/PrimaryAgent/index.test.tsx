import React from 'react'
import { mount, render } from 'enzyme'
import toJson from 'enzyme-to-json'

import teams from 'fixtures/deal/teams'

import { PrimaryAgent } from '.'

describe('Deal Agent integration with roles', () => {
  it('renders the primary agent component', () => {
    const wrapper = render(
      <PrimaryAgent teams={[]} onSelectAgent={() => null} />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders all teams including agents', () => {
    const wrapper = render(
      <PrimaryAgent teams={teams} onSelectAgent={() => null} />
    )

    expect(wrapper.find('[data-test="primary-agent-role"]')).toHaveLength(4)
  })

  it('renders returns brand id on selecting ', () => {
    const fn = jest.fn()

    const wrapper = mount(<PrimaryAgent teams={teams} onSelectAgent={fn} />)

    wrapper
      .find('[data-test="primary-agent-role"]')
      .first()
      .simulate('click')

    expect(fn.mock.calls[0][0]).toHaveProperty('brand_id')
  })
})
