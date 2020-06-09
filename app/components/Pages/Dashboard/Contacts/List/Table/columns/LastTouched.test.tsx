import React from 'react'
import { render } from 'enzyme'
import toJson from 'enzyme-to-json'

import fullContact from 'fixtures/contacts/full-contact.json'

import mockDate, { RealDate } from 'utils/test-utils/mock-date'

// TODO: full-contact.json data is old and needs update
const contact: any = {
  ...fullContact,
  user: fullContact.user as IUser,
  users: fullContact.users as IUser[]
}

import LastTouched from './LastTouched'

describe('Contacts list last touched component', () => {
  beforeEach(() => {
    mockDate('2019-05-26T12:04:04Z')
  })

  afterEach(() => {
    global.Date = RealDate
  })

  it('renders for contacts with last touch', () => {
    const wrapper = render(<LastTouched contact={contact} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('renders for contacts without last touch', () => {
    contact.last_touch = null

    const wrapper = render(<LastTouched contact={contact} />)

    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
