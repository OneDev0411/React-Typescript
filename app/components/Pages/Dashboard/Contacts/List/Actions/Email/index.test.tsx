import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'

// @ts-ignore
// eslint-disable-next-line
import recipient from 'fixtures/contacts/contact-item'

import { Email } from '.'

const contact = recipient as INormalizedContact

describe('ContactItem', () => {
  it('should render', () => {
    const wrapper = shallow(<Email contacts={[contact]} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
