import { render } from '@testing-library/react'

import * as React from 'react'

import contact from 'fixtures/contacts/contact.json'

import ContactItem from '.'

const recipient = {
  contactId: contact.id,
  data_type: 'contact',
  email: contact.email,
  emails: contact.emails,
  name: contact.display_name
}

describe('ContactItem', () => {
  it('should render', () => {
    render(<ContactItem recipient={recipient} />)
  })

  it('should render email as well as contact name', () => {
    const { container } = render(<ContactItem recipient={recipient} />)

    expect(container.textContent).toContain('esparipour@gmail.com')
    expect(container.textContent).toContain('Mojtaba Espari Pour')
  })
})
