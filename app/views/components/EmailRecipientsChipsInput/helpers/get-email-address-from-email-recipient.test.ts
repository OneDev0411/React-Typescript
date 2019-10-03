import { parseEmailRecipient } from './parse-email-recipient'

describe('parseEmailRecipient', () => {
  test('it works if both display name and emails exist', () => {
    const { emailAddress, displayName } = parseEmailRecipient(
      'Alireza <alireza.mirian@gmail.com>'
    )

    expect(emailAddress).toBe('alireza.mirian@gmail.com')
    expect(displayName).toBe('Alireza')
  })

  test("it works when display name doesn't exist", () => {
    const { emailAddress, displayName } = parseEmailRecipient(
      '<alireza.mirian@gmail.com>'
    )

    expect(emailAddress).toBe('alireza.mirian@gmail.com')
    expect(displayName).toBe('')
  })

  test('it works when the value is just an email', () => {
    const { emailAddress, displayName } = parseEmailRecipient(
      'alireza.mirian@gmail.com'
    )

    expect(emailAddress).toBe('alireza.mirian@gmail.com')
    expect(displayName).toBe('')
  })
})
