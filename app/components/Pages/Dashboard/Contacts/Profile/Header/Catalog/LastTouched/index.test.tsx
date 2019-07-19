import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import fullContact from 'fixtures/contacts/full-contact'

import { LastTouched } from '.'

describe('Contact profile last touched component', () => {
  it('renders', () => {
    const wrapper = render(<LastTouched contact={fullContact} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders touch periods without decimal points', () => {
    const wrapper = render(<LastTouched contact={fullContact} />)

    const decimalPointedPeriod =
      (fullContact.next_touch - fullContact.last_touch) / 86400
    const rounedPeriod = Math.round(
      (fullContact.next_touch - fullContact.last_touch) / 86400
    )

    expect(wrapper.text().includes(decimalPointedPeriod.toString())).toBeFalsy()
    expect(wrapper.text().includes(rounedPeriod.toString())).toBeTruthy()
  })
})
