import React from 'react'

import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import { frequencyToString } from '@app/components/Pages/Dashboard/Contacts/components/ManageRelationship/helper'
import fullContact from 'fixtures/contacts/full-contact.json'
import mockDate, { RealDate } from 'utils/test-utils/mock-date'

import { TestBed } from '../../../../tests/unit/TestBed'
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
      <TestBed>
        <AppTheme>
          <LastTouched contact={fullContact as any} />
        </AppTheme>
      </TestBed>
    )

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders touch periods without decimal points', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <LastTouched contact={fullContact as any} />
        </AppTheme>
      </TestBed>
    )

    const decimalPointedPeriod =
      (fullContact.next_touch! - fullContact.last_touch!) / 86400

    expect(wrapper.text().includes(decimalPointedPeriod.toString())).toBeFalsy()
  })

  it('renders monthly touch reminder freq', () => {
    const wrapper = render(
      <TestBed>
        <AppTheme>
          <LastTouched contact={fullContact as any} />
        </AppTheme>
      </TestBed>
    )

    const freqString = frequencyToString(
      fullContact.touch_freq as any
    ).toLowerCase()

    expect(wrapper.text().includes(freqString)).toBeTruthy()
  })
})
