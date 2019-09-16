import contact from 'fixtures/contacts/contact.json'

import { normalizeContactsForEmailCompose } from '.'

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
      { ...contact, email: null },
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
