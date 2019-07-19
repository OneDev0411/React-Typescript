import React from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { RoleAgentIntegration } from '.'

describe('Deal Agent integration with roles', () => {
  it('renders the component', () => {
    const wrapper = shallow(
      <RoleAgentIntegration
        isPrimaryAgent
        onUpsertRole={() => null}
        onClose={() => null}
      />
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
