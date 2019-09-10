// @ts-ignore
// eslint-disable-next-line
import recipient from 'fixtures/contacts/contact-item'

import { normalizeContactsForEmailCompose } from '.'

const contact = recipient as INormalizedContact

describe('email normalize contacts helper', () => {
  it('normalizeContactsForEmailCompose', () => {
    const result = normalizeContactsForEmailCompose([contact, contact])

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      Array(2).fill({
        recipient_type: 'Email',
        email: contact.email,
        contact
      })
    )

    const resultWithoutEmail = normalizeContactsForEmailCompose([
      contact,
      { ...contact, email: undefined },
      { ...contact, email: '' },
      contact
    ])

    expect(resultWithoutEmail).toHaveLength(2)
    expect(resultWithoutEmail).toEqual(
      Array(2).fill({
        recipient_type: 'Email',
        email: contact.email,
        contact
      })
    )
  })
})
