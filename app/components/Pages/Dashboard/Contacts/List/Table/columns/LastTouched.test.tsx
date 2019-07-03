import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import fullContact from 'fixtures/contacts/full-contact'

import LastTouched from './LastTouched'

describe('Contacts list last touched component', () => {
  it('renders for contacts with last touch', () => {
    const wrapper = render(<LastTouched contact={fullContact} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders for contacts without last touch', () => {
    fullContact.last_touch = null

    const wrapper = render(<LastTouched contact={fullContact} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
