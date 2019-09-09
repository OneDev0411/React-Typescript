// @ts-ignore
// eslint-disable-next-line
import recipient from 'fixtures/contacts/contact-item'

import {
  normalizeContactForEmailCompose,
  normalizeContactsForEmailCompose
} from '.'

const contact = recipient as INormalizedContact

describe('normalize-contact helpers', () => {
  it('normalizeContactForEmailCompose', () => {
    const denormalized = normalizeContactForEmailCompose(contact)

    expect(denormalized).toHaveLength(1)
    expect(denormalized).toEqual([
      {
        recipient_type: 'Email',
        email: contact.email,
        contact
      }
    ])
  })

  it('normalizeContactsForEmailCompose', () => {
    const denormalized = normalizeContactsForEmailCompose([contact, contact])

    expect(denormalized).toHaveLength(2)
    expect(denormalized).toEqual(
      Array(2).fill({
        recipient_type: 'Email',
        email: contact.email,
        contact
      })
    )
  })
})
