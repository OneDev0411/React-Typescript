import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import fullContact from 'fixtures/contacts/full-contact.json'

import mockDate, { RealDate } from 'utils/test-utils/mock-date'

import { AppTheme } from '../../../AppTheme'

import { LastTouched } from '.'

describe('Contact profile last touched component', () => {
  beforeEach(() => {
    mockDate('2019-05-26T12:04:04Z')
  })

  afterEach(() => {
    global.Date = RealDate
  })

  it('renders', () => {
    const wrapper = render(
      <AppTheme>
        <LastTouched contact={fullContact as any} />
      </AppTheme>
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders touch periods without decimal points', () => {
    const wrapper = render(
      <AppTheme>
        <LastTouched contact={fullContact as any} />
      </AppTheme>
    )

    const decimalPointedPeriod =
      (fullContact.next_touch! - fullContact.last_touch!) / 86400
    const rounedPeriod = Math.round(
      (fullContact.next_touch! - fullContact.last_touch!) / 86400
    )

    expect(wrapper.text().includes(decimalPointedPeriod.toString())).toBeFalsy()
    expect(wrapper.text().includes(rounedPeriod.toString())).toBeTruthy()
  })
})
